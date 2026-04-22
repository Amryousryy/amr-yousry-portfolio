import mongoose, { Schema, Document } from "mongoose";

const BilingualSchema = new Schema({
  en: { type: String, required: true },
  ar: { type: String, required: true },
}, { _id: false });

export interface ISettings extends Document {
  hero: {
    headline: { en: string; ar: string };
    subheadline: { en: string; ar: string };
    videoUrl?: string;
    ctaText: { en: string; ar: string };
    status: "draft" | "published";
  };
  about: {
    content: { en: string; ar: string };
    stats: { label: { en: string; ar: string }; value: string }[];
  };
  services: {
    title: { en: string; ar: string };
    description: { en: string; ar: string };
    icon: string;
  }[];
  updatedAt: Date;
}

const SettingsSchema: Schema = new Schema({
  hero: {
    headline: { type: BilingualSchema, required: true },
    subheadline: { type: BilingualSchema, required: true },
    videoUrl: { type: String },
    ctaText: { type: BilingualSchema, required: true },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
  },
  about: {
    content: { type: BilingualSchema, required: true },
    stats: [{
      label: { type: BilingualSchema, required: true },
      value: { type: String, required: true }
    }]
  },
  services: [{
    title: { type: BilingualSchema, required: true },
    description: { type: BilingualSchema, required: true },
    icon: { type: String, required: true }
  }],
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);
