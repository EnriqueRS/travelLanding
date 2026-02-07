import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import path from 'path';

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_DB;

if (!MONGO_URI) {
  console.error('Error: MONGO_DB or MONGODB_URI environment variable is not defined.');
  process.exit(1);
}

// User Schema (Simplified copy for script to avoid importing from src which might have TS issues or other deps)
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function createUser () {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log('Usage: node scripts/create-user.js <username> <password>');
    process.exit(1);
  }

  const [username, password] = args;

  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update if exists, or create new
    const user = await User.findOneAndUpdate(
      { username },
      { username, password: hashedPassword },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`User '${user.username}' created/updated successfully.`);
    process.exit(0);

  } catch (error) {
    console.error('Error creating user:', error);
    process.exit(1);
  }
}

createUser();
