"use client";
import React, { useCallback, useState, useEffect } from "react";
import { Music, X, Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { useFileUpload } from "@/hooks/useFileUpload";
import { toast } from "sonner";

const UploadAudioSong = ({
  field,
  isPending,
  onAudioUploaded,
  onDurationExtracted,
}: {
  field: any;
  isPending: boolean;
  onAudioUploaded?: (cid: string) => void;
  onDurationExtracted?: (duration: number) => void;
}) => {
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [duration, setDuration] = useState<number>(0);

  const {
    uploadedFile,
    isUploading,
    error,
    uploadFile,
    clearFile,
    cancelAutoDelete,
  } = useFileUpload({
    endpoint: "/api/uploadFiles/audio",
    autoDeleteDelay: 20 * 60 * 1000, // 20 minutes
  });

  const extractAudioDuration = useCallback((file: File): Promise<number> => {
    return new Promise((resolve) => {
      const audio = new Audio();
      const url = URL.createObjectURL(file);

      audio.addEventListener("loadedmetadata", () => {
        const duration = audio.duration;
        URL.revokeObjectURL(url);
        resolve(duration);
      });

      audio.addEventListener("error", () => {
        URL.revokeObjectURL(url);
        resolve(0);
      });

      audio.src = url;
    });
  }, []);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setCurrentFile(file);
        field.onChange(file);

        // Extract duration
        const audioDuration = await extractAudioDuration(file);
        setDuration(audioDuration);
        if (onDurationExtracted) {
          onDurationExtracted(audioDuration);
        }

        // Upload immediately for audio files
        try {
          await uploadFile(file, "audio");
        } catch (error) {
          console.error("Upload failed:", error);
        }
      }
    },
    [field, extractAudioDuration, onDurationExtracted, uploadFile]
  );

  // Effect to handle upload completion
  useEffect(() => {
    if (uploadedFile?.cid && onAudioUploaded) {
      onAudioUploaded(uploadedFile.cid);
      toast.success("Audio uploaded successfully!");
    }
  }, [uploadedFile, onAudioUploaded]);

  // Effect to handle upload errors
  useEffect(() => {
    if (error) {
      toast.error(`Upload failed: ${error}`);
    }
  }, [error]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "audio/*": [".mp3", ".wav", ".flac", ".m4a", ".aac"],
    },
    maxSize: 50 * 1024 * 1024, // 50 MB
    multiple: false,
    maxFiles: 1,
  });

  const removeAudio = async () => {
    setCurrentFile(null);
    setDuration(0);
    field.onChange(undefined);
    if (onDurationExtracted) {
      onDurationExtracted(0);
    }
    await clearFile();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full h-full">
      <div
        {...getRootProps()}
        className={`h-full border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center transition-colors cursor-pointer relative ${
          isDragActive
            ? "border-blue-400 bg-blue-400/10"
            : currentFile
            ? "border-gray-600"
            : "border-gray-600 hover:border-gray-500"
        }`}
      >
        <input {...getInputProps()} />

        {currentFile ? (
          <div className="relative w-full">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                removeAudio();
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

            {/* Upload status indicator */}
            {isUploading && (
              <div className="absolute top-2 left-2 z-10 bg-blue-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                <Upload className="h-3 w-3 animate-pulse" />
                Uploading...
              </div>
            )}

            {uploadedFile?.cid && (
              <div className="absolute top-2 left-2 z-10 bg-green-600 text-white px-2 py-1 rounded text-xs">
                ✓ Uploaded
              </div>
            )}

            <div className="flex flex-col items-center justify-center py-8">
              <Music className="w-16 h-16 text-white stroke-1 mb-4" />
              <p className="text-white text-lg font-medium mb-2 dark:text-white">
                {currentFile.name}
              </p>
              {duration > 0 && (
                <p className="text-gray-400 text-sm dark:text-gray-300">
                  Duration: {formatDuration(duration)}
                </p>
              )}
              <p className="text-gray-500 text-xs mt-2 dark:text-gray-400">
                Size: {(currentFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
        ) : (
          <div className="py-12">
            <div className="mb-4 justify-items-center">
              <Music className="w-16 h-16 text-white stroke-1" />
            </div>
            <p className="text-white text-lg font-medium mb-2 dark:text-white">
              {isDragActive ? "Drop the audio file here" : "Add audio file"}
            </p>
            <p className="text-gray-400 text-sm dark:text-gray-300">
              Drag & drop an audio file here, or click to select
            </p>
            <p className="text-gray-500 text-xs mt-1 dark:text-gray-400">
              Supports: MP3, WAV, FLAC, M4A, AAC (Max: 50MB)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadAudioSong;
