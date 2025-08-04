"use client";
import React, { useCallback, useState, useEffect, useRef } from "react";
import { ImageIcon, X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { getSongsDataPinata } from "@/lib/actions/songs";
import { toast } from "sonner";

const UploadImageSongEdit = ({
  field,
  isPending,
  currentImageCid,
  title,
}: {
  field: any;
  isPending: boolean;
  currentImageCid: string;
  title: string;
}) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<File[]>([]);
  const [currentImage, setCurrentImage] = useState<{
    url: string;
    title: string;
  }>({ url: "", title: "" });
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const deleteCurrentImageAndSelectNew = async () => {
    try {
      setIsDeleting(true);

      // If there's an uploaded image, just remove it and open file picker
      if (uploadedImage) {
        removeImage();
        triggerFileSelect();
        return;
      }

      // If it's the current image from database, delete it from Pinata
      if (currentImageCid) {
        const response = await fetch("/api/uploadFiles/delete", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: currentImageCid }),
        });

        if (response.ok) {
          toast.success("Current image deleted successfully");
          // Clear current image
          setCurrentImage({ url: "", title: "" });
          // Open file picker to select new image
          triggerFileSelect();
        } else {
          toast.error("Failed to delete current image");
        }
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Error deleting image");
    } finally {
      setIsDeleting(false);
    }
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
      setFileName([file]);
      field.onChange(file);
    }
    // Reset input value để có thể chọn lại cùng file
    event.target.value = "";
  };

  const displayImage = uploadedImage || currentImage.url;
  const displayName = fileName[0]?.name || "Current image";
  const currentImageTitle = currentImage.title || title;

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
        {/* Hidden file input for manual trigger */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />

        {displayImage ? (
          <div className="relative w-full">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                deleteCurrentImageAndSelectNew();
              }}
              disabled={isPending || isDeleting}
              variant="secondary"
              size="sm"
              className={`absolute top-2 right-2 z-10 h-8 w-8 p-0 ${
                isPending || isDeleting ? "bg-red-400" : "bg-red-600"
              } hover:bg-black/70 border-none`}
            >
              {isDeleting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <X className="h-4 w-4 text-white" />
              )}
            </Button>
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
