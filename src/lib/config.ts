import dbConnect, { TravelConfig } from './db';
import travelConfigJson from '../data/travel.config.json';

export async function getTravelConfig() {
  const travelName = import.meta.env.TRAVEL_NAME;
  console.log("travelName", travelName);

  if (!travelName) {
    console.warn("TRAVEL_NAME not defined via env, falling back to local JSON.");
    return travelConfigJson;
  }

  try {
    await dbConnect();
    const config = await TravelConfig.findOne({ travelName }).lean();

    if (!config) {
      console.warn(`Configuration for ${travelName} not found in DB, falling back to local JSON.`);
      return travelConfigJson;
    }

    // Convert _id to string if needed, or just return as is
    // Mongoose .lean() returns POJO which is what we want
    return JSON.parse(JSON.stringify(config)); // Ensure serializable for Astro

  } catch (error) {
    console.error("Error fetching configuration from DB:", error);
    return travelConfigJson;
  }
}
