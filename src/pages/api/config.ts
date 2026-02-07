import type { APIRoute } from 'astro';
import dbConnect, { TravelConfig } from '../../lib/db';

export const POST: APIRoute = async ({ request }) => {
  const travelName = import.meta.env.TRAVEL_NAME;

  if (!travelName) {
    return new Response(JSON.stringify({ error: 'TRAVEL_NAME not set' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await request.json();
    await dbConnect();

    // Ensure travelName in body matches env (security/integrity)
    // or just overwrite it
    const configToSave = { ...body, travelName };

    // Remove _id if present to avoid immutable field error during update if strictly replaced,
    // but findOneAndUpdate with upsert deals with it usually.
    // Better to strip _id just in case the client sent it back.
    delete configToSave._id;
    delete configToSave.createdAt;
    delete configToSave.updatedAt;

    const updatedConfig = await TravelConfig.findOneAndUpdate(
      { travelName },
      configToSave,
      { new: true, upsert: true }
    );

    return new Response(JSON.stringify(updatedConfig), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error saving config:', error);
    return new Response(JSON.stringify({ error: 'Failed to save configuration' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
