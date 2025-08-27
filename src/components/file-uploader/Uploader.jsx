"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useGetPresignedUrlMutation, useDeleteFileMutation } from "@/slices/uploadApiSlice";
import { S3_BASE_URL } from "@/constants"; // Make sure this is imported correctly

export default function Uploader({ value, onChange, fileTypeAccepted = "image" }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(value ? `${S3_BASE_URL}/${value}` : null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [getPresignedUrl] = useGetPresignedUrlMutation();
  const [deleteFile] = useDeleteFileMutation();

  // Generate preview
  useEffect(() => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  // Auto-upload function
const uploadFile = useCallback(async (file) => {
  setUploading(true);
  try {
    console.log("Requesting presigned URL for:", file.name, file.type);
    
    const { presignedUrl, key } = await getPresignedUrl({
      fileName: file.name,
      contentType: file.type,
    }).unwrap();

    console.log("Received presigned URL:", presignedUrl);
    console.log("File key:", key);

    // For Tigris, we need to use the exact URL as returned by the backend
    // The URL already includes the bucket name in the path: https://t3.storage.dev/khisima-img-store/...
    const uploadUrl = presignedUrl;

    console.log("Final upload URL:", uploadUrl);

    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const res = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
        // Tigris might require additional headers
      },
      body: file,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    console.log("Upload response status:", res.status, res.statusText);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Upload error details:", errorText);
      
      // Parse XML error response for more details
      if (errorText.includes('<Error>')) {
        const errorMatch = errorText.match(/<Message>(.*?)<\/Message>/);
        const errorCodeMatch = errorText.match(/<Code>(.*?)<\/Code>/);
        const errorMessage = errorMatch ? errorMatch[1] : 'Unknown S3 error';
        const errorCode = errorCodeMatch ? errorCodeMatch[1] : 'Unknown';
        
        throw new Error(`S3 Error (${errorCode}): ${errorMessage}`);
      }
      
      throw new Error(`Upload failed: ${res.status} ${res.statusText}`);
    }

    onChange?.(key);
    // For public access, Tigris uses: https://khisima-img-store.t3.storage.dev/key
    setPreviewUrl(`https://khisima-img-store.t3.storage.dev/${key}`);
    setFile(null);
    toast.success("File uploaded successfully!");
  } catch (err) {
    console.error("Upload error:", err);
    if (err.name === 'AbortError') {
      toast.error("Upload timed out. Please try again.");
    } else if (err.message?.includes('Failed to fetch')) {
      toast.error("Network error. Check CORS configuration and URL validity.");
    } else if (err.message?.includes('SignatureDoesNotMatch')) {
      toast.error("Signature error. This is a backend configuration issue.");
    } else if (err.message?.includes('Access Denied')) {
      toast.error("Access denied. Check your Tigris permissions and credentials.");
    } else {
      toast.error(err?.message || "File upload failed.");
    }
  } finally {
    setUploading(false);
  }
}, [getPresignedUrl, onChange]);

  // Delete file
  const handleDelete = useCallback(async (e) => {
    e.stopPropagation(); // Prevent triggering dropzone
    if (!value && !previewUrl) return;
    setDeleting(true);
    try {
      if (value) await deleteFile({ key: value }).unwrap();
      setPreviewUrl(null);
      onChange?.("");
      toast.success("File deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err?.message || "Failed to delete file.");
    } finally {
      setDeleting(false);
    }
  }, [deleteFile, value, onChange, previewUrl]);

  // Dropzone setup
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      uploadFile(selectedFile); // auto-upload
    },
    [uploadFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:
      fileTypeAccepted === "image" 
        ? { "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"] } 
        : { "video/*": [".mp4", ".mov", ".avi", ".webm"] },
    maxFiles: 1,
  });

  return (
    <Card
      {...getRootProps()}
      className={`border-2 border-dashed p-4 text-center cursor-pointer ${
        isDragActive ? "border-primary bg-primary/10" : "border-gray-300"
      } relative`}
    >
      <CardContent className="flex flex-col items-center gap-3">
        <input {...getInputProps()} />

        {previewUrl ? (
          <div className="relative w-full max-w-xs">
            {fileTypeAccepted === "image" ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-48 w-full rounded-md object-contain border"
              />
            ) : (
              <video
                src={previewUrl}
                className="max-h-48 w-full rounded-md object-contain border"
                controls
              />
            )}
            <Button
              size="icon"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting || uploading}
              className="absolute top-2 right-2"
            >
              {deleting ? <Loader2 className="animate-spin" /> : <Trash2 />}
            </Button>
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-md">
                <Loader2 className="animate-spin w-6 h-6 text-gray-600" />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <p className="text-gray-500">
              {isDragActive ? "Drop the file here" : "Drag & drop a file here, or click to select"}
            </p>
            {uploading && <Loader2 className="animate-spin w-6 h-6 text-gray-600" />}
          </div>
        )}
      </CardContent>
    </Card>
  );
}