import mongoose, { Schema, Document } from "mongoose";

export interface IShowreel extends Document {
  title: string;
  subtitle: string;
  videoUrl: string;
  thumbnailUrl: string;
  isActive: boolean;
  ctaText?: string;
  ctaLink: string;
  createdAt: Date;
  updatedAt: Date;
}

const ShowreelSchema: Schema = new Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  videoUrl: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  isActive: { type: Boolean, default: false },
  ctaText: { type: String, default: "Work With Me" },
  ctaLink: { type: String, default: "/#contact" },
}, { timestamps: true });

ShowreelSchema.pre("save", async function(this: any) {
  if (this.isActive) {
    await (mongoose.model("Showreel") as any).updateMany(
      { _id: { $ne: this._id } },
      { $set: { isActive: false } }
    );
  }
});

export default mongoose.models.Showreel || mongoose.model<IShowreel>("Showreel", ShowreelSchema);