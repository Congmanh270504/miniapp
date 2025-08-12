"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Music4, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Stepper, {
  Step,
} from "../ui/react-bits/react-bit-component/Stepper/Stepper";
import Link from "next/link";

export function StepperWrapper() {
  return (
    <div
      className="w-full h-full relative z-[100] mt-8 md:mt-[15em] px-4 pb-8 "
      style={{ position: "relative", zIndex: 100 }}
    >
      <Stepper initialStep={1} backButtonText="Previous" nextButtonText="Next">
        {/* Step 1: Sign In */}
        <Step>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 justify-items-center">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  1
                </div>
                <h2 className="text-3xl xl:text-4xl font-bold text-black dark:text-white">
                  Sign In with Clerk
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 text-base xl:text-lg dark:text-muted-foreground">
                    Create an account or sign in to your existing account
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 text-base xl:text-lg dark:text-muted-foreground">
                    Choose from multiple authentication methods
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 text-base xl:text-lg dark:text-muted-foreground">
                    Secure and fast authentication process
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 text-base xl:text-lg dark:text-muted-foreground">
                    Access all features after signing in
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-full max-w-md h-full bg-white rounded-lg shadow-lg p-8 border border-gray-200">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Welcome back
                  </h3>
                  <p className="text-gray-600 dark:text-muted-foreground">
                    Sign in to your account
                  </p>
                </div>

                <div className="space-y-4">
                  <Button className="w-full bg-[#332D56] text-white hover:bg-gray-800">
                    Continue with Google
                  </Button>
                  <Button className="w-full bg-[#320A6B] text-white hover:bg-blue-700">
                    Continue with GitHub
                  </Button>
                  <Button className="w-full bg-[#113F67] text-white hover:bg-blue-700">
                    Continue with Facebook
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-white px-4 text-gray-500">or</span>
                    </div>
                  </div>

                  <Input placeholder="Email address" className="w-full" />
                  <Input
                    type="password"
                    placeholder="Password"
                    className="w-full"
                  />
                  <Button className="w-full bg-purple-600 text-white hover:bg-purple-700">
                    Sign in
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Step>

        {/* Step 2: Upload Audio File */}
        <Step>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 justify-items-center">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  2
                </div>
                <h2 className="text-3xl xl:text-4xl font-bold text-black dark:text-white">
                  Upload Audio File
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 text-base xl:text-lg dark:text-muted-foreground">
                    Navigate to{" "}
                    <Link href="/songs/create">
                      <span className="bg-purple-100 px-2 py-1 rounded text-purple-700 font-mono hover:underline">
                        /songs/create
                      </span>
                    </Link>
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 text-base xl:text-lg dark:text-muted-foreground">
                    Drag and drop your audio file into the drop zone
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 text-base xl:text-lg dark:text-muted-foreground">
                    Supported formats: WAV, FLAC, AIFF, ALAC, MP3
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 text-base xl:text-lg dark:text-muted-foreground">
                    Maximum file size: 4.5MB uncompressed
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 text-base xl:text-lg dark:text-muted-foreground">
                    Click "Choose files" for manual selection
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <div className="mb-8">
                  <h1 className="text-4xl font-bold mb-4">
                    Upload your audio files.
                  </h1>
                  <p className="text-[#333446] text-lg dark:text-muted-foreground">
                    For best quality, use WAV, FLAC, AIFF, or ALAC. The maximum
                    file size is 4.5MB uncompressed.{" "}
                    <span className="text-blue-400 hover:text-blue-300 cursor-pointer">
                      Learn more.
                    </span>
                  </p>
                </div>

                <Card className="bg-transparent border-2 border-dashed border-gray-600 hover:border-gray-500 transition-colors">
                  <div className="p-16 text-center cursor-pointer transition-colors hover:bg-gray-900/5">
                    <div className="flex flex-col items-center space-y-6">
                      <div className="relative">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <Upload className="w-8 h-8 text-black" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xl font-medium text-[#511D43] dark:text-muted-foreground">
                          Drag and drop audio files to get started.
                        </p>
                      </div>

                      <Button
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
            </div>
          </div>
        </Step>

        {/* Step 3: Upload Image */}
        <Step>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 justify-items-center">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  3
                </div>
                <h2 className="text-3xl xl:text-4xl font-bold text-black dark:text-white">
                  Upload Cover Image
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 text-base xl:text-lg dark:text-muted-foreground">
                    Upload a cover image for your song
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 text-base xl:text-lg dark:text-muted-foreground">
                    Supported formats: JPEG, PNG, JPG
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 text-base xl:text-lg dark:text-muted-foreground">
                    Recommended size: 1400x1400 pixels
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 text-base xl:text-lg dark:text-muted-foreground">
                    Maximum file size: 4.5MB
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 text-base xl:text-lg dark:text-muted-foreground">
                    Square images work best
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <div className="mb-8">
                  <h1 className="text-4xl font-bold mb-4">
                    Upload cover image.
                  </h1>
                  <p className="text-[#333446] text-lg dark:text-muted-foreground">
                    Add a visual representation of your song. Square images work
                    best.{" "}
                    <span className="text-blue-400 hover:text-blue-300 cursor-pointer">
                      Learn more.
                    </span>
                  </p>
                </div>

                <Card className="bg-transparent border-2 border-dashed border-gray-600 hover:border-gray-500 transition-colors">
                  <div className="p-16 text-center cursor-pointer transition-colors hover:bg-gray-900/5">
                    <div className="flex flex-col items-center space-y-6">
                      <div className="relative">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <Upload className="w-8 h-8 text-black" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xl font-medium text-[#511D43] dark:text-muted-foreground">
                          Drag and drop image files here.
                        </p>
                      </div>

                      <Button
                        variant="secondary"
                        size="lg"
                        className="bg-white text-black hover:bg-gray-200 font-medium px-8"
                      >
                        Choose image
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </Step>

        {/* Step 4: Fill Form */}
        <Step>
          <div className="space-y-6">
            <div className="w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left side - Descriptions */}

                <div className="space-y-6 w-2/3 justify-self-center">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      4
                    </div>
                    <h2 className="text-3xl xl:text-4xl font-bold text-black dark:text-white">
                      Fill Song Details
                    </h2>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xl xl:text-2xl font-semibold text-gray-800 mb-4 dark:text-white">
                      Form Field Guide
                    </h3>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-gray-700 text-base xl:text-lg dark:text-muted-foreground">
                            Fill all required fields
                          </p>
                          <p className="text-sm xl:text-base text-gray-600 dark:text-muted-foreground">
                            Ensure all required fields are completed before
                            submitting
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-gray-700 text-base xl:text-lg dark:text-muted-foreground">
                            Submit form
                          </p>
                          <p className="text-sm xl:text-base text-gray-600 dark:text-muted-foreground">
                            Make sure none filed is null and have error messages
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-gray-700 text-base xl:text-lg dark:text-muted-foreground">
                            Handle error
                          </p>
                          <p className="text-sm xl:text-base text-gray-600 dark:text-muted-foreground">
                            After submitting, if successful, you will be
                            redirected to the song details page. If there are
                            errors, they will be displayed at the right bottom
                            of the page.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Right side - Additional fields */}

                <div className="grid grid-cols-2 gap-4 ">
                  <div className="space-y-6 ">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-white">
                          Song Title
                        </label>
                        <div className="relative">
                          <Input placeholder="What is love" className="pl-10" />
                          <Music4 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-white">
                          Artist Name
                        </label>
                        <Input placeholder="TWICE" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-white">
                          Genre
                        </label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose genre" />
                          </SelectTrigger>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 flex flex-col justify-between h-full">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-white">
                          Slug
                        </label>
                        <Input placeholder="what-is-love" />
                        <p className="text-sm text-gray-500 mt-1 dark:text-muted-foreground">
                          This will be used in the URL for your song
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-white">
                          Description
                        </label>
                        <Textarea
                          placeholder="Tell us about your song..."
                          className="resize-none"
                          rows={4}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" className="w-full">
                        Cancel
                      </Button>
                      <Button className="w-full bg-purple-600 hover:bg-purple-700 dark:text-white">
                        Submit
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Step>
      </Stepper>
    </div>
  );
}
