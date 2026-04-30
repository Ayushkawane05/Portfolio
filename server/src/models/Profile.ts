import mongoose, { Schema, Document } from 'mongoose';

export interface IProfile extends Document {
  name: string;
  tagline: string;
  bio: string;
  avatarUrl: string;
  contact: {
    email: string;
    linkedin: string;
    github: string;
    twitter: string;
    location: string;
  };
  ignoredIps: string[];
  scanlineDefault: boolean;
}

const ProfileSchema = new Schema<IProfile>(
  {
    name: { type: String, required: true, default: 'Ayush Kawane' },
    tagline: { type: String, required: true, default: 'Software Developer • AI/ML Enthusiast' },
    bio: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    contact: {
      email: { type: String, default: 'ayushkawane05@example.com' },
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      twitter: { type: String, default: '' },
      location: { type: String, default: 'Pune, India' },
    },
    ignoredIps: { type: [String], default: [] },
    scanlineDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IProfile>('Profile', ProfileSchema);
