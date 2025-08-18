/* eslint-disable no-unused-vars */
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

export function RenderDescription({ content }) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    if (!content) {
      setHtml("");
      return;
    }

    try {
      // If content is already an object → assume Tiptap JSON
      const json =
        typeof content === "string" ? JSON.parse(content) : content;

      if (json && typeof json === "object" && json.type === "doc") {
        const generated = generateHTML(json, [
          StarterKit.configure({
            heading: { levels: [1, 2, 3] },
            bulletList: { HTMLAttributes: { class: "list-disc list-inside" } },
            orderedList: { HTMLAttributes: { class: "list-decimal list-inside" } },
          }),
          HorizontalRule,
          Underline,
          TextStyle,
          Color.configure({ types: ["textStyle"] }),
          TextAlign.configure({
            types: ["heading", "paragraph"],
            alignments: ["left", "center", "right", "justify"],
          }),
          Subscript,
          Superscript,
          Link,
          Image,
          Table,
          TableRow,
          TableHeader,
          TableCell,
          Highlight,
          Placeholder.configure({ placeholder: "Start typing here..." }),
        ]);
        setHtml(generated);
      } else {
        // If not valid JSON doc, just use as plain HTML/text
        setHtml(content);
      }
    } catch (err) {
      // If JSON.parse fails → fallback to plain string
      setHtml(content);
    }
  }, [content]);

  return (
    <div className="prose dark:prose-invert prose-list:marker:text-primary max-w-none">
      {parse(html)}
    </div>
  );
}
