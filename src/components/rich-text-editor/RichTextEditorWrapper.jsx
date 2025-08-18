"use client";

import dynamic from "next/dynamic";

const TiptapEditor = dynamic(() => import("./TiptapEditor").then(mod => mod.TiptapEditor), {
  ssr: false,
  loading: () => (
    <div className="p-4 border rounded-md bg-background">
      Loading editor...
    </div>
  ),
});

export function RichTextEditorWrapper({ value, onChange }) {
  const safeValue = (() => {
    try {
      // Handle both string and object input
      const parsed = typeof value === "string" ? JSON.parse(value) : value;
      
      // Validate the parsed content has the expected structure
      if (parsed && typeof parsed === "object" && parsed.type === "doc") {
        return parsed;
      }
    } catch (e) {
      console.error("Error parsing editor content:", e);
    }
    
    // Fallback to empty content
    return {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "" }],
        },
      ],
    };
  })();

  const handleChange = (newValue) => {
    try {
      onChange(JSON.stringify(newValue));
    } catch (e) {
      console.error("Error stringifying editor content:", e);
    }
  };

  return (
    <TiptapEditor
      value={safeValue}
      onChange={handleChange}
    />
  );
}