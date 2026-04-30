import { Router, Request, Response } from 'express';
import multer from 'multer';
import { authJwt } from '../middleware/authJwt.js';
import { uploadToCloudinary } from '../services/cloudinary.js';

const router = Router();

// multer stores file in memory buffer — no disk writes
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
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
 * Upload an image via multer → Cloudinary.
 * Returns the secure URL.
 */
router.post('/', authJwt, upload.single('image'), async (req: Request, res: Response) => {
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
