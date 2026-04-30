import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import { authJwt, AuthRequest } from '../middleware/authJwt.js';
import { uploadToCloudinary } from '../services/cloudinary.js';
import Profile from '../models/Profile.js';
import Education from '../models/Education.js';
import Experience from '../models/Experience.js';
import Achievement from '../models/Achievement.js';
import Project from '../models/Project.js';
import Skill from '../models/Skill.js';
import Visit from '../models/Visit.js';
import Admin from '../models/Admin.js';

const router = Router();

// All admin routes require JWT
router.use(authJwt);

// ──────────────────────────── PROFILE ────────────────────────────

/**
 * PUT /api/admin/profile
 * Update the singleton profile document.
 */
router.put('/profile', async (req: AuthRequest, res: Response) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      {},
      { $set: req.body },
      { new: true, upsert: true, runValidators: true }
    ).lean();
    res.json(profile);
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// ──────────────────────────── EDUCATION ────────────────────────────

router.get('/education', async (_req: AuthRequest, res: Response) => {
  try {
    const items = await Education.find().sort({ orderIndex: 1 }).lean();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch education' });
  }
});

router.post('/education', async (req: AuthRequest, res: Response) => {
  try {
    const item = await Education.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create education' });
  }
});

router.put('/education/:id', async (req: AuthRequest, res: Response) => {
  try {
    const item = await Education.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).lean();
    if (!item) { res.status(404).json({ error: 'Not found' }); return; }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update education' });
  }
});

router.delete('/education/:id', async (req: AuthRequest, res: Response) => {
  try {
    const item = await Education.findByIdAndDelete(req.params.id);
    if (!item) { res.status(404).json({ error: 'Not found' }); return; }
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete education' });
  }
});

// ──────────────────────────── EXPERIENCE ────────────────────────────

router.get('/experience', async (_req: AuthRequest, res: Response) => {
  try {
    const items = await Experience.find().sort({ orderIndex: 1 }).lean();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch experience' });
  }
});

router.post('/experience', async (req: AuthRequest, res: Response) => {
  try {
    const item = await Experience.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create experience' });
  }
});

router.put('/experience/:id', async (req: AuthRequest, res: Response) => {
  try {
    const item = await Experience.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).lean();
    if (!item) { res.status(404).json({ error: 'Not found' }); return; }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update experience' });
  }
});

router.delete('/experience/:id', async (req: AuthRequest, res: Response) => {
  try {
    const item = await Experience.findByIdAndDelete(req.params.id);
    if (!item) { res.status(404).json({ error: 'Not found' }); return; }
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete experience' });
  }
});

// ──────────────────────────── ACHIEVEMENTS ────────────────────────────

