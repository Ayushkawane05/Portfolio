import mongoose, { Schema, Document } from 'mongoose';

export interface IEducation extends Document {
  institution: string;
  degree: string;
  startYear: number;
  endYear: number | null;
  detail: string;
  category: 'School' | 'College';
  extracurriculars: string[];
  milestones: { date: string; label: string; description: string }[];
  orderIndex: number;
}

const EducationSchema = new Schema<IEducation>(
  {
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    startYear: { type: Number, required: true },
    endYear: { type: Number, default: null },
    detail: { type: String, default: '' },
    category: { type: String, enum: ['School', 'College'], default: 'College' },
    extracurriculars: { type: [String], default: [] },
    milestones: [{
      date: { type: String },
      label: { type: String },
      description: { type: String }
    }],
    orderIndex: { type: Number, default: 0 },
  },
  { timestamps: true }
);

EducationSchema.index({ orderIndex: 1 });

export default mongoose.model<IEducation>('Education', EducationSchema);
