import mongoose, { Schema, Document } from "mongoose";

const BilingualSchema = new Schema({
  en: { type: String, required: true },
  ar: { type: String, required: true },
}, { _id: false });

export interface IShowreel extends Document {
  title: { en: string; ar: string };
  subtitle: { en: string; ar: string };
  videoUrl: string;
  thumbnailUrl: string;
  isActive: boolean;
  ctaText: { en: string; ar: string };
  ctaLink: string;
  createdAt: Date;
  updatedAt: Date;
}

const ShowreelSchema: Schema = new Schema({
  title: { type: BilingualSchema, required: true },
  subtitle: { type: BilingualSchema, required: true },
  videoUrl: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  isActive: { type: Boolean, default: false },
  ctaText: { type: BilingualSchema, default: { en: "Work With Me", ar: "أعمل معي" } },
  ctaLink: { type: String, default: "/#contact" },
}, { timestamps: true });

// Ensure only one showreel is active at a time
// Use an explicit this type to satisfy TypeScript with strict mode
ShowreelSchema.pre("save", async function(this: any) {
  // Deactivate other showreels when this one becomes active
  if (this.isActive) {
    await (mongoose.model("Showreel") as any).updateMany(
      { _id: { $ne: this._id } },
      { $set: { isActive: false } }
    );
  }
  // Do not manually modify updatedAt; rely on Mongoose timestamps
});

export default mongoose.models.Showreel || mongoose.model<IShowreel>("Showreel", ShowreelSchema);
