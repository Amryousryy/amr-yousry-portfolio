import mongoose, { Schema } from "mongoose";

export const BILINGUAL_SCHEMA_DEFINITION = {
  en: { type: String, required: true },
  ar: { type: String, required: true },
} as const;

export const OPTIONAL_BILINGUAL_SCHEMA_DEFINITION = {
  en: { type: String },
  ar: { type: String },
} as const;

export function createBilingualMongooseSchema(): Schema {
  return new mongoose.Schema(BILINGUAL_SCHEMA_DEFINITION, { _id: false });
}

export function createOptionalBilingualMongooseSchema(): Schema {
  return new mongoose.Schema(OPTIONAL_BILINGUAL_SCHEMA_DEFINITION, { _id: false });
}

export function createSeoMongooseSchema(): Schema {
  return new mongoose.Schema({
    title: { type: String },
    description: { type: String },
    keywords: { type: [String], default: [] },
  });
}
