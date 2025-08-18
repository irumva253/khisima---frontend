/* eslint-disable no-unused-vars */
"use client";

import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '../ui/card';
import { cn } from '@/lib/utils';
import { RenderEmptyState, RenderErrorState, RenderUploadedState, RenderUploadingState } from './RenderState';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { useConstructUrl } from '@/hooks/use-construct-url';

export function Uploader({ value, onChange, fileTypeAccepted }) {
  const fileUrl = useConstructUrl(value || '');
  const [fileState, setFileState] = useState({
    error: false,
    file: null,
    id: null,
    isDeleting: false,
    progress: 0,
    uploading: false,
    fileType: fileTypeAccepted,
    key: value,
    objectUrl: value ? fileUrl : null,
  });

  const uploadFile = useCallback(
    async (file) => {
      try {
        setFileState(prev => ({
          ...prev,
          uploading: true,
          progress: 0,
          error: false,
        }));

        const presignedResponse = await fetch('/api/s3/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type,
            fileSize: file.size,
            isImage: fileTypeAccepted === 'image',
          }),
        });

        if (!presignedResponse.ok) throw new Error('Failed to get presigned URL');

        const { presignedUrl, key } = await presignedResponse.json();

        await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('PUT', presignedUrl, true);
          xhr.setRequestHeader('Content-Type', file.type);

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percentComplete = Math.round((event.loaded / event.total) * 100);
              setFileState(prev => ({ ...prev, progress: percentComplete }));
            }
          };

          xhr.onload = () => {
            if (xhr.status === 200 || xhr.status === 204) {
              resolve();
              setFileState(prev => ({
                ...prev,
                uploading: false,
                progress: 100,
                key: key,
              }));
              onChange?.(key);
              toast.success('File uploaded successfully');
            } else {
              reject(new Error(`Upload failed with status ${xhr.status}`));
            }
          };

          xhr.onerror = () => reject(new Error('Network error during upload'));

          xhr.send(file);
        });
      } catch (error) {
        toast.error(error.message || 'An unexpected error occurred during upload.');
        setFileState(prev => ({ ...prev, uploading: false, progress: 0, error: true }));
      }
    },
    [fileTypeAccepted, onChange]
  );

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        if (fileState.objectUrl && !fileState.objectUrl.startsWith('http')) {
          URL.revokeObjectURL(fileState.objectUrl);
        }

        setFileState({
          file: file,
          id: uuidv4(),
          uploading: true,
          progress: 0,
          error: false,
          isDeleting: false,
          objectUrl: URL.createObjectURL(file),
          fileType: fileTypeAccepted,
        });

        uploadFile(file);
      }
    },
    [fileState.objectUrl, uploadFile, fileTypeAccepted]
  );

  async function handleRemoveFile() {
    try {
      setFileState(prev => ({ ...prev, isDeleting: true }));

      const response = await fetch('/api/s3/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: fileState.key }),
      });

      if (!response.ok) {
        toast.error('Failed to delete file');
        setFileState(prev => ({ ...prev, isDeleting: true, error: true }));
        return;
      }

      if (fileState.objectUrl && !fileState.objectUrl.startsWith('http')) {
        URL.revokeObjectURL(fileState.objectUrl);
      }

      onChange?.('');
      setFileState({
        file: null,
        id: null,
        uploading: false,
        progress: 0,
        isDeleting: false,
        error: false,
        objectUrl: null,
        fileType: fileTypeAccepted,
      });
      toast.success('File deleted successfully');
    } catch (error) {
      toast.error('Failed to delete file, please try again!');
      setFileState(prev => ({ ...prev, isDeleting: false, error: true }));
    }
  }

  function rejectedFiles(fileRejection) {
    if (fileRejection.length) {
      const tooManyFiles = fileRejection.find(r => r.errors[0].code === 'too-many-files');
      const fileSizeTooBig = fileRejection.find(r => r.errors[0].code === 'file-too-large');

      if (fileSizeTooBig) {
        toast.error(`File ${fileRejection[0].file.name} is too large. Maximum size is 5MB.`);
      } else if (fileRejection[0].errors[0].code === 'file-invalid-type') {
        toast.error(`File ${fileRejection[0].file.name} is not a valid image type.`);
      }

      if (tooManyFiles) toast.error('You can only upload one file at a time.');
      else toast.error(`File ${fileRejection[0].file.name} is not supported.`);
    }
  }

  function renderContent() {
    if (fileState.uploading && fileState.file) {
      return <RenderUploadingState file={fileState.file} progress={fileState.progress} />;
    }

    if (fileState.error) return <RenderErrorState errorMessage={''} />;

    if (fileState.objectUrl) {
      return (
        <RenderUploadedState
          filePreviewUrl={fileState.objectUrl}
          isDeleting={fileState.isDeleting}
          handleRemoveFile={handleRemoveFile}
          fileType={fileState.fileType}
        />
      );
    }

    return <RenderEmptyState isDragActive={isDragActive} />;
  }

  useEffect(() => {
    return () => {
      if (fileState.objectUrl && !fileState.objectUrl.startsWith('http')) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
    };
  }, [fileState.objectUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: fileTypeAccepted === 'video' ? { 'video/*': [] } : { 'image/*': [] },
    maxFiles: 1,
    multiple: false,
    maxSize: fileTypeAccepted === 'image' ? 5 * 1024 * 1024 : 5000 * 1024 * 1024,
    onDropRejected: rejectedFiles,
    disabled: fileState.uploading || !!fileState.objectUrl,
  });

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed border-gray-300 p-6 text-center hover:border-primary transition-colors cursor-pointer",
        isDragActive
          ? 'border-primary bg-primary/10 border-solid'
          : 'border-border hover:border-border/80 transition-colors cursor-pointer'
      )}
    >
      <CardContent className="flex items-center justify-center h-full w-full">
        <input {...getInputProps()} />
        {renderContent()}
      </CardContent>
    </Card>
  );
}
