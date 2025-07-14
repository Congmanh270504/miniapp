import { useCallback, useRef, useState } from "react";

interface UploadedFile {
  id: string;
  cid: string;
  fileName: string;
  size: number;
  uploadTime: number;
}

interface UseFileUploadOptions {
  endpoint: string;
  autoDeleteDelay?: number; // in milliseconds
  debounceDelay?: number; // in milliseconds for image changes
}

export const useFileUpload = ({
  endpoint,
  autoDeleteDelay = 20 * 60 * 1000, // 20 minutes
  debounceDelay = 2000, // 2 seconds
}: UseFileUploadOptions) => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const deleteFile = useCallback(async (cid: string) => {
    try {
      await fetch("/api/uploadFiles/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cid }),
      });
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  }, []);

  const uploadFile = useCallback(
    async (file: File, fieldName: string = "file") => {
      setIsUploading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append(fieldName, file);

        const response = await fetch(endpoint, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const result = await response.json();
        const newUploadedFile: UploadedFile = {
          id: result.audioId || result.imageId,
          cid: result.audioCid || result.imageCid,
          fileName: result.fileName,
          size: result.size,
          uploadTime: Date.now(),
        };

        // If there was a previous file, delete it
        if (uploadedFile?.cid) {
          await deleteFile(uploadedFile.cid);
        }

        setUploadedFile(newUploadedFile);

        // Clear existing timeout
        if (deleteTimeoutRef.current) {
          clearTimeout(deleteTimeoutRef.current);
        }

        // Set new auto-delete timeout
        deleteTimeoutRef.current = setTimeout(() => {
          deleteFile(newUploadedFile.cid);
          setUploadedFile(null);
        }, autoDeleteDelay);

        return newUploadedFile;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
        throw err;
      } finally {
        setIsUploading(false);
      }
    },
    [endpoint, uploadedFile, deleteFile, autoDeleteDelay]
  );

  const uploadWithDebounce = useCallback(
    (file: File, fieldName: string = "file") => {
      // Clear existing debounce
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Set new debounce timeout
      debounceTimeoutRef.current = setTimeout(() => {
        uploadFile(file, fieldName);
      }, debounceDelay);
    },
    [uploadFile, debounceDelay]
  );

  const clearFile = useCallback(async () => {
    if (uploadedFile?.cid) {
      await deleteFile(uploadedFile.cid);
    }

    setUploadedFile(null);
    setError(null);

    // Clear timeouts
    if (deleteTimeoutRef.current) {
      clearTimeout(deleteTimeoutRef.current);
    }
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
  }, [uploadedFile, deleteFile]);

  const cancelAutoDelete = useCallback(() => {
    if (deleteTimeoutRef.current) {
      clearTimeout(deleteTimeoutRef.current);
      deleteTimeoutRef.current = null;
    }
  }, []);

  return {
    uploadedFile,
    isUploading,
    error,
    uploadFile,
    uploadWithDebounce,
    clearFile,
    cancelAutoDelete,
  };
};
