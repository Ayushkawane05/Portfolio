import { Router, Request, Response } from 'express';
import Profile from '../models/Profile.js';
import Education from '../models/Education.js';
import Experience from '../models/Experience.js';
import Achievement from '../models/Achievement.js';
import Project from '../models/Project.js';
import Skill from '../models/Skill.js';

const router = Router();

/**
 * GET /api/content
 * Returns ALL public content in one batched response.
 * Cache-Control: 60s + stale-while-revalidate.
 * Called at build time by the SSG script; rarely hit at runtime.
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const [profile, education, experience, achievements, projects, skills, visitsCount] = await Promise.all([
      Profile.findOne().lean(),
      Education.find().sort({ orderIndex: 1 }).lean(),
      Experience.find().sort({ orderIndex: 1 }).lean(),
      Achievement.find().sort({ orderIndex: 1 }).lean(),
      Project.find().sort({ orderIndex: 1 }).lean(),
      Skill.find().sort({ category: 1, orderIndex: 1 }).lean(),
      Visit.countDocuments(),
    ]);

    // Strip sensitive fields from profile
    const safeProfile = profile
      ? {
          name: profile.name,
          tagline: profile.tagline,
          bio: profile.bio,
          avatarUrl: profile.avatarUrl,
          contact: profile.contact,
          scanlineDefault: profile.scanlineDefault,
        }
      : null;

    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=600');
    res.json({
      profile: safeProfile,
      education,
      experience,
      achievements,
      projects,
      skills,
      visitsCount,
    });
  } catch (err) {
    console.error('Error fetching content:', err);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

export default router;
