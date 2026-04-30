import mongoose, { Schema, Document } from 'mongoose';

export interface IExperience extends Document {
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  bullets: string[];
  orderIndex: number;
}

const ExperienceSchema = new Schema<IExperience>(
  {
    role: { type: String, required: true },
    company: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, default: 'Present' },
    bullets: { type: [String], default: [] },
    orderIndex: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ExperienceSchema.index({ orderIndex: 1 });

export default mongoose.model<IExperience>('Experience', ExperienceSchema);
