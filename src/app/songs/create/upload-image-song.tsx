"use client";
import React, { useCallback, useState, useEffect } from "react";
import { ImageIcon, X, Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { useFileUpload } from "@/hooks/useFileUpload";
import { toast } from "sonner";

const UploadImageSong = ({
  field,
  isPending,
  onImageUploaded,
}: {
  field: any;
  isPending: boolean;
  onImageUploaded?: (cid: string) => void;
}) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  const {
    uploadedFile,
    isUploading,
    error,
    uploadWithDebounce,
    clearFile,
    cancelAutoDelete,
  } = useFileUpload({
    endpoint: "/api/uploadFiles/image",
    autoDeleteDelay: 20 * 60 * 1000, // 20 minutes
    debounceDelay: 3000, // 3 seconds debounce for image changes
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setUploadedImage(imageUrl);
        setCurrentFile(file);
        field.onChange(file);

        // Upload with debounce to avoid multiple uploads when user changes image quickly
        uploadWithDebounce(file, "image");
      }
    },
    [field, uploadWithDebounce]
  );

  // Effect to handle upload completion
  useEffect(() => {
    if (uploadedFile?.cid && onImageUploaded) {
      onImageUploaded(uploadedFile.cid);
    }
  }, [uploadedFile, onImageUploaded]);

  // Effect to handle upload errors
  useEffect(() => {
    if (error) {
      toast.error(`Upload failed: ${error}`);
    }
  }, [error]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    maxSize: 10 * 1024 * 1024, // 10 MB
    multiple: false,
    maxFiles: 1,
  });

  const removeImage = async () => {
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage);
    }
    setUploadedImage(null);
    setCurrentFile(null);
    field.onChange(undefined);
    await clearFile();
  };

  return (
    <div className="w-full h-full">
      <div
        {...getRootProps()}
        className={`h-full border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center transition-colors cursor-pointer relative ${
          isDragActive
            ? "border-blue-400 bg-blue-400/10"
            : uploadedImage
            ? "border-gray-600"
            : "border-gray-600 hover:border-gray-500"
        }`}
      >
        <input {...getInputProps()} />

        {uploadedImage ? (
          <div className="relative w-full">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                removeImage();
              }}
              disabled={isPending || isUploading}
              variant="secondary"
              size="sm"
              className={`absolute top-2 right-2 z-10 h-8 w-8 p-0 ${
                isPending || isUploading ? "bg-red-400" : "bg-red-600"
              } hover:bg-black/70 border-none`}
            >
              <X className="h-4 w-4 text-white" />
            </Button>

            <img
              src={uploadedImage || "/placeholder.svg"}
              alt={currentFile?.name || "Uploaded image"}
              className="w-full h-auto max-h-96 object-contain rounded-md"
            />
            <p className="text-black text-sm mt-2 truncate">
              {currentFile?.name}
            </p>
          </div>
        ) : (
          <div className="py-12">
            <div className="mb-4 justify-items-center">
              <ImageIcon className="w-16 h-16 text-white stroke-1" />
            </div>
            <p className="text-white text-lg font-medium mb-2">
              {isDragActive ? "Drop the image here" : "Add new artwork"}
            </p>
            <p className="text-gray-400 text-sm">
              Drag & drop an image here, or click to select
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Supports: JPEG, PNG, JPG
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadImageSong;
