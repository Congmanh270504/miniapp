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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { createGenre, updateGenre } from "@/lib/actions/genre";
import { toast } from "sonner";

export default function GenreForm({
  onSuccess,
  initialData,
}: {
  onSuccess?: () => void;
  initialData?: {
    id: string;
    name: string;
    description?: string;
  };
}) {
  const formSchema = z.object({
    name: z
      .string()
      .min(1, { message: "Genre name is required" })
      .min(2, { message: "Must be at least 2 characters" })
      .max(50, { message: "Must be at most 50 characters" })
      .refine((val) => !val.includes("."), { message: 'Must not contain "."' }),
    description: z
      .string()
      .max(500, { message: "Must be at most 500 characters" })
      .optional(),
  });

  const [isPending, setIsPending] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsPending(true);
    try {
      const request = initialData
        ? await updateGenre(initialData.id, values)
        : await createGenre(values);

      if (request.ok) {
        toast.success(request.message);
        // Reset form after successful submission
        form.reset();
        // Call success callback to close dialog
        onSuccess?.();
      } else {
        toast.error(request.message);
      }
    } catch (error) {
      console.error("Error saving genre:", error);
      toast.error("Failed to save genre");
    } finally {
      setIsPending(false);
    }
  }

  function onReset() {
    form.reset();
    form.clearErrors();
  }

  return (
    <div className="p-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Genre Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., K-Pop, Rock, Jazz..." {...field} />
                </FormControl>
                <FormDescription>The name of the music genre</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe this genre..."
                    className="resize-none"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  A brief description of the genre (max 500 characters)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onReset}
              className="flex-1"
              disabled={isPending}
            >
              Reset
            </Button>
            <Button type="submit" className="flex-1" disabled={isPending}>
              {isPending ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  {initialData ? "Updating..." : "Creating..."}
                </div>
              ) : initialData ? (
                "Update Genre"
              ) : (
                "Create Genre"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
