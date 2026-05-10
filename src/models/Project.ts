import mongoose, { Schema, Document } from "mongoose";

const ProjectSectionSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  media: [{
    type: { type: String, enum: ["image", "video"], required: true },
    url: { type: String, required: true }
  }]
}, { _id: false });

const CaseStudyMediaSchema = new Schema({
  type: { type: String, enum: ["image", "video", "process", "before-after", "result"], required: true },
  src: { type: String, required: true },
  alt: { type: String },
  caption: { type: String },
}, { _id: false });

const DetailedResultSchema = new Schema({
  label: { type: String, required: true },
  value: { type: String, required: true },
}, { _id: false });

const ProjectSchema: Schema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  shortDescription: { type: String, required: true },
  fullDescription: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  video: { type: String },
  problem: { type: String },
  strategy: { type: String },
  solution: { type: String },
  execution: { type: String },
  results: { type: String },
  gallery: { type: [String], default: [] },
  tags: { type: [String], default: [] },
  sections: { type: [ProjectSectionSchema], default: [] },
  featured: { type: Boolean, default: false },
  status: { type: String, enum: ["draft", "published"], default: "draft" },
  displayOrder: { type: Number, default: 0 },
  year: { type: String },
  clientName: { type: String },
  client: { type: String },
  seo: {
    title: { type: String },
    description: { type: String },
    keywords: { type: [String] },
  },
  categories: { type: [String], default: [] },
  services: { type: [String], default: [] },
  mainResult: { type: String },
  idea: { type: String },
  detailedResults: { type: [DetailedResultSchema], default: [] },
  caseStudyMedia: { type: [CaseStudyMediaSchema], default: [] },
  featuredOrder: { type: Number, default: 0 },
  publishedAt: { type: Date },
  lastStatusChangeAt: { type: Date },
}, { timestamps: true });

ProjectSchema.index({ status: 1, displayOrder: 1 });
ProjectSchema.index({ featured: 1, status: 1 });

export interface IProject extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  image: string;
  video?: string;
  problem?: string;
  strategy?: string;
  solution?: string;
  execution?: string;
  results?: string;
  gallery: string[];
  tags: string[];
  sections: {
    id: string;
    title: string;
    content: string;
    media: { type: "image" | "video"; url: string }[];
  }[];
  featured: boolean;
  status: "draft" | "published";
  displayOrder: number;
  year?: string;
  clientName?: string;
  client?: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  categories: string[];
  services: string[];
  mainResult?: string;
  idea?: string;
  detailedResults: { label: string; value: string }[];
  caseStudyMedia: { type: "image" | "video" | "process" | "before-after" | "result"; src: string; alt?: string; caption?: string }[];
  featuredOrder: number;
  publishedAt?: Date;
  lastStatusChangeAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export default mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);