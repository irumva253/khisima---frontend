import { cn } from "@/lib/utils";
import { 
  CloudUploadIcon, 
  ImageIcon, 
  RefreshCcwDotIcon, 
  RefreshCw, 
  Trash2Icon 
} from "lucide-react";
import { Button } from "../ui/button";


export function RenderEmptyState({ isDragActive }) {
  return (
    <div className="text-center">
      <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-muted mb-4">
        <CloudUploadIcon
          className={cn(
            "size-6 text-muted-foreground",
            isDragActive && "text-primary"
          )}
        />
      </div>
      <div className="text-gray-500">
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>
            Drag and drop some files here, or{" "}
            <span className="text-primary">click to select files</span>
          </p>
        )}
      </div>
      <div className="mt-4 text-sm text-gray-400">
        Supported formats: .jpg, .png, .pdf
      </div>
      <Button type="button" className="mt-4">
        Select File
      </Button>
    </div>
  );
}

export function RenderErrorState({ errorMessage }) {
  return (
    <div className="text-center">
      <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-destructive/30 mb-4">
        <ImageIcon className={cn("size-6 text-destructive")} />
      </div>
      <div className="text-base font-semibold">Error Uploading File</div>
      <p className="text-xs mt-1 text-muted-foreground">{errorMessage}</p>
      <Button type="button" className="mt-4">
        <RefreshCw /> Retry File Selection
      </Button>
    </div>
  );
}

export function RenderUploadingState({ file, progress }) {
  return (
    <div className="flex flex-col items-center space-y-2 w-full">
      <p className="text-sm text-muted-foreground">
        Uploading <strong>{file.name}</strong> ({progress}%)
      </p>

      <div className="w-full bg-gray-200 rounded-full h-2.5 relative">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>

        <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-white font-semibold">
          {progress}%
        </span>
      </div>
    </div>
  );
}

export function RenderUploadedState({
  filePreviewUrl,
  isDeleting,
  handleRemoveFile,
  fileType,
}) {
  return (
    <div className="relative group w-full flex items-center justify-center rounded-md overflow-hidden border border-muted bg-muted/50 shadow-sm min-h-[200px]">
      {fileType === "image" ? (
        <img
          src={filePreviewUrl}
          alt="Uploaded file preview"
          fill
          className="object-contain p-2"
        />
      ) : (
        <video
          src={filePreviewUrl}
          controls
          className="w-full max-h-96 object-contain p-2"
        />
      )}

      <Button
        onClick={handleRemoveFile}
        disabled={isDeleting}
        variant="destructive"
        className="absolute top-4 right-4 size-8 p-1 rounded-full shadow bg-destructive text-white hover:bg-destructive/80"
      >
        {isDeleting ? (
          <span className="animate-spin">
            <RefreshCcwDotIcon className="size-4" />
          </span>
        ) : (
          <Trash2Icon className="size-4" />
        )}
      </Button>
    </div>
  );
}
