import mongoose, { Schema, Document } from 'mongoose';

export interface IAchievement extends Document {
  type: 'achievement' | 'certificate' | 'paper';
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  year: number;
  orderIndex: number;
}

const AchievementSchema = new Schema<IAchievement>(
  {
    type: {
      type: String,
      enum: ['achievement', 'certificate', 'paper'],
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    linkUrl: { type: String, default: '' },
    year: { type: Number, required: true },
    orderIndex: { type: Number, default: 0 },
  },
  { timestamps: true }
);

AchievementSchema.index({ orderIndex: 1 });

export default mongoose.model<IAchievement>('Achievement', AchievementSchema);
