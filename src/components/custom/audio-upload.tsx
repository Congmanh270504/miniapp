"use client";

import { useCallback, useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileAudio, X, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { parseBlob } from "music-metadata-browser";
import SongForm from "@/app/songs/create/songs-form";
import { toast } from "sonner";
import Loading from "../ui/loading";

interface UploadedFileData {
  file: File;
  audioId?: string;
  audioCid?: string;
  isUploading: boolean;
  uploaded: boolean;
  artist: string;
  duration: number;
}

export default function AudioUpload() {
  const [uploadedFileData, setUploadedFileData] =
    useState<UploadedFileData | null>(null);
  const [error, setError] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Auto-delete timeout management
  const startAutoDeleteTimeout = useCallback((audioId: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        await fetch("/api/uploadFiles/delete", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: audioId }),
        });

        setUploadedFileData(null);
        toast.warning(
          "Audio file was automatically deleted due to timeout (20 minutes)"
        );
      } catch (error) {
        console.error("Error auto-deleting file:", error);
      }
    }, 20 * 60 * 1000); // 20 minutes
  }, []);

  const clearAutoDeleteTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const uploadAudioFile = useCallback(
    async (file: File) => {
      try {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("audio", file);

        const response = await fetch("/api/uploadFiles/audio", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const result = await response.json();

        setUploadedFileData((prev) =>
          prev
            ? {
                ...prev,
                audioId: result.audioId,
                audioCid: result.audioCid,
                isUploading: false,
                uploaded: true,
              }
            : null
        );

        // Start auto-delete timeout
        startAutoDeleteTimeout(result.audioId);

        return result;
      } catch (error) {
        setUploadedFileData((prev) =>
          prev
            ? {
                ...prev,
                isUploading: false,
                uploaded: false,
              }
            : null
        );

        toast.error("Failed to upload audio file");
        throw error;
      } finally {
        setIsUploading(false);
      }
    },
    [startAutoDeleteTimeout]
  );
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      try {
        setIsUploading(true);

        // Set initial loading state
        setUploadedFileData({
          file,
          isUploading: true,
          uploaded: false,
          artist: "",
          duration: 0,
        });

        // Extract metadata first
        const metadata = await parseBlob(file);
        const artist = metadata.common.artist || "";
        const durationInSeconds = metadata.format.duration || 0;
        const duration = Math.floor(durationInSeconds);

        // Update with metadata
        setUploadedFileData({
          file,
          isUploading: true,
          uploaded: false,
          artist,
          duration,
        });

        // Upload the file
        await uploadAudioFile(file);
      } catch (err) {
        setError("Could not read metadata or upload failed");
        setUploadedFileData(null);
        toast.error("Failed to process audio file");
        setIsUploading(false);
      }
    },
    [uploadAudioFile]
  );

  const removeFile = useCallback(async () => {
    setUploadedFileData(null);

    if (uploadedFileData?.audioId) {
      try {
        await fetch("/api/uploadFiles/delete", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: uploadedFileData.audioId }),
        });
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    }

    clearAutoDeleteTimeout();
  }, [uploadedFileData?.audioId, clearAutoDeleteTimeout]);

  // Clear timeout on component unmount
  useEffect(() => {
    return () => {
      clearAutoDeleteTimeout();
    };
  }, [clearAutoDeleteTimeout]);

  // Handle form submission success - clear timeout
  const handleFormSubmitSuccess = useCallback(() => {
    clearAutoDeleteTimeout();
  }, [clearAutoDeleteTimeout]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      "audio/*": [".mp3", ".mp4", ".wav", ".flac", ".aiff", ".alac"],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    noClick: true,
    noKeyboard: true,
    maxFiles: 1,
    multiple: false,
  });

  return (
    <div className="h-fit text-white p-6 ">
      <div className="w-full mx-auto">
        {uploadedFileData && (
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 text-[#333446] dark:text-white">
              Uploaded Files:
            </h1>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-600 rounded-lg group transition-colors">
                <div className="flex items-center space-x-3">
                  <FileAudio className="w-5 h-5 text-blue-400" />
                  <span className="text-white dark:text-white">
                    {uploadedFileData.file.name}
                  </span>
                  <span className="text-gray-400 text-sm dark:text-gray-300">
                    ({(uploadedFileData.file.size / (1024 * 1024)).toFixed(2)}{" "}
                    MB)
                  </span>
                  {uploadedFileData.duration > 0 && (
                    <span className="text-gray-400 text-sm dark:text-gray-300">
                      • {Math.floor(uploadedFileData.duration / 60)}:
                      {(uploadedFileData.duration % 60)
                        .toString()
                        .padStart(2, "0")}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {uploadedFileData.isUploading && (
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-blue-400 animate-spin" />
                      <span className="text-blue-400 text-xs dark:text-blue-300">
                        Uploading...
                      </span>
                    </div>
                  )}
                  {uploadedFileData.uploaded && (
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 text-xs dark:text-green-300">
                        Uploaded
                      </span>
                    </div>
                  )}
                  <Button
                    onClick={removeFile}
                    variant="ghost"
                    size="sm"
                    className="transition-opacity duration-200 hover:bg-red-600 text-white p-1 h-8 w-8"
                    disabled={uploadedFileData.isUploading}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        {uploadedFileData && uploadedFileData.uploaded ? (
          <div className="border-2 border-solid rounded-lg border-white p-4">
            <SongForm
              uploadedFiles={[uploadedFileData.file]}
              artist={uploadedFileData.artist}
              duration={uploadedFileData.duration}
              audioId={uploadedFileData.audioId}
              audioCid={uploadedFileData.audioCid}
              onSubmitSuccess={handleFormSubmitSuccess}
            />
          </div>
        ) : isUploading ? (
          <Loading />
        ) : (
          <div>
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4 text-[#333446] dark:text-white">
                Upload your audio files.
              </h1>
              <p className="text-[#333446] text-lg dark:text-gray-300">
                For best quality, use MP3, MP4, WAV, FLAC, AIFF, or ALAC. The
                maximum file size is 4.5MB uncompressed.{"  "}
                {/* <span className="text-blue-400 hover:text-blue-300 cursor-pointer dark:text-blue-300 dark:hover:text-blue-200">
                  Learn more.
                </span> */}
              </p>
            </div>

            <Card className="bg-transparent border-2 border-dashed border-gray-600 hover:border-gray-500 transition-colors">
              <div
                {...getRootProps()}
                className={`p-16 text-center cursor-pointer transition-colors ${
                  isDragActive ? "bg-gray-900/50" : ""
                }`}
              >
                <input {...getInputProps()} />

                <div className="flex flex-col items-center space-y-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8 text-black" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xl font-medium text-[#511D43] dark:text-white">
                      {isDragActive
                        ? "Drop the audio files here..."
                        : "Drag and drop audio files to get started."}
                    </p>
                  </div>

                  <Button
                    onClick={open}
                    variant="secondary"
                    size="lg"
                    className="bg-black text-white hover:bg-gray-600 font-medium px-8 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                  >
                    Choose files
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
