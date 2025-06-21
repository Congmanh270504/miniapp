"use client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Music4 } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import UploadImageSong from "./upload-image-song";
import { toast } from "sonner";
import { useState } from "react";

interface SongDetailsProps {
  uploadedFiles: File[];
  artist: string;
}

export default function SongDetails({
  uploadedFiles,
  artist,
}: SongDetailsProps) {
  const formSchema = z.object({
    title: z
      .string()
      .min(1, { message: "This field is required" })
      .min(1, { message: "Must be at least 1 characters" })
      .max(60, { message: "Must be at most 60 characters" }),
    artistName: z
      .string()
      .min(1, { message: "This field is required" })
      .min(1, { message: "Must be at least 1 characters" })
      .max(30, { message: "Must be at most 30 characters" }),
    trackLink: z
      .string()
      .min(1, { message: "This field is required" })
      .includes("http://localhost:3000/songs", {
        message: 'Must contain "http://localhost:3000/songs"',
      }),
    genre: z.string(),
    album: z.string(),
    songsImages: z.instanceof(File),
  });
  const [isPending, setIsPending] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: uploadedFiles[0].name.replace(/\.[^/.]+$/, ""),
      artistName: artist,
      trackLink: "http://localhost:3000/songs/",
      genre: "",
      album: "",
      songsImages: undefined,
    },
  });
  const handleFileUpload = async (file: File) => {
    try {
      const data = new FormData();
      data.set("songs", file);
      data.set("images", form.getValues("songsImages"));

      const uploadFile = await fetch("/api/uploadFiles", {
        method: "POST",
        body: data,
      });
      const response = await uploadFile.json();
      return response;
    } catch (error) {
      toast.error("Error uploading file");
    }
  };
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsPending(true);
      const cid = await handleFileUpload(uploadedFiles[0]);
      if (cid.status !== 200) {
        toast.success("Song uploaded successfully");
      } else {
        toast.error("Failed to upload song");
      }
      console.log(values, cid);
      setIsPending(false);
    } catch (error) {
      setIsPending(false);
      toast.error("Failed to upload song");
    }

    // console.log(values);
  }

  function onReset() {
    form.reset();
    form.clearErrors();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onReset={onReset}
        className="space-y-8 @container"
      >
        <div className="grid grid-cols-2 w-full gap-4 max-sm:grid-cols-1">
          <FormField
            control={form.control}
            name="songsImages"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  {/* <UploadFile
                    field={field} // Pass the field object to the UploadFile component
                    randomColor={randomColor}
                    isLoadingFile={isLoadingFile}
                    setIsLoadingFile={setIsLoadingFile}
                    setFiles={setFiles}
                    files={files}
                  /> */}
                  <UploadImageSong field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-12 gap-4 text-black">
            <div
              key="text-0"
              id="text-0"
              className=" col-span-12 col-start-auto"
            >
              <h1
                style={{ textAlign: "center" }}
                className="scroll-m-20 text-4xl font-extrabold tracking-tight @5xl:text-5xl"
              >
                <span className="text-sm font-medium leading-none">
                  Upload song file
                </span>
              </h1>
            </div>

            <div
              key="text-1"
              id="text-1"
              className=" col-span-12 col-start-auto"
            >
              Text
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                  <FormLabel className="flex shrink-0 text-black">
                    Song title
                  </FormLabel>
                  <div className="w-full">
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          key="text-input-0"
                          placeholder="What is love"
                          type="text"
                          className="ps-9"
                          {...field}
                        />
                        <div
                          className={
                            "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center  peer-disabled:opacity-50 start-0 ps-3"
                          }
                        >
                          <Music4 className="size-4" strokeWidth={2} />
                        </div>
                      </div>
                    </FormControl>

                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="artistName"
              render={({ field }) => (
                <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                  <FormLabel className="flex shrink-0">Artist</FormLabel>

                  <div className="w-full">
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          key="text-input-1"
                          placeholder="TWICE"
                          type="text"
                          className=" "
                          {...field}
                        />
                      </div>
                    </FormControl>

                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="trackLink"
              render={({ field }) => (
                <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                  <FormLabel className="flex shrink-0">Track link</FormLabel>

                  <div className="w-full">
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          key="text-input-2"
                          placeholder="http://localhost:3000/songs"
                          type="text"
                          className=" "
                          {...field}
                        />
                      </div>
                    </FormControl>

                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="genre"
              render={({ field }) => (
                <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                  <FormLabel className="flex shrink-0">Genre</FormLabel>
                  <div className="w-full">
                    <FormControl>
                      <Select
                        key="select-1"
                        {...field}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full ">
                          <SelectValue placeholder="" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem key="option1" value="option1">
                            Option 1
                          </SelectItem>

                          <SelectItem key="option2" value="option2">
                            Don't know
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>

                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="album"
              render={({ field }) => (
                <FormItem className="col-span-12 @5xl:col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                  <FormLabel className="flex shrink-0">Album</FormLabel>

                  <div className="w-full">
                    <FormControl>
                      <Select
                        key="select-0"
                        {...field}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full ">
                          <SelectValue placeholder="" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem key="option1" value="option1">
                            Option 1
                          </SelectItem>

                          <SelectItem key="option2" value="option2">
                            Don't know
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>

                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <div className="col-span-6 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
              <div className="w-full">
                <Button
                  key="button-0"
                  id="button-0"
                  className="w-full"
                  type="button"
                  variant="outline"
                  onClick={onReset}
                >
                  Cancel
                </Button>
              </div>
            </div>
            <div className="col-span-6 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
              <div className="w-full">
                <Button
                  key="submit-button-0"
                  id="submit-button-0"
                  className="w-full bg-gray-600 hover:bg-gray-500"
                  type="submit"
                  variant="default"
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
