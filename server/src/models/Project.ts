import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  thumbnailUrl: string;
  stack: string[];
  githubUrl: string;
  demoUrl: string;
  outcome: string;
  orderIndex: number;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    thumbnailUrl: { type: String, default: '' },
    stack: { type: [String], default: [] },
    githubUrl: { type: String, default: '' },
    demoUrl: { type: String, default: '' },
    outcome: { type: String, default: '' },
    orderIndex: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProjectSchema.index({ orderIndex: 1 });

export default mongoose.model<IProject>('Project', ProjectSchema);
