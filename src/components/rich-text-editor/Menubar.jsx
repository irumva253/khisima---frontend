"use client";

import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";
import { Toggle } from "@radix-ui/react-toggle";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  Undo2,
  Redo2,
  Minus,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link,
  Unlink,
  Image,
  Table,
  Subscript,
  Superscript,
  RemoveFormatting,
  Highlighter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";

export function Menubar({ editor }) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const colorPickerRef = useRef(null);
  const highlightPickerRef = useRef(null);
  const linkDialogRef = useRef(null);
  
  const textColors = [
    "#000000", "#434343", "#666666", "#999999", "#b7b7b7", "#cccccc", "#d9d9d9", "#efefef", "#f3f3f3", "#ffffff",
    "#980000", "#ff0000", "#ff9900", "#ffff00", "#00ff00", "#00ffff", "#4a86e8", "#0000ff", "#9900ff", "#ff00ff",
    "#e6b8af", "#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#c9daf8", "#cfe2f3", "#d9d2e9", "#ead1dc",
    "#dd7e6b", "#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#a4c2f4", "#9fc5e8", "#b4a7d6", "#d5a6bd",
    "#cc4125", "#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6d9eeb", "#6fa8dc", "#8e7cc3", "#c27ba0",
    "#a61e4d", "#cc0000", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3c78d8", "#3d85c6", "#674ea7", "#a64d79",
    "#85200c", "#990000", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#1155cc", "#0b5394", "#351c75", "#741b47",
    "#5b0f00", "#660000", "#783f04", "#7f6000", "#274e13", "#0c343d", "#1c4587", "#073763", "#20124d", "#4c1130"
  ];

  const highlightColors = [
    "#ffff00", "#00ff00", "#00ffff", "#ff00ff", "#ff9900", "#ff0000", "#0000ff", "#9900ff",
    "#fff2cc", "#d9ead3", "#d0e0e3", "#ead1dc", "#fce5cd", "#f4cccc", "#c9daf8", "#d9d2e9"
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
        setShowColorPicker(false);
      }
      if (highlightPickerRef.current && !highlightPickerRef.current.contains(event.target)) {
        setShowHighlightPicker(false);
      }
      if (linkDialogRef.current && !linkDialogRef.current.contains(event.target)) {
        setShowLinkDialog(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addLink = () => {
    if (linkUrl) {
      editor?.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl("");
      setShowLinkDialog(false);
    }
  };

  const removeLink = () => {
    editor?.chain().focus().unsetLink().run();
  };

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  };

  const insertTable = () => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  if (!editor) return null;

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-wrap gap-1 p-1 border-b bg-background rounded-t-md">
        {/* Text Formatting */}
        <div className="flex gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={editor.isActive("bold")}
                onPressedChange={() => editor.chain().focus().toggleBold().run()}
                className={cn(
                  "h-8 w-8 p-2 hover:bg-accent hover:text-accent-foreground",
                  editor.isActive("bold") && "bg-muted text-muted-foreground"
                )}
              >
                <Bold className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent 
              side="bottom" 
              className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs z-50"
            >
              Bold (Ctrl+B)
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={editor.isActive("italic")}
                onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                className={cn(
                  "h-8 w-8 p-2 hover:bg-accent hover:text-accent-foreground",
                  editor.isActive("italic") && "bg-muted text-muted-foreground"
                )}
              >
                <Italic className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent 
              side="bottom" 
              className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs z-50"
            >
              Italic (Ctrl+I)
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={editor.isActive("underline")}
                onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
                className={cn(
                  "h-8 w-8 p-2 hover:bg-accent hover:text-accent-foreground",
                  editor.isActive("underline") && "bg-muted text-muted-foreground"
                )}
              >
                <Underline className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent 
              side="bottom" 
              className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs z-50"
            >
              Underline (Ctrl+U)
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={editor.isActive("strike")}
                onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                className={cn(
                  "h-8 w-8 p-2 hover:bg-accent hover:text-accent-foreground",
                  editor.isActive("strike") && "bg-muted text-muted-foreground"
                )}
              >
                <Strikethrough className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent 
              side="bottom" 
              className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs z-50"
            >
              Strikethrough
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={editor.isActive("subscript")}
                onPressedChange={() => editor.chain().focus().toggleSubscript().run()}
                className={cn(
                  "h-8 w-8 p-2 hover:bg-accent hover:text-accent-foreground",
                  editor.isActive("subscript") && "bg-muted text-muted-foreground"
                )}
              >
                <Subscript className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent 
              side="bottom" 
              className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs z-50"
            >
              Subscript
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={editor.isActive("superscript")}
                onPressedChange={() => editor.chain().focus().toggleSuperscript().run()}
                className={cn(
                  "h-8 w-8 p-2 hover:bg-accent hover:text-accent-foreground",
                  editor.isActive("superscript") && "bg-muted text-muted-foreground"
                )}
              >
                <Superscript className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent 
              side="bottom" 
              className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs z-50"
            >
              Superscript
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="h-6 w-px bg-border mx-1" />

        {/* Text Alignment */}
        <div className="flex gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={editor.isActive({ textAlign: 'left' })}
                onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}
                className={cn(
                  "h-8 w-8 p-2 hover:bg-accent hover:text-accent-foreground",
                  editor.isActive({ textAlign: 'left' }) && "bg-muted text-muted-foreground"
                )}
              >
                <AlignLeft className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent 
              side="bottom" 
              className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs z-50"
            >
              Align Left
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={editor.isActive({ textAlign: 'center' })}
                onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}
                className={cn(
                  "h-8 w-8 p-2 hover:bg-accent hover:text-accent-foreground",
                  editor.isActive({ textAlign: 'center' }) && "bg-muted text-muted-foreground"
                )}
              >
                <AlignCenter className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent 
              side="bottom" 
              className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs z-50"
            >
              Align Center
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={editor.isActive({ textAlign: 'right' })}
                onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}
                className={cn(
                  "h-8 w-8 p-2 hover:bg-accent hover:text-accent-foreground",
                  editor.isActive({ textAlign: 'right' }) && "bg-muted text-muted-foreground"
                )}
              >
                <AlignRight className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent 
              side="bottom" 
              className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs z-50"
            >
              Align Right
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={editor.isActive({ textAlign: 'justify' })}
                onPressedChange={() => editor.chain().focus().setTextAlign('justify').run()}
                className={cn(
                  "h-8 w-8 p-2 hover:bg-accent hover:text-accent-foreground",
                  editor.isActive({ textAlign: 'justify' }) && "bg-muted text-muted-foreground"
                )}
              >
                <AlignJustify className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent 
              side="bottom" 
              className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs z-50"
            >
              Justify
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="h-6 w-px bg-border mx-1" />

        {/* Headings */}
        <div className="flex gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={editor.isActive("heading", { level: 1 })}
                onPressedChange={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                className={cn(
                  "h-8 w-8 p-2 hover:bg-accent hover:text-accent-foreground",
                  editor.isActive("heading", { level: 1 }) && "bg-muted text-muted-foreground"
                )}
              >
                <Heading1 className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent 
              side="bottom" 
              className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs z-50"
            >
              Heading 1
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={editor.isActive("heading", { level: 2 })}
                onPressedChange={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={cn(
                  "h-8 w-8 p-2 hover:bg-accent hover:text-accent-foreground",
                  editor.isActive("heading", { level: 2 }) && "bg-muted text-muted-foreground"
                )}
              >
                <Heading2 className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent 
              side="bottom" 
              className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs z-50"
            >
              Heading 2
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={editor.isActive("heading", { level: 3 })}
                onPressedChange={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                className={cn(
                  "h-8 w-8 p-2 hover:bg-accent hover:text-accent-foreground",
                  editor.isActive("heading", { level: 3 }) && "bg-muted text-muted-foreground"
                )}
              >
                <Heading3 className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent 
              side="bottom" 
              className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs z-50"
            >
              Heading 3
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="h-6 w-px bg-border mx-1" />

        {/* Lists and Blocks */}
        <div className="flex gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={editor.isActive("bulletList")}
                onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                className={cn(
                  "h-8 w-8 p-2 hover:bg-accent hover:text-accent-foreground",
                  editor.isActive("bulletList") && "bg-muted text-muted-foreground"
                )}
              >
                <List className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent 
              side="bottom" 
              className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs z-50"
            >
              Bullet List
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={editor.isActive("orderedList")}
                onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                className={cn(
                  "h-8 w-8 p-2 hover:bg-accent hover:text-accent-foreground",
                  editor.isActive("orderedList") && "bg-muted text-muted-foreground"
                )}
              >
                <ListOrdered className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent 
              side="bottom" 
              className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs z-50"
            >
              Numbered List
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={editor.isActive("blockquote")}
                onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                className={cn(
                  "h-8 w-8 p-2 hover:bg-accent hover:text-accent-foreground",
                  editor.isActive("blockquote") && "bg-muted text-muted-foreground"
                )}
              >
                <Quote className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent 
              side="bottom" 
              className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs z-50"
            >
              Blockquote
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={editor.isActive("code")}
                onPressedChange={() => editor.chain().focus().toggleCode().run()}
                className={cn(
                  "h-8 w-8 p-2 hover:bg-accent hover:text-accent-foreground",
                  editor.isActive("code") && "bg-muted text-muted-foreground"
                )}
              >
                <Code className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent 
              side="bottom" 
              className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs z-50"
            >
              Inline Code
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="h-6 w-px bg-border mx-1" />

        {/* Colors and Highlighting */}
        <div className="flex gap-1">
          {/* Text Color Picker */}
          <div className="relative" ref={colorPickerRef}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="h-8 w-8 p-2 hover:bg-accent hover:text-accent-foreground rounded"
                >
                  <Palette className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent 
                side="bottom" 
                className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs z-50"
              >
                Text Color
              </TooltipContent>
            </Tooltip>
            
            {showColorPicker && (
              <div className="absolute top-full left-0 mt-1 p-2 bg-white dark:bg-gray-800 border rounded-md shadow-lg z-50 w-64">
                <div className="grid grid-cols-10 gap-1">
                  {textColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => {
                        editor.chain().focus().setColor(color).run();
                        setShowColorPicker(false);
                      }}
                      className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      editor.chain().focus().unsetColor().run();
                      setShowColorPicker(false);
                    }}
                    className="w-full px-2 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                  >
                    Remove Color
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Highlight Color Picker */}
          <div className="relative" ref={highlightPickerRef}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setShowHighlightPicker(!showHighlightPicker)}
                  className="h-8 w-8 p-2 hover:bg-accent hover:text-accent-foreground rounded"
                >
                  <Highlighter className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent 
                side="bottom" 
                className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs z-50"
              >
                Highlight Color
              </TooltipContent>
            </Tooltip>
            
            {showHighlightPicker && (
              <div className="absolute top-full left-0 mt-1 p-2 bg-white dark:bg-gray-800 border rounded-md shadow-lg z-50 w-48">
                <div className="grid grid-cols-8 gap-1">
                  {highlightColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => {
                        editor.chain().focus().setHighlight({ color }).run();
                        setShowHighlightPicker(false);
                      }}
                      className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      editor.chain().focus().unsetHighlight().run();
                      setShowHighlightPicker(false);
                    }}
                    className="w-full px-2 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                  >
                    Remove Highlight
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="h-6 w-px bg-border mx-1" />

        {/* Links and Media */}
        <div className="flex gap-1">
          <div className="relative" ref={linkDialogRef}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setShowLinkDialog(!showLinkDialog)}
                  className="h-8 w-8 p-2 hover:bg-accent hover:text-accent-foreground rounded"
                >
                  <Link className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent 
                side="bottom" 
                className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs z-50"
              >
                Add Link
              </TooltipContent>
            </Tooltip>

            {showLinkDialog && (
              <div className="absolute top-full left-0 mt-1 p-3 bg-white dark:bg-gray-800 border rounded-md shadow-lg z-50 w-64">
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="Enter URL..."
                    className="flex-1 px-2 py-1 text-sm border rounded"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addLink();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addLink}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={removeLink}
                className="h-8 w-8 p-2 hover:bg-accent hover:text-accent-foreground rounded disabled:opacity-50"
                disabled={!editor.isActive("link")}
              >
                <Unlink className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent 
              side="bottom" 
              className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs z-50"
            >
              Remove Link
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={addImage}
                className="h-8 w-8 p-2 hover:bg-accent hover:text-accent-foreground rounded"
              >
                <Image className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent 
              side="bottom" 
              className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs z-50"
            >
              Add Image
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={insertTable}
                className="h-8 w-8 p-2 hover:bg-accent hover:text-accent-foreground rounded"
              >
                <Table className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent 
              side="bottom" 
              className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs z-50"
            >
              Insert Table
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="h-6 w-px bg-border mx-1" />

        {/* Utility */}
        <div className="flex gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                className="h-8 w-8 p-2 hover:bg-accent hover:text-accent-foreground rounded"
              >
                <Minus className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent 
              side="bottom" 
              className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs z-50"
            >
              Horizontal Line
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
                className="h-8 w-8 p-2 hover:bg-accent hover:text-accent-foreground rounded"
              >
                <RemoveFormatting className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent 
              side="bottom" 
              className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs z-50"
            >
              Clear Formatting
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="h-6 w-px bg-border mx-1" />

        {/* Undo/Redo */}
        <div className="flex gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                className="h-8 w-8 p-2 hover:bg-accent hover:text-accent-foreground disabled:opacity-50 rounded"
              >
                <Undo2 className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent 
              side="bottom" 
              className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs z-50"
            >
              Undo (Ctrl+Z)
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                className="h-8 w-8 p-2 hover:bg-accent hover:text-accent-foreground disabled:opacity-50 rounded"
              >
                <Redo2 className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent 
              side="bottom" 
              className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs z-50"
            >
              Redo (Ctrl+Y)
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}