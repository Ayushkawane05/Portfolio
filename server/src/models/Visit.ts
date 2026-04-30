import mongoose, { Schema, Document } from 'mongoose';

export interface IVisit extends Document {
  createdAt: Date;
  ip: string;
  country: string;
  city: string;
  browser: string;
  os: string;
  referrer: string;
  path: string;
  userAgent: string;
}

const VisitSchema = new Schema<IVisit>(
  {
    ip: { type: String, default: '' },
    country: { type: String, default: '' },
    city: { type: String, default: '' },
    browser: { type: String, default: '' },
    os: { type: String, default: '' },
    referrer: { type: String, default: '' },
    path: { type: String, default: '/' },
    userAgent: { type: String, default: '' },
  },
  { timestamps: true }
);

// Index for efficient queries: most recent first
VisitSchema.index({ createdAt: -1 });

export default mongoose.model<IVisit>('Visit', VisitSchema);
