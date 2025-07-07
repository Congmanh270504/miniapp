"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchGenres } from "@/store/genres/state";
import { useUser } from "@clerk/nextjs";
import { updateSong } from "@/lib/actions/songs";
import { toSlug } from "@/lib/hepper";
import UploadImageSong from "./upload-image-song-edit";
import { TypographyH2 } from "@/components/ui/typography";

interface EditSongFormProps {
  song: {
    id: string;
    title: string;
    slug: string;
    artist: string;
    description: string;
    genreId: string;
    fileCid: string;
    imageId: string;
    Image: {
      id: string;
      cid: string;
    };
  };
}

export default function EditSongForm({ song }: EditSongFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const genres = useSelector((state: RootState) => state.genreSlice);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchGenres());
  }, [dispatch]);

  const formSchema = z.object({
    title: z
      .string()
      .min(1, { message: "This field is required" })
      .min(1, { message: "Must be at least 1 characters" })
      .max(60, { message: "Must be at most 60 characters" }),
    slug: z
      .string()
      .min(1, { message: "This field is required" })
      .regex(/^[a-z0-9-]+$/, {
        message:
          "Slug must contain only lowercase letters, numbers, and hyphens",
      }),
    artistName: z
      .string()
      .min(1, { message: "This field is required" })
      .min(1, { message: "Must be at least 1 characters" })
      .max(30, { message: "Must be at most 30 characters" }),
    description: z
      .string()
      .min(1, { message: "Must be at least 1 characters" })
      .max(60, { message: "Must be at most 60 characters" })
      .optional()
      .or(z.literal("")),
    genreId: z.string().min(1, { message: "Please select a genre song" }),
    songsImages: z.instanceof(File).optional(),
  });

  const [isPending, setIsPending] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: song.title,
      slug: song.slug,
      artistName: song.artist,
      description: song.description,
      genreId: song.genreId,
      songsImages: undefined,
    },
  });

  // Auto-generate slug when title changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "title" && value.title) {
        form.setValue("slug", toSlug(value.title));
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    console.log("Current song image:", form.getValues());
  }, [form]);

  const handleFileUpload = async (file: File) => {
    try {
      const data = new FormData();
      data.set("images", file);

      const uploadFile = await fetch("/api/uploadFiles/edit", {
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
      if (user?.id) {
        let imagesCid = song.Image.cid;

        // If new image is uploaded, upload it
        if (values.songsImages) {
          const fileUpload = await handleFileUpload(values.songsImages);
          if (!fileUpload.imagesCid) {
            setIsPending(false);
            toast.error(fileUpload?.message || "Failed to upload image");
            return;
          }
          imagesCid = fileUpload.imagesCid;
          //   if (fileUpload?.imagesCid) {
          //   }
        }

        const req = await updateSong(
          song.id,
          {
            title: values.title,
            slug: values.slug,
            artistName: values.artistName,
            description: values.description,
            genreId: values.genreId,
          },
          imagesCid
        );

        if (req.ok) {
          toast.success(req.message || "Song updated successfully");
          router.push(`/songs/${values.slug}`);
        } else {
          toast.error(req.message || "Failed to update song");
        }
      }
      setIsPending(false);
    } catch (error) {
      setIsPending(false);
      toast.error("Failed to update song");
    }
  }

  function onReset() {
    form.reset();
    form.clearErrors();
  }

  return (
    <TooltipProvider>
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
                    <UploadImageSong
                      field={field}
                      isPending={isPending}
                      currentImageCid={song.Image.cid}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-12 gap-4 text-black">
              <div className="col-span-12 col-start-auto justify-self-center">
                <TypographyH2 text="Edit song information" />
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
                        <Input
                          placeholder="What is love"
                          type="text"
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                    <div className="flex gap-1.5 w-full">
                      <FormLabel className="flex shrink-0 text-black">
                        Slug
                      </FormLabel>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 text-gray-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>URL-friendly version of the title</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="w-full">
                      <FormControl>
                        <Input
                          placeholder="what-is-love"
                          type="text"
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-sm text-gray-600 mt-1 ml-1">
                        This will be used in the URL for your song
                      </FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="artistName"
                render={({ field }) => (
                  <FormItem className="col-span-6 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                    <FormLabel className="flex shrink-0 text-black">
                      Artist
                    </FormLabel>
                    <div className="w-full">
                      <FormControl>
                        <Input
                          placeholder="Artist name"
                          type="text"
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="genreId"
                render={({ field }) => (
                  <FormItem className="col-span-6 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                    <div className="flex gap-1.5 w-full">
                      <FormLabel className="flex shrink-0 text-black">
                        Genre
                      </FormLabel>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 text-gray-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Select the genre that best fits your song</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="w-full">
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isPending}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a genre" />
                          </SelectTrigger>
                          <SelectContent className="w-full">
                            {genres.map((genre: any) => (
                              <SelectItem key={genre.id} value={genre.id}>
                                {genre.name}
                              </SelectItem>
                            ))}
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
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                    <div className="flex gap-1.5 w-full">
                      <FormLabel className="flex shrink-0 text-black">
                        Description
                      </FormLabel>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 text-gray-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Brief description of your song</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="w-full">
                      <FormControl>
                        <Textarea
                          placeholder="Description for this song"
                          className="resize-none"
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <div className="col-span-6 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <div className="w-full">
                  <Button
                    className="w-full"
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
              <div className="col-span-6 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <div className="w-full">
                  <Button
                    className="w-full bg-gray-600 hover:bg-gray-500"
                    type="submit"
                    variant="default"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <div className="flex items-center gap-2">
                        Updating{" "}
                        <span className="loading loading-dots loading-sm"></span>
                      </div>
                    ) : (
                      "Update Song"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </TooltipProvider>
  );
}
