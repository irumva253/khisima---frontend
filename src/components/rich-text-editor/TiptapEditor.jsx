"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { HorizontalRule } from "@tiptap/extension-horizontal-rule";
import { Underline } from "@tiptap/extension-underline";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { TextAlign } from "@tiptap/extension-text-align";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Link } from "@tiptap/extension-link";
import { Image } from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { Highlight } from "@tiptap/extension-highlight";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Menubar } from "./Menubar";
import { useEffect, useState } from "react";

export function TiptapEditor({ field, value, onChange, onBlur }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editorValue = field?.value || value;
  const handleChange = field?.onChange || onChange;
  const handleBlur = field?.onBlur || onBlur;

  const getInitialContent = () => {
    if (!editorValue) return "";
    try {
      const parsed = typeof editorValue === "string" ? JSON.parse(editorValue) : editorValue;
      return parsed;
    } catch {
      return {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: editorValue || "" }],
          },
        ],
      };
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: { class: "heading" },
        },
        bulletList: {
          HTMLAttributes: { class: "list-disc list-inside" },
        },
        orderedList: {
          HTMLAttributes: { class: "list-decimal list-inside" },
        },
        blockquote: {
          HTMLAttributes: {
            class: "border-l-4 border-gray-400 pl-4 italic my-4",
          },
        },
        code: {
          HTMLAttributes: {
            class: "bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono",
          },
        },
      }),
      HorizontalRule.configure({
        HTMLAttributes: { class: "my-4 border-gray-300 dark:border-gray-600" },
      }),
      Underline,
      TextStyle,
      Color.configure({ types: ["textStyle"] }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
        defaultAlignment: "left",
      }),
      Subscript,
      Superscript,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg shadow-sm",
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "border-collapse border border-gray-300 dark:border-gray-600 w-full my-4",
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: "bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-3 py-2 text-left font-medium",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-gray-300 dark:border-gray-600 px-3 py-2",
        },
      }),
      Highlight.configure({ multicolor: true }),
      Placeholder.configure({
        placeholder: "Start typing here...",
      }),
    ],
    editorProps: {
      attributes: {
        class: "prose dark:prose-invert p-4 focus:outline-none min-h-[200px] max-w-none",
      },
    },
    content: getInitialContent(),
    onUpdate: ({ editor }) => {
      if (handleChange) {
        handleChange(JSON.stringify(editor.getJSON()));
      }
    },
    onBlur: () => {
      handleBlur?.();
    },
    immediatelyRender: false,
  });

  if (!mounted) {
    return (
      <div className="p-4 border rounded-md bg-background">
        Initializing editor...
      </div>
    );
  }

  return (
    <div className="border rounded-md bg-background">
      <Menubar editor={editor} />
      <div className="editor-content">
        <EditorContent editor={editor} />
        <style jsx global>{`
          .ProseMirror {
            outline: none;
          }

          .ProseMirror h1,
          .ProseMirror h2,
          .ProseMirror h3 {
            font-weight: bold;
            margin-top: 0.25em !important;
            margin-bottom: 0.25em !important;
            line-height: 1.2;
          }

          .ProseMirror h1 {
            font-size: 1.75em;
          }

          .ProseMirror h2 {
            font-size: 1.5em;
          }

          .ProseMirror h3 {
            font-size: 1.25em;
          }
            /* Fix bullet/number alignment */
          .ProseMirror li > p {
            margin: 0;
            display: inline;
          }


          .ProseMirror blockquote {
            border-left: 4px solid #ccc;
            padding-left: 1rem;
            margin: 1rem 0;
            font-style: italic;
            color: #666;
          }

          .ProseMirror ul,
          .ProseMirror ol {
            padding-left: 1rem;
            margin: 1rem 0;
          }

          .ProseMirror li {
            margin: 0.25rem 0;
          }

          .ProseMirror hr {
            border: none;
            border-top: 2px solid #ccc;
            margin: 1rem 0;
          }

          .ProseMirror code {
            background: #f4f4f4;
            padding: 0.2em 0.4em;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
          }

          .ProseMirror a {
            color: #3b82f6;
            text-decoration: underline;
          }

          .ProseMirror a:hover {
            color: #1d4ed8;
          }

          .ProseMirror img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }

          .ProseMirror table {
            border-collapse: collapse;
            margin: 1rem 0;
            width: 100%;
          }

          .ProseMirror table td,
          .ProseMirror table th {
            border: 1px solid #ccc;
            padding: 8px 12px;
            text-align: left;
          }

          .ProseMirror table th {
            background-color: #f5f5f5;
            font-weight: bold;
          }

          .ProseMirror .highlight {
            padding: 0.1em 0.2em;
            border-radius: 2px;
          }

          .ProseMirror .tableWrapper {
            overflow-x: auto;
          }

          .ProseMirror .resize-cursor {
            cursor: col-resize;
          }

          .ProseMirror sub {
            vertical-align: sub;
            font-size: 0.8em;
          }

          .ProseMirror sup {
            vertical-align: super;
            font-size: 0.8em;
          }

          .ProseMirror p.is-editor-empty:first-child::before,
          .ProseMirror [data-placeholder]:empty::before {
            content: attr(data-placeholder);
            float: left;
            color: #adb5bd;
            pointer-events: none;
            height: 0;
          }

          .ProseMirror [style*="text-align: left"] {
            text-align: left;
          }

          .ProseMirror [style*="text-align: center"] {
            text-align: center;
          }

          .ProseMirror [style*="text-align: right"] {
            text-align: right;
          }

          .ProseMirror [style*="text-align: justify"] {
            text-align: justify;
          }

          /* Dark mode overrides */
          .dark .ProseMirror blockquote {
            border-left-color: #666;
            color: #ccc;
          }

          .dark .ProseMirror hr {
            border-top-color: #666;
          }

          .dark .ProseMirror code {
            background: #2d2d2d;
            color: #f8f8f2;
          }

          .dark .ProseMirror a {
            color: #60a5fa;
          }

          .dark .ProseMirror a:hover {
            color: #93c5fd;
          }

          .dark .ProseMirror table td,
          .dark .ProseMirror table th {
            border-color: #666;
          }

          .dark .ProseMirror table th {
            background-color: #374151;
          }

          .dark .ProseMirror p.is-editor-empty:first-child::before,
          .dark .ProseMirror [data-placeholder]:empty::before {
            color: #6b7280;
          }

          .dark .ProseMirror,
          .dark .ProseMirror p,
          .dark .ProseMirror span,
          .dark .ProseMirror div {
            color: #d1d5db !important;
          }

          .dark .ProseMirror h1,
          .dark .ProseMirror h2,
          .dark .ProseMirror h3 {
            color: #e5e7eb !important;
          }
        `}</style>
      </div>
    </div>
  );
}