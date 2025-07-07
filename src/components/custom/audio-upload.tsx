"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileAudio, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { parseBlob } from "music-metadata-browser";
import SongForm from "@/app/songs/create/songs-form";

export default function AudioUpload() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [artist, setArtist] = useState("");
  const [duration, setDuration] = useState<number>(0);
  const [error, setError] = useState("");
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploadedFiles(acceptedFiles);
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      try {
        const metadata = await parseBlob(file);
        setArtist(metadata.common.artist || "");
        // Đọc duration từ metadata
        const durationInSeconds = metadata.format.duration || 0;
        setDuration(Math.floor(durationInSeconds));
      } catch (err) {
        setError("Không đọc được metadata");
      }
    }
  }, []);

  const removeFile = useCallback((indexToRemove: number) => {
    setUploadedFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  }, []);
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      "audio/*": [".mp3", ".mp4"],
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
        {uploadedFiles.length > 0 && (
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Uploaded Files:</h1>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-600 rounded-lg group transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <FileAudio className="w-5 h-5 text-blue-400" />
                    <span className="text-white">{file.name}</span>
                    <span className="text-gray-400 text-sm">
                      ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                  </div>
                  <Button
                    onClick={() => removeFile(index)}
                    variant="ghost"
                    size="sm"
                    className=" transition-opacity duration-200 hover:bg-red-600 text-white p-1 h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        {uploadedFiles.length > 0 ? (
          <div className="border-2 border-solid rounded-lg border-white p-4">
            <SongForm
              uploadedFiles={uploadedFiles}
              artist={artist}
              duration={duration}
            />
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4">
                Upload your audio files.
              </h1>
              <p className="text-[#333446] text-lg">
                For best quality, use WAV, FLAC, AIFF, or ALAC. The maximum file
                size is 4GB uncompressed.{"  "}
                <span className="text-blue-400 hover:text-blue-300 cursor-pointer">
                  Learn more.
                </span>
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
                    <p className="text-xl font-medium text-[#511D43]">
                      {isDragActive
                        ? "Drop the audio files here..."
                        : "Drag and drop audio files to get started."}
                    </p>
                  </div>

                  <Button
                    onClick={open}
                    variant="secondary"
                    size="lg"
                    className="bg-white text-black hover:bg-gray-200 font-medium px-8"
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
