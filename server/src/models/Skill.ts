import mongoose, { Schema, Document } from 'mongoose';

export interface ISkill extends Document {
  name: string;
  level: number;
  category: string;
  orderIndex: number;
}

const SkillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true },
    level: { type: Number, required: true, min: 0, max: 100 },
    category: { type: String, required: true, default: 'General' },
    orderIndex: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<ISkill>('Skill', SkillSchema);
