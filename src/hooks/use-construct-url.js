// src/hooks/use-construct-url.js
export function useConstructUrl(url) {
  // Example: convert relative path to full URL
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${window.location.origin}/${url}`;
}
