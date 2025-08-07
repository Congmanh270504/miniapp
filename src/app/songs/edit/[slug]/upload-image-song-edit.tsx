"use client";
import React, { useCallback, useState, useEffect } from "react";
import { ImageIcon, X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { useFileUpload } from "@/hooks/useFileUpload";
import { getSongsDataPinata } from "@/lib/actions/songs";
import { toast } from "sonner";

const UploadImageSongEdit = ({
  field,
  isPending,
  currentImageCid,
  title,
  onImageUploaded,
  onUploadStatusChange,
}: {
  field: any;
  isPending: boolean;
  currentImageCid: string;
  title: string;
  onImageUploaded?: (cid: string) => void;
  onUploadStatusChange?: (uploading: boolean) => void;
}) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<{
    url: string;
    title: string;
  }>({ url: "", title: "" });

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
  // Load current image when component mounts
  useEffect(() => {
    if (currentImageCid) {
      getSongsDataPinata(currentImageCid).then((data) => {
        if (data) {
          setCurrentImage({ title: title, url: data });
        }
      });
    }
  }, [currentImageCid, title]);

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

  // Effect to handle upload status changes
  useEffect(() => {
    if (onUploadStatusChange) {
      onUploadStatusChange(isUploading);
    }
  }, [isUploading, onUploadStatusChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    maxSize: 10 * 1024 * 1024, // 10 MB
    multiple: false,
    maxFiles: 1,
  });

  return (
    <div className="w-full h-full">
      <div
        {...getRootProps()}
        className={`h-full border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center transition-colors cursor-pointer relative ${
          isDragActive
            ? "border-blue-400 bg-blue-400/10"
            : uploadedImage || currentImage.url
            ? "border-gray-600"
            : "border-gray-600 hover:border-gray-500"
        }`}
      >
        <input {...getInputProps()} disabled={isPending || isUploading} />

        {uploadedImage || currentImage.url ? (
          <div className="relative w-full">
            <img
              src={uploadedImage || currentImage.url}
              alt={currentFile?.name || currentImage.title || title}
              className={`w-full h-auto max-h-96 object-contain rounded-md transition-opacity duration-300 ${
                isUploading ? "opacity-50" : "opacity-100"
              }`}
            />
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-md">
                <div className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded">
                  Uploading...
                </div>
              </div>
            )}
            <p className="text-black text-sm mt-2 truncate">
              {uploadedImage ? currentFile?.name : currentImage.title || title}
            </p>
          </div>
        ) : (
          <div className="py-12">
            <div className="mb-4 justify-items-center">
              <ImageIcon className="w-16 h-16 text-white stroke-1" />
            </div>
            <p className="text-white text-lg font-medium mb-2">
              {isDragActive ? "Drop the image here" : "Change artwork"}
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

export default UploadImageSongEdit;
