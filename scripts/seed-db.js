import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_DB;

if (!MONGO_URI) {
  console.error('Error: MONGO_DB or MONGODB_URI environment variable is not defined.');
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.join(__dirname, '../src/data/travel.config.json');

// Define Schema (Simplified copy for script)
const TravelConfigSchema = new mongoose.Schema({
  travelName: { type: String, required: true, unique: true },
  site: {
    logo: String,
    title: String,
    subtitle: String,
    defaultBanner: String,
    blog: {
      name: String,
      url: String,
      logo: String
    }
  },
  trip: {
    startISO: String
  },
  cities: [{
    key: String,
    label: String,
    query: String
  }],
  flights: [mongoose.Schema.Types.Mixed], // Mixed for simplicity in migration
  airlineLogos: { type: Map, of: String },
  itinerary: [mongoose.Schema.Types.Mixed],
  stops: [mongoose.Schema.Types.Mixed],
  expenses: mongoose.Schema.Types.Mixed,
  interactiveBackground: mongoose.Schema.Types.Mixed,
  map: mongoose.Schema.Types.Mixed
}, { timestamps: true, strict: false }); // strict: false to ensure we capture everything

const TravelConfig = mongoose.models.TravelConfig || mongoose.model('TravelConfig', TravelConfigSchema);

async function seed () {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const data = await fs.readFile(jsonPath, 'utf-8');
    const config = JSON.parse(data);

    const travelName = 'DEMO'; // Default name for the existing data

    console.log(`Seeding configuration for: ${travelName}`);

    await TravelConfig.findOneAndUpdate(
      { travelName },
      { ...config, travelName },
      { upsert: true, new: true }
    );

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
