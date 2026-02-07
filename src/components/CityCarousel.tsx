import React, { useEffect, useMemo, useState, useRef } from "react"

export default function CityCarousel({ cities = [], defaultBanner = "" }: { cities?: any[], defaultBanner?: string }) {
  const ROTATE_MS = 5000 // rotate every X milliseconds (adjustable)
  const DEFAULT_BANNER = defaultBanner

  // Show the default banner immediately on first render
  const [index, setIndex] = useState(() =>
    Math.floor(Math.random() * Math.max(1, cities.length))
  )
  const [loaded, setLoaded] = useState(true)
  const [imageUrl, setImageUrl] = useState<string | null>(DEFAULT_BANNER)
  const [attribution, setAttribution] = useState<{
    author?: string
    authorUrl?: string
  } | null>(null)
  const [progress, setProgress] = useState(0)
  const startRef = useRef<number | null>(null)

  // Server-side endpoint will call Unsplash with the API key (kept secret).
  async function fetchForCity(cityKey: string) {
    try {
      // indicate we're loading a new remote image (keep default visible until loaded)
      setLoaded(false)
      const res = await fetch(`/api/unsplash/${cityKey}`)
      if (!res.ok) throw new Error("unsplash fetch failed")
      const json = await res.json()
      setImageUrl(json.url)
      setAttribution({ author: json.author, authorUrl: json.authorUrl })
      // reset progress timer when a new image is requested
      startRef.current = Date.now()
      setProgress(0)
    } catch (err) {
      // fallback to source.unsplash (no API key) if server or network fails
      const city = cities.find((c: any) => c.key === cityKey)
      const fallback = `https://source.unsplash.com/1200x800/?${encodeURIComponent(
        (city && city.query) || cityKey
      )}`
      setImageUrl(fallback)
      setAttribution(null)
      // allow the preloader to handle showing the image or fallback
      setLoaded(false)
      startRef.current = Date.now()
      setProgress(0)
    }
  }

  // initial fetch
  useEffect(() => {
    // Start progress from now and keep the default banner visible while the first
    // remote image is fetched in background.
    startRef.current = Date.now()
    fetchForCity(cities[index].key)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // (Removed an older stubborn interval.) Rotation is handled below using ROTATE_MS.

  // Rotate every ROTATE_MS milliseconds to a random city
  useEffect(() => {
    const id = setInterval(() => {
      const next = Math.floor(Math.random() * cities.length)
      setIndex(next)
      fetchForCity(cities[next].key)
    }, ROTATE_MS)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ROTATE_MS])

  // Progress animation using requestAnimationFrame for smoothness
  useEffect(() => {
    let raf = 0
    function tick() {
      if (!startRef.current) startRef.current = Date.now()
      const elapsed = Date.now() - (startRef.current || 0)
      const pct = Math.min(100, (elapsed / ROTATE_MS) * 100)
      setProgress(pct)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [ROTATE_MS])

  // Preload current image to trigger fade-in when it changes
  useEffect(() => {
    if (!imageUrl) return

    // If the image is the default banner, show it immediately without preloading
    if (imageUrl === DEFAULT_BANNER) {
      setLoaded(true)
      return
    }

    setLoaded(false)
    const img = new Image()
    img.src = imageUrl
    img.onload = () => setLoaded(true)
    img.onerror = () => {
      // On failure, fall back to default banner and clear attribution
      if (imageUrl !== DEFAULT_BANNER) {
        setImageUrl(DEFAULT_BANNER)
        setAttribution(null)
      }
      setLoaded(true)
    }
    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [imageUrl])

  return (
    <div className="mx-auto w-full max-w-5xl relative group">
      <div className="absolute -inset-1 bg-linear-to-r from-cyan-500/20 via-violet-500/20 to-rose-500/20 rounded-3xl blur-md opacity-50 group-hover:opacity-80 transition duration-700"></div>
      <div className="relative overflow-hidden rounded-2xl shadow-2xl h-64 sm:h-96 bg-obsidian-800 border border-white/10">
        {/* Background image with fade transition */}
        <img
          src={imageUrl ?? ""}
          alt={
            imageUrl === DEFAULT_BANNER
              ? "Banner por defecto"
              : `${cities[index]?.label ?? "Ciudad"} - imagen`
          }
          onError={() => {
            // DOM-level fallback in case image can't be fetched by browser
            if (imageUrl !== DEFAULT_BANNER) {
              setImageUrl(DEFAULT_BANNER)
              setAttribution(null)
            }
            setLoaded(true)
          }}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Overlay with city label */}
        <div className="absolute inset-0 flex items-end">
          <div className="w-full bg-linear-to-t from-black/50 to-transparent text-white p-4 sm:p-6">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div>
                {/* Hide the city label when showing the default banner */}
                {imageUrl === DEFAULT_BANNER ? null : (
                  <div className="text-lg sm:text-2xl font-semibold">
                    {cities[index]?.label ?? "Ciudad"}
                  </div>
                )}
              </div>
              {/* <div className="text-xs opacity-80">
                Imágenes aleatorias • cambia cada 3s
              </div> */}
            </div>
          </div>
        </div>

        {/* Progress bar at bottom */}
        <div className="absolute left-0 right-0 bottom-0 h-1 bg-white/10">
          <div
            className="h-full bg-white/80"
            style={{
              width: `calc(100% - ${progress.toFixed(0)}%)`,
              transition: "width 120ms linear",
            }}
          />
        </div>

        {/* Attribution */}
        {attribution?.author ? (
          <div className="absolute left-3 bottom-3 text-xs text-white/90">
            <a
              href={attribution.authorUrl ?? "#"}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              {attribution.author}
            </a>
          </div>
        ) : null}
      </div>
    </div>
  )
}
