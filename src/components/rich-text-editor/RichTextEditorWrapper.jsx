"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const TiptapEditor = dynamic(() => import("./TiptapEditor").then(mod => mod.TiptapEditor), {
  ssr: false,
  loading: () => (
    <div className="p-4 border rounded-md bg-background">
      Loading editor...
    </div>
  ),
});

export function RichTextEditorWrapper({ value, onChange }) {
  const [editorValue, setEditorValue] = useState(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    try {
      let parsedValue;
      
      // If value is null or empty, create default content
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        parsedValue = {
          type: "doc",
          content: [
            {
              type: "paragraph",
              attrs: { textAlign: 'left' },
              content: [{ type: "text", text: "" }],
            },
          ],
        };
        setEditorValue(parsedValue);
        setIsError(false);
        return;
      }
      
      // If value is already an object, use it directly
      if (value && typeof value === 'object') {
        parsedValue = value;
      } 
      // If value is a string, parse it to get the object
      else if (typeof value === 'string') {
        try {
          // Parse the JSON string to get the object
          parsedValue = JSON.parse(value);
        } catch (parseError) {
          console.error("Failed to parse JSON:", parseError);
          // If parsing fails, it might be double-encoded
          try {
            // Remove extra escaping and try again
            const cleanValue = value.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
            parsedValue = JSON.parse(cleanValue);
          } catch (secondError) {
            console.error("Failed to parse cleaned JSON:", secondError);
            throw new Error('Invalid JSON format');
          }
        }
      }
      
      // Validate the parsed content has the expected structure
      if (parsedValue && typeof parsedValue === 'object' && parsedValue.type === 'doc') {
        setEditorValue(parsedValue);
        setIsError(false);
      } else {
        throw new Error('Invalid document structure');
      }
    } catch (e) {
      console.error("Error parsing editor content:", e, "Value:", value);
      setIsError(true);
      // Fallback to empty content
      setEditorValue({
        type: "doc",
        content: [
          {
            type: "paragraph",
            attrs: { textAlign: 'left' },
            content: [{ type: "text", text: "" }],
          },
        ],
      });
    }
  }, [value]);

  const handleChange = (newValue) => {
    try {
      // Stringify the new value before passing it up
      onChange(JSON.stringify(newValue));
      setIsError(false);
    } catch (e) {
      console.error("Error stringifying editor content:", e);
      setIsError(true);
    }
  };

  if (editorValue === null) {
    return (
      <div className="p-4 border rounded-md bg-background">
        Loading editor...
      </div>
    );
  }

  return (
    <div className={isError ? "border border-red-500 rounded-md" : ""}>
      {isError && (
        <div className="bg-red-50 text-red-700 p-2 text-sm rounded-t-md">
          Error loading content. Please edit to fix.
        </div>
      )}
      <TiptapEditor
        value={editorValue}
        onChange={handleChange}
      />
    </div>
  );
}