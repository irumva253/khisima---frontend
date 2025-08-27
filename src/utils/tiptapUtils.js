// src/utils/tiptapUtils.js

/**
 * Extract plain text from Tiptap JSON
 */
export const convertTiptapToText = (input) => {
  if (!input) return '';
  
  try {
    // Parse the input if it's a string
    const content = typeof input === 'string' ? JSON.parse(input) : input;
    
    // Check if this is valid Tiptap content
    if (content && content.type === "doc" && Array.isArray(content.content)) {
      return extractTextFromTiptap(content);
    }
    
    // If it's not valid Tiptap, return empty string
    return '';
    
  } catch (err) {
    console.error('Failed to convert Tiptap to text:', err);
    return '';
  }
};

/**
 * Extract text from properly formatted Tiptap JSON
 */
const extractTextFromTiptap = (tiptapContent) => {
  if (!tiptapContent || !tiptapContent.content || !Array.isArray(tiptapContent.content)) {
    return '';
  }
  
  let text = '';
  
  const extractText = (node) => {
    // Extract text from text nodes
    if (node.type === 'text' && node.text) {
      text += node.text + ' ';
    }
    
    // Handle hard breaks as spaces
    if (node.type === 'hardBreak') {
      text += ' ';
    }
    
    // Recursively process child nodes
    if (node.content && Array.isArray(node.content)) {
      node.content.forEach(extractText);
    }
    
    // Handle list items
    if (node.type === 'listItem' && node.content && Array.isArray(node.content)) {
      node.content.forEach(extractText);
    }
  };
  
  // Process all content nodes
  tiptapContent.content.forEach(extractText);
  
  // Clean up the text
  return cleanText(text);
};

/**
 * Clean and normalize text
 */
const cleanText = (text) => {
  if (!text) return '';
  
  return text
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .replace(/\n\s*/g, ' ') // Replace newlines with spaces
    .trim();
};

/**
 * Check if a value is valid Tiptap JSON
 */
export const isValidTiptapJson = (value) => {
  if (!value) return false;
  
  try {
    const content = typeof value === 'string' ? JSON.parse(value) : value;
    return content && content.type === "doc" && Array.isArray(content.content);
  } catch (err) {
    console.error('Invalid Tiptap JSON:', err);
    return false;
  }
};

/**
 * Create an empty Tiptap document structure
 */
export const createEmptyTiptapDoc = () => {
  return JSON.stringify({
    type: "doc",
    content: [{ type: "paragraph", content: [{ type: "text", text: "" }] }],
  });
};

/**
 * Debug function to analyze Tiptap content
 */
export const debugTiptapContent = (content) => {
  console.log("=== TIPTAP DEBUG ===");
  console.log("Input type:", typeof content);
  
  try {
    const parsed = typeof content === 'string' ? JSON.parse(content) : content;
    console.log("Parsed content structure:", parsed);
    
    if (parsed && parsed.content && Array.isArray(parsed.content)) {
      console.log("Number of content blocks:", parsed.content.length);
      
      parsed.content.forEach((block, index) => {
        console.log(`Block ${index}:`, block.type);
        if (block.content && Array.isArray(block.content)) {
          console.log(`  Number of items:`, block.content.length);
        }
      });
    }
  } catch (e) {
    console.log("Cannot parse content:", e.message);
  }
};