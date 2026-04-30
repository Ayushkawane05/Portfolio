import { Router, Request, Response } from 'express';
import UAParser from 'ua-parser-js';
import Visit from '../models/Visit.js';
import Profile from '../models/Profile.js';
import { trackingLimiter } from '../middleware/rateLimit.js';

const router = Router();

/**
 * Extract client IP from x-forwarded-for header or req.ip.
 */
function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || 'unknown';
}

/**
 * POST /api/track
 * Records a visit. Body: { path, referrer }
 * Server captures IP, parses User-Agent, skips if IP in ignoredIps.
 * Rate-limited: 10/min/IP.
 */
router.post('/', trackingLimiter, async (req: Request, res: Response) => {
  try {
    const ip = getClientIp(req);
    const { path = '/', referrer = '' } = req.body || {};

    // Check if IP should be ignored
    const profile = await Profile.findOne().lean();
    if (profile?.ignoredIps?.includes(ip)) {
      res.status(204).end();
      return;
    }

    // Parse User-Agent
    const userAgentString = req.headers['user-agent'] || '';
    const parser = new UAParser(userAgentString);
    const browser = parser.getBrowser();
    const os = parser.getOS();

    await Visit.create({
      ip,
      country: '', // GeoIP would be added here with a service like MaxMind
      city: '',
      browser: `${browser.name || 'Unknown'} ${browser.version || ''}`.trim(),
      os: `${os.name || 'Unknown'} ${os.version || ''}`.trim(),
      referrer,
      path,
      userAgent: userAgentString,
    });

    res.status(204).end();
  } catch (err) {
    console.error('Tracking error:', err);
    // Don't fail the page load — tracking is best-effort
    res.status(204).end();
  }
});

/**
 * GET /api/visits/count
 * Returns public visit count. Cached 60s.
 */
router.get('/count', async (_req: Request, res: Response) => {
  try {
    const count = await Visit.countDocuments();
    res.set('Cache-Control', 'public, max-age=60');
    res.json({ count });
  } catch (err) {
    console.error('Visit count error:', err);
    res.json({ count: 0 });
  }
});

export default router;
