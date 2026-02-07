import mongoose from 'mongoose';

const MONGODB_URI = import.meta.env.MONGODB_URI || import.meta.env.MONGO_DB;


if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable in .env'
  );
}

// Global cached connection
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log(`Connected successfully to Mongo DB: ${MONGODB_URI}`);
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Define Schema
const TravelConfigSchema = new mongoose.Schema({
  travelName: { type: String, required: true, unique: true }, // Key to identify the trip (e.g. TRAVEL_DEMO)
  site: {
    logo: String,
    title: String,
    subtitle: String,
    defaultBanner: String, // Moved here
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
  flights: [{
    title: String,
    segments: [{
      title: String,
      detail: String,
      duration: String,
      note: String,
      terminal: String, // Can be string or number in JSON, better use String or Mixed
      company: String,
      number: String,
      plane: String,
      class: String
    }]
  }],
  airlineLogos: { type: Map, of: String },
  itinerary: [{
    city: String,
    days: String,
    special: String,
    must: [String],
    transfer: String
  }],
  stops: [{
    name: String,
    coords: [Number]
  }],
  expenses: {
    items: [{
      name: String,
      category: String,
      amountEUR: Number,
      status: String,
      city: String,
      note: String,
      coords: [Number],
      quality: Number
    }],
    budget: Number,
    categories: [{
      name: String,
      description: String,
      color: String
    }]
  },
  interactiveBackground: {
    icons: [String],
    hanzi: [String],
    colors: [String],
    count: Number,
    sizeMin: Number,
    sizeMax: Number,
    speedMin: Number,
    speedMax: Number,
    opacity: Number,
    maxDist: Number,
    repulsionForce: Number,
    driftAmplitude: Number,
    rotationSpeed: Number
  },
  map: {
    center: [Number],
    zoom: Number,
    pathColor: String,
    pathWeight: Number
  }
}, { timestamps: true });

// Prevent overwrite in dev
// User Schema for Authentication
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', UserSchema);

export const TravelConfig = mongoose.models.TravelConfig || mongoose.model('TravelConfig', TravelConfigSchema);

export default dbConnect;
