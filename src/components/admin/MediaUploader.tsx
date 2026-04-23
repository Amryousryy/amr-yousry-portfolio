"use client";

import React, { useState, useCallback } from "react";
import { Upload, X, Link, Loader2, AlertCircle, Check, ExternalLink } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { toast } from "sonner";
import Image from "next/image";
import { mediaConfig, isValidMediaUrl } from "@/lib/media/config";

interface MediaUploaderProps {
  value?: string;
  onChange?: (url: string) => void;
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
    value && value.startsWith("http") ? "url" : "upload"
  );
  const [manualUrl, setManualUrl] = useState(value || "");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleUrlSubmit = useCallback(() => {
    if (manualUrl.trim() && isValidMediaUrl(manualUrl.trim())) {
      onChange?.(manualUrl.trim());
      toast.success("URL added!");
      setUploadError(null);
    } else {
      setUploadError("Please enter a valid URL");
      toast.error("Invalid URL");
    }
  }, [manualUrl, onChange]);

  const handleWidgetSuccess = useCallback((result: unknown) => {
    const info = (result as { info?: { secure_url?: string } })?.info;
    if (info?.secure_url) {
      onChange?.(info.secure_url);
      toast.success(`${accept === "video" ? "Video" : "Image"} uploaded!`);
      setUploadError(null);
    }
    setIsUploading(false);
  }, [accept, onChange]);

  const handleWidgetError = useCallback((error: unknown) => {
    console.error("Upload error:", error);
    setUploadError("Upload failed. Try entering a URL instead.");
    toast.error("Upload failed");
    setIsUploading(false);
  }, []);

  const handleRemove = useCallback(() => {
    onChange?.("");
    setManualUrl("");
    setUploadError(null);
  }, [onChange]);

  const cloudinaryOpts = {
    resourceType: accept === "video" ? "video" : "image",
  };

  const canUseUpload = mediaConfig.isUploadConfigured;
  const effectiveMode = !canUseUpload ? "url" : mode;

  const renderUploadArea = () => {
    if (value && isValidMediaUrl(value)) {
      return (
        <div className="relative aspect-video bg-primary/5 border-2 border-primary/10 overflow-hidden group">
          {accept === "video" ? (
            <video src={value} className="w-full h-full object-cover" muted controls />
          ) : (
            <Image src={value} alt="Preview" fill className="object-cover" />
          )}
          <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-accent/20 text-accent hover:bg-accent/30 transition-colors"
            >
              <ExternalLink size={20} />
            </a>
            <button
              type="button"
              onClick={handleRemove}
              className="p-3 bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      );
    }

    if (effectiveMode === "url" || inputMode === "url") {
      return (
        <div className="space-y-3">
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
            className="w-full bg-primary/5 border border-primary/20 p-3 outline-none focus:border-accent text-sm"
            placeholder="https://example.com/image.jpg"
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            disabled={!manualUrl.trim()}
            className="w-full py-2 bg-accent text-background text-xs font-medium uppercase tracking-widest hover:bg-accent/90 disabled:opacity-50"
          >
            <Check size={14} className="inline mr-2" />
            Add URL
          </button>
        </div>
      );
    }

    if (!canUseUpload) {
      return (
        <div className="aspect-video bg-primary/5 border-2 border-dashed border-primary/20 flex flex-col items-center justify-center p-6">
          <AlertCircle className="text-amber-500 mb-3" size={32} />
          <p className="text-xs text-foreground/60 text-center mb-4">
            Media service is not configured. You can still paste a media URL manually.
          </p>
          <button
            type="button"
            onClick={() => setInputMode("url")}
            className="px-4 py-2 bg-accent text-background text-xs font-bold uppercase tracking-widest"
          >
            Enter URL Manually
          </button>
        </div>
      );
    }

    return (
      <CldUploadWidget
        uploadPreset={mediaConfig.uploadPreset}
        options={cloudinaryOpts}
        onSuccess={handleWidgetSuccess}
        onError={handleWidgetError}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => {
              setIsUploading(true);
              setUploadError(null);
              open();
            }}
            disabled={isUploading}
            className="w-full aspect-video bg-primary/5 border-2 border-dashed border-primary/20 flex flex-col items-center justify-center cursor-pointer hover:border-accent transition-colors disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="animate-spin text-accent mb-2" size={24} />
                <span className="text-[10px] text-accent font-bold uppercase">Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="text-primary/40 mb-2" size={24} />
                <span className="text-[10px] text-foreground/40 font-bold uppercase">
                  {accept === "video" ? "Upload Video" : "Upload Image"}
                </span>
                <span className="text-[9px] text-foreground/30 mt-1">or drag and drop</span>
              </>
            )}
          </button>
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
        {effectiveMode === "both" && value && (
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

      {effectiveMode === "both" && !value && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setInputMode("upload")}
            disabled={!canUseUpload}
            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors ${
              inputMode === "upload"
                ? "bg-accent text-background"
                : "bg-primary/10 text-foreground/40 hover:text-foreground disabled:opacity-30"
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