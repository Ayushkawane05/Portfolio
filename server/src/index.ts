import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import contentRoutes from './routes/content.js';
import authRoutes from './routes/auth.js';
import trackRoutes from './routes/track.js';
import adminRoutes from './routes/admin.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimit.js';
import { initCloudinary } from './services/cloudinary.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ── Security ──
app.use(helmet());
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'http://localhost:5000',
    'http://localhost:5001'
  ],
  credentials: true,
}));

// ── Compression (Brotli + gzip) ──
app.use(compression());

// ── Body parsing ──
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// ── Rate limiting ──
app.use('/api/', apiLimiter);

// ── Routes ──
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/content', contentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/track', trackRoutes);
app.use('/api/visits', trackRoutes);  // re-uses track router — only GET /count matches here
app.use('/api/admin', adminRoutes);   // includes upload sub-routes

// ── Error handler ──
app.use(errorHandler);

// ── Database + Server startup ──
async function start() {
  let mongoUri = process.env.MONGODB_URI;

  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri);
      console.log('✅ Connected to MongoDB');
    } catch (err) {
      console.warn('⚠️  Could not connect to MongoDB at', mongoUri);
      console.warn('   Falling back to in-memory MongoDB...');
      mongoUri = undefined;
    }
  }

  // Fallback to in-memory MongoDB for development
  if (!mongoUri || mongoose.connection.readyState !== 1) {
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = new MongoMemoryServer();
      await mongod.start();
      const memUri = mongod.getUri();
      await mongoose.connect(memUri);
      console.log('✅ Connected to in-memory MongoDB');
    } catch (err) {
      console.error('❌ Failed to start in-memory MongoDB:', err);
      process.exit(1);
    }
  }

  // Initialize Cloudinary (optional — won't fail if not configured)
  if (process.env.CLOUDINARY_CLOUD_NAME) {
    initCloudinary();
    console.log('✅ Cloudinary configured');
  }

  // Auto-seed admin in dev when DB is empty
  const Admin = (await import('./models/Admin.js')).default;
  const Profile = (await import('./models/Profile.js')).default;
  const Education = (await import('./models/Education.js')).default;
  const Experience = (await import('./models/Experience.js')).default;
  const Project = (await import('./models/Project.js')).default;
  const Achievement = (await import('./models/Achievement.js')).default;
  const Skill = (await import('./models/Skill.js')).default;
  const bcrypt = (await import('bcryptjs')).default;

  const adminCount = await Admin.countDocuments();
  if (adminCount === 0) {
    const email = process.env.ADMIN_EMAIL || 'ayushkawane05@gmail.com';
    const password = process.env.ADMIN_PASSWORD || 'Update_PASSWORD';
    const hash = await bcrypt.hash(password, 12);
    await Admin.create({ email, passwordHash: hash });
    console.log(`✅ Auto-seeded admin: ${email}`);
  }

  const profileCount = await Profile.countDocuments();
  if (profileCount === 0) {
    await Profile.create({
      name: 'Ayush Kawane',
      tagline: 'Software Developer • AI/ML Enthusiast',
      bio: 'B.Tech in AI & Data Science at VIT Pune. Building scalable backend systems and AI-powered applications. Currently a Product Developer Intern at Darwinbox.',
      contact: {
        email: 'ayushkawane05@example.com',
        linkedin: 'https://linkedin.com/in/ayushkawane',
        github: 'https://github.com/ayushkawane',
        location: 'Pune, India'
      }
    });
    
    // Seed elaborated education for timeline view
    await Education.create([
      {
        institution: 'Vishwakarma Institute of Technology',
        degree: 'B.Tech in Artificial Intelligence and Data Science',
        startYear: 2022,
        endYear: 2026,
        category: 'College',
        detail: 'CGPA: 8.51/10.0 • Specializing in Large Language Models and Distributed Computing.',
        extracurriculars: ['AI Club Lead', 'Hackathon Finalist', 'IEEE Member'],
        milestones: [
          { date: 'SEP 2023', label: 'ML_FOUNDATIONS', description: 'Started deep-dive into Neural Networks and Gradient Descent.' },
          { date: 'JAN 2024', label: 'RESEARCH_PROJECT', description: 'Initiated research on Optimized Transformer Architectures.' },
          { date: 'JUN 2024', label: 'HACKATHON_WIN', description: 'Won first prize in Internal AI Hackathon.' }
        ],
        orderIndex: 0
      },
      {
        institution: 'Kendriya Vidyalaya',
        degree: 'HSC (Science)',
        startYear: 2020,
        endYear: 2022,
        category: 'School',
        detail: 'Percentage: 94% • Focused on Physics, Chemistry, and Mathematics.',
        extracurriculars: ['Chess Champion', 'National Science Exhibition Participant'],
        milestones: [
          { date: 'MAY 2021', label: 'PHYSICS_AWARD', description: 'Received highest marks in National Level Physics Olympiad.' },
          { date: 'MAR 2022', label: 'BOARD_EXAMS', description: 'Completed HSC Boards with distinction.' }
        ],
        orderIndex: 1
      }
    ]);
    
    await Experience.create({
      role: 'Product Developer Intern',
      company: 'Darwinbox',
      startDate: 'Jan 2026',
      endDate: 'Present',
      bullets: ['Built scalable backend services using Node.js and MongoDB']
    });

    await Project.create({
      title: 'AI Health Chat System',
      description: 'LLM-powered healthcare chatbot.',
      stack: ['LLMs', 'Python'],
      outcome: 'Hackathon Finalist'
    });

    await Achievement.create({
      type: 'achievement',
      title: 'Patent Filed: Third Eye',
      description: 'Assistive navigation for visually impaired.',
      year: 2024
    });

    await Skill.create([
      { name: 'REACT', level: 90, category: 'FRONTEND', orderIndex: 1 },
      { name: 'NODE.JS', level: 85, category: 'BACKEND', orderIndex: 1 },
      { name: 'MONGODB', level: 80, category: 'BACKEND', orderIndex: 2 },
      { name: 'PYTHON', level: 75, category: 'AI/ML', orderIndex: 1 },
    ]);

    console.log('✅ Auto-seeded content');
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

start();
