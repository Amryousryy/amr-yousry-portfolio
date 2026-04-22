"use client";

import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2, GripVertical } from "lucide-react";
import Image from "next/image";

interface SortableItemProps {
  id: string;
  url: string;
  onRemove: (url: string) => void;
}

function SortableItem({ id, url, onRemove }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative aspect-square bg-primary/5 border border-primary/10 overflow-hidden pixel-border ${isDragging ? "opacity-50" : ""}`}
    >
      <Image src={url} alt="Gallery item" fill className="object-cover" />
      
      <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center space-y-2">
         <button
          type="button"
          {...attributes}
          {...listeners}
          className="p-2 bg-accent text-background rounded-full cursor-grab active:cursor-grabbing"
        >
          <GripVertical size={16} />
        </button>
        <button
          type="button"
          onClick={() => onRemove(url)}
          className="p-2 bg-red-500 text-white rounded-full hover:scale-110 transition-transform"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

interface DraggableGalleryProps {
  items: string[];
  onChange: (items: string[]) => void;
  onRemove: (url: string) => void;
}

export default function DraggableGallery({ items, onChange, onRemove }: DraggableGalleryProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.indexOf(active.id as string);
      const newIndex = items.indexOf(over.id as string);
      onChange(arrayMove(items, oldIndex, newIndex));
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {items.map((url) => (
            <SortableItem key={url} id={url} url={url} onRemove={onRemove} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
