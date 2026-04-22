"use client";

import React from "react";
import { Plus, Trash2, Image as ImageIcon, Video, X } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { toast } from "sonner";
import Image from "next/image";
import { ProjectSection, BilingualString } from "@/types";
import BilingualInput from "@/components/admin/BilingualInput";
import RichTextEditor from "./RichTextEditor";

interface SectionsEditorProps {
  sections: ProjectSection[];
  onChange: (sections: ProjectSection[]) => void;
}

const emptyBilingual = (): BilingualString => ({ en: "", ar: "" });

export default function SectionsEditor({ sections, onChange }: SectionsEditorProps) {
  const addSection = () => {
    const newSection: ProjectSection = {
      id: crypto.randomUUID(),
      title: emptyBilingual(),
      content: emptyBilingual(),
      media: [],
    };
    onChange([...sections, newSection]);
  };

  const removeSection = (id: string) => {
    onChange(sections.filter((s) => s.id !== id));
  };

  const updateSection = (id: string, updates: Partial<ProjectSection>) => {
    onChange(
      sections.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const addMedia = (sectionId: string, type: "image" | "video", url: string) => {
    const section = sections.find((s) => s.id === sectionId);
    if (section) {
      const updatedMedia = [...section.media, { type, url }];
      updateSection(sectionId, { media: updatedMedia });
    }
  };

  const removeMedia = (sectionId: string, url: string) => {
    const section = sections.find((s) => s.id === sectionId);
    if (section) {
      const updatedMedia = section.media.filter((m) => m.url !== url);
      updateSection(sectionId, { media: updatedMedia });
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <h3 className="pixel-text text-[10px] text-accent uppercase tracking-widest font-bold">Project Sections</h3>
        <button
          type="button"
          onClick={addSection}
          className="flex items-center space-x-2 px-4 py-2 bg-accent text-background text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all pixel-border"
        >
          <Plus size={14} />
          <span>Add Section</span>
        </button>
      </div>

      <div className="space-y-16">
        {sections.map((section, index) => (
          <div key={section.id} className="relative p-8 bg-primary/5 border border-primary/10 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <button
              type="button"
              onClick={() => removeSection(section.id)}
              className="absolute -top-4 -right-4 p-2 bg-red-500 text-white rounded-full hover:scale-110 transition-transform shadow-lg z-10"
            >
              <Trash2 size={16} />
            </button>

            <div className="grid grid-cols-1 gap-8">
              <BilingualInput
                label={`Section ${index + 1} Title`}
                value={section.title}
                onChange={(val) => updateSection(section.id, { title: val })}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="pixel-text text-[10px] text-accent block uppercase tracking-widest">English Content</label>
                  <RichTextEditor
                    content={section.content.en}
                    onChange={(val) => updateSection(section.id, { content: { ...section.content, en: val } })}
                  />
                </div>
                <div className="space-y-4">
                  <label className="pixel-text text-[10px] text-accent block uppercase tracking-widest">Arabic Content</label>
                  <RichTextEditor
                    content={section.content.ar}
                    onChange={(val) => updateSection(section.id, { content: { ...section.content, ar: val } })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <label className="pixel-text text-[10px] text-accent block uppercase tracking-widest">Section Media</label>
                   <div className="flex space-x-4">
                      <CldUploadWidget
                        uploadPreset="amr_portfolio_preset"
                        onSuccess={(result) => {
                          if (typeof result.info === 'object' && 'secure_url' in result.info) {
                            addMedia(section.id, "image", result.info.secure_url as string);
                            toast.success("Image added to section!");
                          }
                        }}
                      >
                        {({ open }) => (
                          <button
                            type="button"
                            onClick={() => open()}
                            className="flex items-center space-x-2 px-3 py-1 bg-primary/10 text-[9px] font-bold uppercase hover:bg-accent hover:text-background transition-all"
                          >
                            <ImageIcon size={14} />
                            <span>Add Image</span>
                          </button>
                        )}
                      </CldUploadWidget>

                      <button
                        type="button"
                        onClick={() => {
                          const url = window.prompt("Enter Video URL (MP4/Vimeo/YouTube)");
                          if (url) addMedia(section.id, "video", url);
                        }}
                        className="flex items-center space-x-2 px-3 py-1 bg-primary/10 text-[9px] font-bold uppercase hover:bg-accent hover:text-background transition-all"
                      >
                        <Video size={14} />
                        <span>Add Video URL</span>
                      </button>
                   </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {section.media.map((m, idx) => (
                    <div key={idx} className="group relative aspect-video bg-primary/10 border border-primary/20 overflow-hidden pixel-border">
                       {m.type === "image" ? (
                         <Image src={m.url} alt="Section media" fill className="object-cover" />
                       ) : (
                         <div className="w-full h-full flex flex-col items-center justify-center bg-accent/10">
                            <Video size={24} className="text-accent mb-2" />
                            <span className="text-[8px] uppercase font-bold truncate px-2 w-full text-center">{m.url}</span>
                         </div>
                       )}
                       <button
                        type="button"
                        onClick={() => removeMedia(section.id, m.url)}
                        className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                       >
                         <Trash2 size={16} />
                       </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        {sections.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-primary/10">
             <p className="text-[10px] text-foreground/30 uppercase tracking-[0.2em]">No custom sections added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
