"use client";

import parse from "html-react-parser";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
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
import { HorizontalRule } from "@tiptap/extension-horizontal-rule";

export function RenderDescription({ json }) {
  if (!json) return null; // no fallback text

  let parsed = json;

  if (typeof json === "string") {
    try {
      parsed = JSON.parse(json);
      if (typeof parsed === "string") parsed = JSON.parse(parsed);
    } catch {
      console.error("Invalid JSON string in RenderDescription:", json);
      return null; // silently ignore invalid content
    }
  }

  // If parsed content is empty or invalid, just return null
  if (!parsed || !parsed.type || !parsed.content || !Array.isArray(parsed.content)) {
    return null;
  }

  try {
    const extensions = [
      StarterKit.configure({
        link: false,
        underline: false,
        horizontalRule: false,
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
          class:
            "text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300",
        },
      }),
      Image.configure({
        HTMLAttributes: { class: "max-w-full h-auto rounded-lg shadow-sm" },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: { class: "border-collapse border border-gray-300 dark:border-gray-600 w-full my-4" },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: { class: "bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-3 py-2 text-left font-medium" },
      }),
      TableCell.configure({
        HTMLAttributes: { class: "border border-gray-300 dark:border-gray-600 px-3 py-2" },
      }),
      Highlight.configure({ multicolor: true }),
      Placeholder.configure({ placeholder: "Start typing here..." }),
      HorizontalRule.configure({
        HTMLAttributes: { class: "my-4 border-gray-300 dark:border-gray-600" },
      }),
    ];

    const generated = generateHTML(parsed, extensions);

    return (
      <div className="prose dark:prose-invert prose-list:marker:text-primary max-w-none">
        {parse(generated)}
        <style>
          {`
            .prose li > p {
              display: inline;
              margin: 0;
            }
          `}
        </style>
      </div>
    );
  } catch (e) {
    console.error("Failed to render TipTap content:", e, parsed);
    return null; // silently ignore errors
  }
}
