import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const SECRET_KEY = process.env.JWT_SECRET || 'default-secret-key-change-me';

export function signToken(payload: object) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}
