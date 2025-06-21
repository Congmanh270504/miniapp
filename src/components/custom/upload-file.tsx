"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { imagesTpye } from "@/types/itemTypes";
import SkeletionImages from "./loading";
import { CircleX } from "lucide-react";
import { getProductImages } from "@/app/action/products";
import { FileListResponse } from "pinata";
interface UploadFileProps {
  field: any; // Add this line to accept the field object from react-hook-form
  randomColor?: string;
  isLoadingFile: boolean;
  setIsLoadingFile: (value: boolean) => void;
  productImages?: imagesTpye[];
  files: Array<{ file: File }>;
  setFiles: React.Dispatch<React.SetStateAction<Array<{ file: File }>>>;
}

const UploadFile: React.FC<UploadFileProps> = ({
  field,
  randomColor,
  isLoadingFile,
  setIsLoadingFile,
  productImages,
  files,
  setFiles,
}) => {
  const [productUrl, setProductUrl] = useState<
    Array<{ file: FileListResponse; url: string }>
  >([]);
  const handleGetProductImages = async () => {
    if (!productImages) return null;
    return await getProductImages(productImages[0].productId);
  };
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingFile(true);
      const result = await handleGetProductImages(); // Call the function
      if (result) {
        setProductUrl(result);
        setFiles(
          result.map((item) => ({
            file: new File([], item.file.files[0]?.name || "unknown"),
          }))
        );
      }
      setIsLoadingFile(false);
    };
    fetchData();
  }, [productImages]);

  useEffect(() => {
    console.log(
      "Updated files:",
      files.map((file) => file.file.name)
    ); // Log the updated files state
    console.log("filed", field.value.length); // Log the field value
  }, [files]); // Run this effect whenever `files` changes

  const dropZoneConfig = {
    accept: ["jpg", "jpeg", "png"],
    maxSize: 1024 * 1024 * 10,
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (files.length + acceptedFiles.length > 6) {
        toast.error("You can only upload up to 6 files.");
        return;
      }

      const errors: string[] = []; // Collect validation errors

      const validFiles = acceptedFiles.filter((file) => {
        // Check if the file already exists
        if (files.some((f) => f.file.name === file.name)) {
          errors.push(`File "${file.name}" already exists.`);
          return false;
        }

        // Validate file type
        if (!dropZoneConfig.accept.some((ext) => file.type.endsWith(ext))) {
          errors.push(`File "${file.name}" has an unsupported file type.`);
          return false;
        }

        // Validate file size
        if ((file.size ?? 0) > dropZoneConfig.maxSize) {
          errors.push(`File "${file.name}" exceeds the maximum size of 10MB.`);
          return false;
        }

        return true; // File is valid
      });

      // Show all errors in a single toast
      if (errors.length > 0) {
        toast.error(errors.join("\n"));
      }

      // Update state with valid files
      setFiles((prevFiles) => [
        ...prevFiles,
        ...validFiles.map((file) => ({ file })),
      ]);
      field.onChange([
        ...(field.value as string[]),
        ...validFiles.map((file) => file.name),
      ]); // Update the form field with the current file names
    },
    [files]
  );
  const handleRemoveFile = async (index: number) => {
    setIsLoadingFile(true);
    setFiles((prev) => prev.filter((_, i) => i !== index));
    const list = field.value as string[]; // Get the current value of the field
    list.splice(index, 1);
    field.onChange(list);
    setIsLoadingFile(false);
  };

  const handleDeleteChangeFile = (cid: string) => {
    setProductUrl((prev) =>
      prev.filter((item) => item.file.files[0].cid !== cid)
    );
    const list = field.value as string[]; // Get the current value of the field
    list.splice(list.indexOf(cid), 1);
    field.onChange(list); // Update the form field with the current cid array
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps({
        className: "flex items-center justify-center w-full",
      })}
    >
      <div className="flex items-center justify-center w-full min-h-64 h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <div>
            {isLoadingFile ? (
              <div>
                Hang tight pls{" "}
                <span
                  className="loading loading-dots loading-xs"
                  style={{ color: randomColor ? randomColor : "#000" }}
                ></span>
              </div>
            ) : productUrl.length > 0 || files.length > 0 ? (
              <div className="grid grid-cols-3 place-items-center gap-2 my-4">
                {productUrl.map((file, index) => (
                  <div
                    key={index}
                    className="relative w-[200px] h-[150px] rounded-md overflow-hidden border border-gray-500 dark:border-gray-500"
                  >
                    <Image
                      src={file.url}
                      alt="Uploaded image"
                      fill
                      className="rounded-md object-cover"
                      sizes="200px"
                      quality={100}
                    />
                    <CircleX
                      className="absolute top-1 right-2 cursor-pointer"
                      style={{ color: randomColor }}
                      onClick={() =>
                        handleDeleteChangeFile(file.file.files[0].cid)
                      }
                    />
                  </div>
                ))}
                {files.slice(productUrl.length).map((file, index) => (
                  <div
                    key={index}
                    className="relative w-[200px] h-[150px] rounded-md overflow-hidden border border-gray-500 dark:border-gray-500"
                  >
                    <Image
                      src={URL.createObjectURL(file.file)}
                      alt="Uploaded image"
                      fill
                      className="rounded-md object-cover"
                      sizes="200px"
                      quality={100}
                    />
                    <CircleX
                      className="absolute top-1 right-2 cursor-pointer"
                      style={{ color: randomColor }}
                      onClick={() => handleRemoveFile(index)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG or JPEG (MAX. 10MB)
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      <Input
        {...getInputProps()}
        id="productsImages"
        name="productsImages"
        type="file"
        className="hidden"
        disabled={isLoadingFile}
      />
    </div>
  );
};

export default UploadFile;
