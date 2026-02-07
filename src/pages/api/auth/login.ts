import type { APIRoute } from 'astro';
import dbConnect, { User } from '../../../lib/db';
import { verifyPassword, signToken } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return new Response(JSON.stringify({ message: 'Username and password are required' }), {
        status: 400,
      });
    }

    await dbConnect();

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), {
        status: 401,
      });
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), {
        status: 401,
      });
    }

    // Sign token
    const token = signToken({ id: user._id, username: user.username });

    // Set cookie
    cookies.set('auth_token', token, {
      httpOnly: true,
      path: '/',
      secure: import.meta.env.PROD, // Secure only in production
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return new Response(JSON.stringify({ message: 'Login successful' }), {
      status: 200,
    });
  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
    });
  }
};
