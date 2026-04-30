import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Profile from './models/Profile.js';
import Education from './models/Education.js';
import Experience from './models/Experience.js';
import Achievement from './models/Achievement.js';
import Project from './models/Project.js';
import Admin from './models/Admin.js';

dotenv.config();

async function seed() {
  let mongoUri = process.env.MONGODB_URI;
  let connected = false;

  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri);
      console.log('✅ Connected to MongoDB');
      connected = true;
    } catch {
      console.warn('⚠️  Could not connect to MongoDB at', mongoUri);
      console.warn('   Falling back to in-memory MongoDB...');
    }
  }

  if (!connected) {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mongod = new MongoMemoryServer();
    await mongod.start();
    await mongoose.connect(mongod.getUri());
    console.log('✅ Connected to in-memory MongoDB');
    console.log('⚠️  Note: Data will not persist after this process exits.');
  }

  // ── Admin ──
  const adminEmail = process.env.ADMIN_EMAIL || 'ayushkawane05@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Update_PASSWORD';

  const existingAdmin = await Admin.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const hash = await bcrypt.hash(adminPassword, 12);
    await Admin.create({ email: adminEmail, passwordHash: hash });
    console.log(`✅ Admin created: ${adminEmail}`);
  } else {
    console.log(`ℹ️  Admin already exists: ${adminEmail}`);
  }

  // ── Profile (singleton) ──
  const existingProfile = await Profile.findOne();
  if (!existingProfile) {
    await Profile.create({
      name: 'Ayush Kawane',
      tagline: 'Software Developer • AI/ML Enthusiast',
      bio: 'B.Tech in AI & Data Science at VIT Pune. Building scalable backend systems and AI-powered applications. Currently a Product Developer Intern at Darwinbox.',
      avatarUrl: '',
      contact: {
        email: 'ayushkawane05@example.com',
        linkedin: 'https://linkedin.com/in/ayushkawane',
        github: 'https://github.com/ayushkawane',
        twitter: '',
        location: 'Pune, India',
      },
      ignoredIps: [],
      scanlineDefault: false,
    });
    console.log('✅ Profile created');
  } else {
    console.log('ℹ️  Profile already exists');
  }

  // ── Education ──
  if ((await Education.countDocuments()) === 0) {
    await Education.insertMany([
      {
        institution: 'Vishwakarma Institute of Technology',
        degree: 'B.Tech in Artificial Intelligence and Data Science',
        startYear: 2022,
        endYear: 2026,
        detail: 'CGPA: 8.51/10.0 • Pune, India',
        orderIndex: 0,
      },
    ]);
    console.log('✅ Education seeded');
  }

  // ── Experience ──
  if ((await Experience.countDocuments()) === 0) {
    await Experience.insertMany([
      {
        role: 'Product Developer Intern',
        company: 'Darwinbox',
        startDate: 'Jan 2026',
        endDate: 'Present',
        bullets: [
          'Built scalable backend services using Node.js and MongoDB supporting high-throughput enterprise workflows for 1000+ concurrent users',
          'Designed CollabScore — an AI evaluation system using role-based LLM prompting; improved evaluation accuracy by ~30% over manual methods',
          'Architected a multi-stage AI orchestration pipeline (fetch → transform → sign) with tool-calling architecture, eliminating manual intervention in multi-step task execution',
          'Optimized RESTful APIs within a microservices architecture, reducing average latency and improving modularity and horizontal scalability',
        ],
        orderIndex: 0,
      },
    ]);
    console.log('✅ Experience seeded');
  }

  // ── Projects ──
  if ((await Project.countDocuments()) === 0) {
    await Project.insertMany([
      {
        title: 'AI Health Chat System',
        description: 'LLM-powered healthcare chatbot with multi-turn context, session memory, and intent detection pipelines for patient triage-style queries.',
        thumbnailUrl: '',
        stack: ['LLMs', 'Prompt Engineering', 'NLP', 'Python'],
        githubUrl: '',
        demoUrl: '',
        outcome: 'Hackathon Finalist – IIT BHU 2025',
        orderIndex: 0,
      },
      {
        title: 'E-Commerce Product Management Platform',
        description: 'Full-stack MERN application with JWT authentication and RBAC supporting admin, vendor, and customer roles.',
        thumbnailUrl: '',
        stack: ['MERN Stack', 'Node.js', 'MongoDB', 'REST APIs'],
        githubUrl: '',
        demoUrl: '',
        outcome: 'Freelance 2025 — Reduced query latency by 40%',
        orderIndex: 1,
      },
      {
        title: 'Multi-Disease Forecasting using Deep Learning',
        description: 'Multi-disease prediction system using pretrained DenseNet with transfer learning for medical image classification across 5+ disease classes.',
        thumbnailUrl: '',
        stack: ['Python', 'DenseNet', 'TensorFlow', 'Transfer Learning'],
        githubUrl: '',
        demoUrl: '',
        outcome: 'Industry Project 2025 — 88%+ classification accuracy',
        orderIndex: 2,
      },
    ]);
    console.log('✅ Projects seeded');
  }

  // ── Achievements ──
  if ((await Achievement.countDocuments()) === 0) {
    await Achievement.insertMany([
      {
        type: 'paper' as const,
        title: 'IoT-Based Smart Urban Management System',
        description: 'Developed an IoT-based smart urban management system for real-time city monitoring and resource optimization.',
        imageUrl: '',
        linkUrl: '',
        year: 2025,
        orderIndex: 0,
      },
      {
        type: 'achievement' as const,
        title: 'Third Eye for Blind Person — Patent Filed',
        description: 'Assistive navigation technology for visually impaired users leveraging computer vision and audio feedback.',
        imageUrl: '',
        linkUrl: '',
        year: 2024,
        orderIndex: 1,
      },
      {
        type: 'achievement' as const,
        title: 'Captain, VIT Kho-Kho Team',
        description: 'Led team strategy, coordination, and performance planning in inter-college competitions.',
        imageUrl: '',
        linkUrl: '',
        year: 2024,
        orderIndex: 2,
      },
      {
        type: 'achievement' as const,
        title: 'Organizer, VIT EPEC Fest',
        description: 'Managed end-to-end event operations including scheduling, logistics, and coordination for 500+ attendees.',
        imageUrl: '',
        linkUrl: '',
        year: 2024,
        orderIndex: 3,
      },
    ]);
    console.log('✅ Achievements seeded');
  }

  console.log('\n🎉 Seed complete!');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
