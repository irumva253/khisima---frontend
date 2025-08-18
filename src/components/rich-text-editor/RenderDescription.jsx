"use client";

import { useEffect, useState } from "react";
import parse from "html-react-parser";
import { generateHTML } from "@tiptap/html";
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

export function RenderDescription({ json }) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    const generated = generateHTML(json, [
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
            class:
              "bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono",
          },
        },
      }),
      HorizontalRule.configure({
        HTMLAttributes: {
          class: "my-4 border-gray-300 dark:border-gray-600",
        },
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
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg shadow-sm",
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class:
            "border-collapse border border-gray-300 dark:border-gray-600 w-full my-4",
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class:
            "bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-3 py-2 text-left font-medium",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class:
            "border border-gray-300 dark:border-gray-600 px-3 py-2",
        },
      }),
      Highlight.configure({ multicolor: true }),
      Placeholder.configure({
        placeholder: "Start typing here...",
      }),
    ]);

    setHtml(generated);
  }, [json]);

  return (
    <div className="prose dark:prose-invert prose-list:marker:text-primary max-w-none">
      {parse(html)}

      <style jsx global>{`
        .prose li > p {
          display: inline;
          margin: 0;
        }
      `}</style>
    </div>
  );
}