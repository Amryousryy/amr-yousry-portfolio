"use client";

import React, { useState } from "react";
import { Upload, X, Link, Loader2, AlertCircle } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { toast } from "sonner";
import Image from "next/image";

interface MediaUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
  accept?: "image" | "video" | "any";
  mode?: "upload" | "url" | "both";
}

export default function MediaUploader({
  value,
  onChange,
  label,
  accept = "image",
  mode = "both",
}: MediaUploaderProps) {
  const [inputMode, setInputMode] = useState<"upload" | "url">(
    value?.startsWith("http") ? "url" : "upload"
  );
  const [manualUrl, setManualUrl] = useState(value || "");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleUrlSubmit = () => {
    if (manualUrl.trim()) {
      onChange(manualUrl.trim());
      toast.success("URL added!");
    }
  };

  const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default';

  const handleWidgetSuccess = (result: any) => {
    if (result.info && typeof result.info === "object" && "secure_url" in result.info) {
      onChange(result.info.secure_url);
      toast.success(`${accept === "video" ? "Video" : "Image"} uploaded!`);
      setUploadError(null);
    }
    setIsUploading(false);
  };

  const handleWidgetError = (error: any) => {
    console.error("Upload error:", error);
    setUploadError("Upload failed. Try entering a URL instead.");
    toast.error("Upload failed. Please try a direct URL.");
    setIsUploading(false);
  };

  const cloudinaryOpts = {
    resourceType: accept === "video" ? "video" : ("image" as const),
  };

  const renderUploadArea = () => {
    if (value) {
      return (
        <div className="relative aspect-video bg-primary/5 border-2 border-primary/10 overflow-hidden group">
          {accept === "video" ? (
            <video src={value} className="w-full h-full object-cover" muted controls />
          ) : (
            <Image src={value} alt="Preview" fill className="object-cover" />
          )}
          <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={() => onChange("")}
              className="p-3 bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      );
    }

    if (mode === "url" || inputMode === "url") {
      return (
        <div className="space-y-3">
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            className="w-full bg-primary/5 border border-primary/20 p-3 outline-none focus:border-accent text-sm"
            placeholder="https://example.com/image.jpg"
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            disabled={!manualUrl.trim()}
            className="w-full py-2 bg-accent text-background text-xs font-medium uppercase tracking-widest hover:bg-accent/90 disabled:opacity-50"
          >
            Add URL
          </button>
        </div>
      );
    }

    return (
      <CldUploadWidget
        uploadPreset={CLOUDINARY_UPLOAD_PRESET}
        options={cloudinaryOpts}
        onSuccess={handleWidgetSuccess}
        onError={handleWidgetError}
      >
        {({ open }) => (
          <div
            onClick={() => {
              setIsUploading(true);
              setUploadError(null);
              open();
            }}
            className="aspect-video bg-primary/5 border-2 border-dashed border-primary/20 flex flex-col items-center justify-center cursor-pointer hover:border-accent transition-colors"
          >
            {isUploading ? (
              <>
                <Loader2 className="animate-spin text-accent mb-2" />
                <span className="text-[10px] text-accent font-bold uppercase">Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="text-primary/40 mb-2" />
                <span className="text-[10px] text-foreground/40 font-bold uppercase">
                  {accept === "video" ? "Upload Video" : "Upload Image"}
                </span>
              </>
            )}
          </div>
        )}
      </CldUploadWidget>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="pixel-text text-[10px] text-accent block uppercase tracking-widest">
          {label}
        </label>
        {mode === "both" && value && (
          <button
            type="button"
            onClick={() => setInputMode(inputMode === "upload" ? "url" : "upload")}
            className="text-[9px] text-foreground/40 hover:text-foreground uppercase tracking-wider"
          >
            {inputMode === "upload" ? "Use URL" : "Upload"}
          </button>
        )}
      </div>

      {uploadError && (
        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          <AlertCircle size={14} />
          <span>{uploadError}</span>
        </div>
      )}

      {renderUploadArea()}

      {mode === "both" && !value && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setInputMode("upload")}
            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors ${
              inputMode === "upload"
                ? "bg-accent text-background"
                : "bg-primary/10 text-foreground/40 hover:text-foreground"
            }`}
          >
            Upload
          </button>
          <button
            type="button"
            onClick={() => setInputMode("url")}
            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors ${
              inputMode === "url"
                ? "bg-accent text-background"
                : "bg-primary/10 text-foreground/40 hover:text-foreground"
            }`}
          >
            <Link size={12} className="inline mr-1" />
            URL
          </button>
        </div>
      )}
    </div>
  );
}