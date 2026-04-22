"use client";

import React, { useState } from "react";
import { X, Plus } from "lucide-react";

interface TagsInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export default function TagsInput({ tags, onChange }: TagsInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleAddTag = () => {
    if (inputValue.trim() && !tags.includes(inputValue.trim())) {
      onChange([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="flex items-center space-x-2 px-3 py-1 bg-accent text-background text-[10px] font-bold uppercase tracking-widest pixel-border"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="hover:scale-120 transition-transform"
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex space-x-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-primary/5 border border-primary/20 p-3 outline-none focus:border-accent transition-colors text-sm"
          placeholder="Add a tag..."
        />
        <button
          type="button"
          onClick={handleAddTag}
          className="px-4 py-2 bg-primary/10 hover:bg-accent hover:text-background transition-all"
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
}
