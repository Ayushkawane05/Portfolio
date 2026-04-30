import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { authJwt, AuthRequest } from '../middleware/authJwt.js';
import { authLimiter } from '../middleware/rateLimit.js';

const router = Router();

/**
 * POST /api/auth/login
 * Validates credentials and sets httpOnly JWT cookie.
 */
router.post('/login', authLimiter, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({ error: 'Server configuration error' });
      return;
    }

    const token = jwt.sign({ id: admin._id }, secret, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ message: 'Login successful', admin: { email: admin.email } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * POST /api/auth/logout
 * Clears the JWT cookie.
 */
router.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.json({ message: 'Logged out' });
});

/**
 * GET /api/auth/me
 * Returns current admin info if authenticated.
 */
router.get('/me', authJwt, async (req: AuthRequest, res: Response) => {
  try {
    const admin = await Admin.findById(req.adminId).select('-passwordHash').lean();
    if (!admin) {
      res.status(404).json({ error: 'Admin not found' });
      return;
    }
    res.json({ admin });
  } catch (err) {
    console.error('Auth check error:', err);
    res.status(500).json({ error: 'Auth check failed' });
  }
});

export default router;