router.get('/achievements', async (_req: AuthRequest, res: Response) => {
  try {
    const items = await Achievement.find().sort({ orderIndex: 1 }).lean();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

router.post('/achievements', async (req: AuthRequest, res: Response) => {
  try {
    const item = await Achievement.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create achievement' });
  }
});

router.put('/achievements/:id', async (req: AuthRequest, res: Response) => {
  try {
    const item = await Achievement.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).lean();
    if (!item) { res.status(404).json({ error: 'Not found' }); return; }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update achievement' });
  }
});

router.delete('/achievements/:id', async (req: AuthRequest, res: Response) => {
  try {
    const item = await Achievement.findByIdAndDelete(req.params.id);
    if (!item) { res.status(404).json({ error: 'Not found' }); return; }
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete achievement' });
  }
});

// ──────────────────────────── PROJECTS ────────────────────────────

router.get('/projects', async (_req: AuthRequest, res: Response) => {
  try {
    const items = await Project.find().sort({ orderIndex: 1 }).lean();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

router.post('/projects', async (req: AuthRequest, res: Response) => {
  try {
    const item = await Project.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

router.put('/projects/:id', async (req: AuthRequest, res: Response) => {
  try {
    const item = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).lean();
    if (!item) { res.status(404).json({ error: 'Not found' }); return; }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

router.delete('/projects/:id', async (req: AuthRequest, res: Response) => {
  try {
    const item = await Project.findByIdAndDelete(req.params.id);
    if (!item) { res.status(404).json({ error: 'Not found' }); return; }
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// ──────────────────────────── SKILLS ────────────────────────────

router.get('/skills', async (_req: AuthRequest, res: Response) => {
  try {
    const items = await Skill.find().sort({ category: 1, orderIndex: 1 }).lean();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

router.post('/skills', async (req: AuthRequest, res: Response) => {
  try {
    const item = await Skill.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create skill' });
  }
});

router.put('/skills/:id', async (req: AuthRequest, res: Response) => {
  try {
    const item = await Skill.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).lean();
    if (!item) { res.status(404).json({ error: 'Not found' }); return; }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update skill' });
  }
});

router.delete('/skills/:id', async (req: AuthRequest, res: Response) => {
  try {
    const item = await Skill.findByIdAndDelete(req.params.id);
    if (!item) { res.status(404).json({ error: 'Not found' }); return; }
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete skill' });
  }
});

// ──────────────────────────── VISITS (Analytics) ────────────────────────────

router.get('/visits', async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 100, 500);
    const skip = (page - 1) * limit;

    const [visits, total] = await Promise.all([
      Visit.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Visit.countDocuments(),
    ]);

    res.json({ visits, total, page, limit });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch visits' });
  }
});

router.get('/visits/aggregate', async (req: AuthRequest, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const since = new Date();
    since.setDate(since.getDate() - days);

    const [byDay, byBrowser, byOs, byCountry, total] = await Promise.all([
      Visit.aggregate([
        { $match: { createdAt: { $gte: since } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Visit.aggregate([
        { $match: { createdAt: { $gte: since } } },
        { $group: { _id: '$browser', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      Visit.aggregate([
        { $match: { createdAt: { $gte: since } } },
        { $group: { _id: '$os', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      Visit.aggregate([
        { $match: { createdAt: { $gte: since } } },
        { $group: { _id: '$country', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      Visit.countDocuments({ createdAt: { $gte: since } }),
    ]);

    res.json({ days, total, byDay, byBrowser, byOs, byCountry });
  } catch (err) {
    res.status(500).json({ error: 'Failed to aggregate visits' });
  }
});

// ──────────────────────────── REBUILD WEBHOOK ────────────────────────────

/**
 * POST /api/admin/rebuild
 * Triggers a rebuild webhook (Vercel/Cloudflare Pages).
 */
router.post('/rebuild', async (_req: AuthRequest, res: Response) => {
  try {
    const webhookUrl = process.env.REBUILD_WEBHOOK_URL;
    if (!webhookUrl) {
      res.status(400).json({ error: 'Rebuild webhook URL not configured' });
      return;
    }

    const response = await fetch(webhookUrl, { method: 'POST' });
    if (!response.ok) {
      res.status(502).json({ error: 'Webhook trigger failed' });
      return;
    }

    res.json({ message: 'Rebuild triggered successfully' });
  } catch (err) {
    console.error('Rebuild webhook error:', err);
    res.status(500).json({ error: 'Failed to trigger rebuild' });
  }
});

// ──────────────────────────── PASSWORD CHANGE ────────────────────────────

router.put('/password', async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: 'Current and new passwords required' });
      return;
    }

    if (newPassword.length < 8) {
      res.status(400).json({ error: 'Password must be at least 8 characters' });
      return;
    }

    const admin = await Admin.findById(req.adminId);
    if (!admin) {
      res.status(404).json({ error: 'Admin not found' });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: 'Current password is incorrect' });
      return;
    }

    admin.passwordHash = await bcrypt.hash(newPassword, 12);
    await admin.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Password change error:', err);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// ──────────────────────────── IMAGE UPLOAD ────────────────────────────

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WebP, AVIF, GIF) are allowed'));
    }
  },
});

/**
 * POST /api/admin/upload
 * Upload an image via multer → Cloudinary. Returns the secure URL.
 */
router.post('/upload', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No image file provided' });
      return;
    }
    const folder = (req.body.folder as string) || 'portfolio';
    const url = await uploadToCloudinary(req.file.buffer, folder);
    res.json({ url });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

export default router;
