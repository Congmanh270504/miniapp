"use client";
import React, { useCallback, useState, useEffect } from "react";
import { ImageIcon, X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { getSongsDataPinata } from "@/lib/actions/songs";

const UploadImageSongEdit = ({
  field,
  isPending,
  currentImageCid,
}: {
  field: any;
  isPending: boolean;
  currentImageCid: string;
}) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<File[]>([]);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [currentImageTitle, setCurrentImageTitle] = useState<string | null>(
    null
  );

  // Load current image when component mounts
  useEffect(() => {
    if (currentImageCid) {
      getSongsDataPinata("", currentImageCid).then((data) => {
        if (data?.imageUrl) {
          setCurrentImageUrl(data.imageUrl);
        }
        if (data?.imageTitle) {
          setCurrentImageTitle(data.imageTitle);
        }
      });
    }
  }, [currentImageCid]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setUploadedImage(imageUrl);
        setFileName([file]);
        field.onChange(file);
      }
    },
    [field]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    multiple: false,
  });

  const removeImage = () => {
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage);
    }
    setUploadedImage(null);
    setFileName([]);
    field.onChange(undefined);
  };

  const displayImage = uploadedImage || currentImageUrl;
  const displayName = fileName[0]?.name || "Current image";

  return (
    <div className="w-full h-full">
      <div
        {...getRootProps()}
        className={`h-full border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center transition-colors cursor-pointer relative ${
          isDragActive
            ? "border-blue-400 bg-blue-400/10"
            : displayImage
            ? "border-gray-600"
            : "border-gray-600 hover:border-gray-500"
        }`}
      >
        <input {...getInputProps()} />

        {displayImage ? (
          <div className="relative w-full">
            {uploadedImage && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage();
                }}
                disabled={isPending}
                variant="secondary"
                size="sm"
                className={`absolute top-2 right-2 z-10 h-8 w-8 p-0 ${
                  isPending ? "bg-red-400" : "bg-red-600"
                } hover:bg-black/70 border-none`}
              >
                <X className="h-4 w-4 text-white" />
              </Button>
            )}
            <img
              src={displayImage}
              alt={displayName}
              className="w-full h-auto max-h-96 object-contain rounded-md"
            />
            <p className="text-black text-sm mt-2 truncate">
              {uploadedImage ? displayName : currentImageTitle}
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
