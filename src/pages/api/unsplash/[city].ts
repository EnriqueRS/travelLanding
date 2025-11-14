// In development, load `.env` only when the key is not already present.
// We use a conditional dynamic import so we don't include dotenv in production bundles.
if (process.env.NODE_ENV !== 'production' && !process.env.UNSPLASH_ACCESS_KEY) {
  // top-level await is supported in Astro server routes
  await import('dotenv/config');
}

import { createApi } from "unsplash-js";
import fs from "fs/promises";
import path from "path";

// This API route must be server-rendered at request time.
export const prerender = false;

const accessKey = process.env.UNSPLASH_ACCESS_KEY;

if (!accessKey) {
  // We don't throw at import time to keep dev experience, but handlers will return 500 if missing.
  console.warn("UNSPLASH_ACCESS_KEY is not set. /api/unsplash will fallback to source.unsplash or return 500.");
}

// Cast to any to avoid strict type issues in different sdk versions.
const unsplash = createApi({ accessKey, fetch: fetch as any } as any);

export async function GET({ params }: { params: { city: string } }) {
  const city = params.city;
  // Local cache directory under `public/_unsplash_cache/<city>` so files are served as static assets
  const cacheDir = path.join(process.cwd(), "public", "_unsplash_cache", city);
  await fs.mkdir(cacheDir, { recursive: true });

  try {
  // Read cached files
  const files = (await fs.readdir(cacheDir)).filter((f: string) => /\.(jpe?g|png|webp)$/i.test(f));

    // Decide whether to serve from cache: 90% chance if cache not empty
    if (files.length > 0 && Math.random() < 0.9) {
      const pick = files[Math.floor(Math.random() * files.length)];
      const url = `/_unsplash_cache/${city}/${encodeURIComponent(pick)}`;
      return new Response(JSON.stringify({ url, author: null, authorUrl: null, source: "cache" }), { headers: { "Content-Type": "application/json" } });
    }

    // Otherwise fetch a new image from Unsplash (or Source fallback) and save it to cache
    let imageUrl: string | null = null;
    let author: string | undefined;
    let authorUrl: string | undefined;

    if (accessKey) {
      const result = await unsplash.photos.getRandom({ query: city, orientation: "landscape" } as any);
      if (result && (result as any).type !== "error") {
        const photo = (result as any).response ?? result;
        imageUrl = photo?.urls?.regular ?? photo?.urls?.full ?? photo?.urls?.raw ?? null;
        author = photo?.user?.name;
        authorUrl = photo?.user?.links?.html;
      }
    }

    // If still no image (no key or SDK failed), fallback to source.unsplash (no attribution)
    if (!imageUrl) {
      imageUrl = `https://source.unsplash.com/1200x800/?${encodeURIComponent(city)}`;
    }

    // Fetch the image bytes and save to cache
    const resp = await fetch(imageUrl);
    if (!resp.ok) {
      throw new Error(`Failed to fetch image: ${resp.status}`);
    }
    const buffer = Buffer.from(await resp.arrayBuffer());
    const contentType = resp.headers.get("content-type") || "image/jpeg";
    const ext = contentType.includes("png") ? ".png" : contentType.includes("webp") ? ".webp" : ".jpg";
    const filename = `${Date.now()}${ext}`;
    const outPath = path.join(cacheDir, filename);
    await fs.writeFile(outPath, buffer);

    // Optionally prune cache if too big (keep last 200)
    const updatedFiles = (await fs.readdir(cacheDir)).filter((f: string) => /\.(jpe?g|png|webp)$/i.test(f));
    if (updatedFiles.length > 200) {
      // sort by mtime and remove oldest
      const statPromises = updatedFiles.map(async (f: string) => {
        const s = await fs.stat(path.join(cacheDir, f));
        return { f, mtime: s.mtime.getTime() };
      });
      const stats = await Promise.all(statPromises);
      stats.sort((a: { mtime: number }, b: { mtime: number }) => a.mtime - b.mtime);
      const toRemove = stats.slice(0, stats.length - 200);
      await Promise.all(toRemove.map((r: { f: string }) => fs.rm(path.join(cacheDir, r.f))));
    }

    const publicUrl = `/_unsplash_cache/${city}/${encodeURIComponent(filename)}`;
    return new Response(JSON.stringify({ url: publicUrl, author, authorUrl, source: "api" }), { headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message ?? String(err) }), { status: 502, headers: { "Content-Type": "application/json" } });
  }
}
