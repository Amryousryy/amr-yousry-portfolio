import mongoose, { Schema, Document } from "mongoose";

const BilingualSchema = new Schema({
  en: { type: String, required: true },
  ar: { type: String, required: true },
}, { _id: false });

export interface IProject extends Document {
  title: { en: string; ar: string };
  slug: string;
  shortDescription: { en: string; ar: string };
  fullDescription: { en: string; ar: string };
  category: string;
  image: string;
  video?: string;
  problem?: { en: string; ar: string };
  strategy?: { en: string; ar: string };
  solution?: { en: string; ar: string };
  execution?: { en: string; ar: string };
  results?: { en: string; ar: string };
  gallery: string[];
  tags: string[];
  sections: {
    id: string;
    title: { en: string; ar: string };
    content: { en: string; ar: string };
    media: { type: "image" | "video"; url: string }[];
  }[];
  featured: boolean;
  status: "draft" | "published";
  displayOrder: number;
  year?: string;
  clientName?: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  publishedAt?: Date;
  lastStatusChangeAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSectionSchema = new Schema({
  id: { type: String, required: true },
  title: { type: BilingualSchema, required: true },
  content: { type: BilingualSchema, required: true },
  media: [{
    type: { type: String, enum: ["image", "video"], required: true },
    url: { type: String, required: true }
  }]
}, { _id: false });

const ProjectSchema: Schema = new Schema({
  title: { type: BilingualSchema, required: true },
  slug: { type: String, required: true, unique: true },
  shortDescription: { type: BilingualSchema, required: true },
  fullDescription: { type: BilingualSchema, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  video: { type: String },
  problem: { type: BilingualSchema },
  strategy: { type: BilingualSchema },
  solution: { type: BilingualSchema },
  execution: { type: BilingualSchema },
  results: { type: BilingualSchema },
  gallery: { type: [String], default: [] },
  tags: { type: [String], default: [] },
  sections: { type: [ProjectSectionSchema], default: [] },
  featured: { type: Boolean, default: false },
  status: { type: String, enum: ["draft", "published"], default: "draft" },
  displayOrder: { type: Number, default: 0 },
  year: { type: String },
  clientName: { type: String },
  seo: {
    title: { type: String },
    description: { type: String },
    keywords: { type: [String] },
  },
  publishedAt: { type: Date },
  lastStatusChangeAt: { type: Date },
}, { timestamps: true });

ProjectSchema.index({ slug: 1 }, { unique: true });
ProjectSchema.index({ status: 1, displayOrder: 1 });
ProjectSchema.index({ featured: 1, status: 1 });

export default mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
