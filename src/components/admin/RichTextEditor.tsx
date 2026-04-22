"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo, 
  Link as LinkIcon,
  Heading1,
  Heading2
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt("URL");
    if (url) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  };

  return (
    <div className="flex flex-wrap gap-2 p-2 border-b border-primary/10 bg-primary/5">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 hover:bg-accent hover:text-background transition-colors ${editor.isActive("bold") ? "bg-accent text-background" : ""}`}
      >
        <Bold size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 hover:bg-accent hover:text-background transition-colors ${editor.isActive("italic") ? "bg-accent text-background" : ""}`}
      >
        <Italic size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 hover:bg-accent hover:text-background transition-colors ${editor.isActive("heading", { level: 1 }) ? "bg-accent text-background" : ""}`}
      >
        <Heading1 size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 hover:bg-accent hover:text-background transition-colors ${editor.isActive("heading", { level: 2 }) ? "bg-accent text-background" : ""}`}
      >
        <Heading2 size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 hover:bg-accent hover:text-background transition-colors ${editor.isActive("bulletList") ? "bg-accent text-background" : ""}`}
      >
        <List size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 hover:bg-accent hover:text-background transition-colors ${editor.isActive("orderedList") ? "bg-accent text-background" : ""}`}
      >
        <ListOrdered size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 hover:bg-accent hover:text-background transition-colors ${editor.isActive("blockquote") ? "bg-accent text-background" : ""}`}
      >
        <Quote size={16} />
      </button>
      <button
        type="button"
        onClick={addLink}
        className={`p-2 hover:bg-accent hover:text-background transition-colors ${editor.isActive("link") ? "bg-accent text-background" : ""}`}
      >
        <LinkIcon size={16} />
      </button>
      <div className="w-px h-6 bg-primary/10 mx-2 self-center" />
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        className="p-2 hover:bg-accent hover:text-background transition-colors"
      >
        <Undo size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        className="p-2 hover:bg-accent hover:text-background transition-colors"
      >
        <Redo size={16} />
      </button>
    </div>
  );
};

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none focus:outline-none p-4 min-h-[150px] text-sm",
      },
    },
  });

  return (
    <div className="border border-primary/20 bg-primary/5 focus-within:border-accent transition-colors">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
