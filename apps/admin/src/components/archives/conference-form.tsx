"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
  FileUpload,
} from "@ictirc/ui";
import { Plus, X } from "lucide-react";
import { conferenceSchema } from "@/lib/validations/archive";
import { createConference, updateConference } from "@/lib/actions/conference";
import { toast } from "@/lib/toast";
import { useUpload } from "@/hooks/use-upload";

const formSchema = conferenceSchema.extend({
  logoUrl: z.string().url().optional().or(z.literal("")),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  startDate: z.union([
    z.date(),
    z.string().transform((str) => new Date(str))
  ]),
  endDate: z.union([
    z.date(),
    z.string().transform((str) => new Date(str))
  ]).optional().or(z.literal("")),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

type FormData = z.infer<typeof formSchema>;

interface ConferenceFormProps {
  conference?: {
    id: string;
    name: string;
    fullName?: string | null;
    description?: string | null;
    startDate: Date;
    endDate?: Date | null;
    location?: string | null;
    venue?: string | null;
    theme?: string | null;
    organizers: string[];
    partners: string[];
    logoUrl?: string | null;
    imageUrl?: string | null;
    websiteUrl?: string | null;
  };
}

export function ConferenceForm({ conference }: ConferenceFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bannerUpload = useUpload({ folder: "conferences/banners" });
  const logoUpload = useUpload({ folder: "conferences/logos" });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: conference?.name || "",
      fullName: conference?.fullName || "",
      description: conference?.description || "",
      startDate: (conference?.startDate ? new Date(conference.startDate) : new Date()).toISOString().split('T')[0] as any,
      endDate: (conference?.endDate ? new Date(conference.endDate).toISOString().split('T')[0] : "") as any,
      location: conference?.location || "",
      venue: conference?.venue || "",
      theme: conference?.theme || "",
      organizers: conference?.organizers || [],
      partners: conference?.partners || [],
      logoUrl: conference?.logoUrl || "",
      imageUrl: conference?.imageUrl || "",
      websiteUrl: conference?.websiteUrl || "",
    },
  });

  const { fields: organizerFields, append: appendOrganizer, remove: removeOrganizer } = useFieldArray({
    control: form.control as any,
    name: "organizers",
  });

  const { fields: partnerFields, append: appendPartner, remove: removePartner } = useFieldArray({
    control: form.control as any,
    name: "partners",
  });

  async function onSubmit(data: FormData) {
    setIsSubmitting(true);

    try {
      const submitData = {
        ...data,
        fullName: data.fullName || undefined,
        description: data.description || undefined,
        endDate: data.endDate || undefined,
        location: data.location || undefined,
        venue: data.venue || undefined,
        theme: data.theme || undefined,
        logoUrl: data.logoUrl || undefined,
        imageUrl: data.imageUrl || undefined,
        websiteUrl: data.websiteUrl || undefined,
      };

      const result = conference
        ? await updateConference(conference.id, submitData)
        : await createConference(submitData);

      if (result.success) {
        toast({
          title: conference ? "Conference updated" : "Conference created",
          description: `${data.name} has been ${conference ? "updated" : "created"} successfully.`,
        });
        router.push("/dashboard/archives/conferences");
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input placeholder="1st ICTIRC" {...field} value={field.value as string} />
                </FormControl>
                <FormDescription>
                  Short name (e.g., 1st ICTIRC)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value as string | undefined} />
                </FormControl>
                <FormDescription>
                  Conference start date
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value as string | undefined} />
                </FormControl>
                <FormDescription>
                  Conference end date (optional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Barotac Nuevo, Philippines" {...field} value={field.value as string | undefined} />
                </FormControl>
                <FormDescription>
                  City, Country
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief description of the conference..."
                  {...field}
                  value={field.value as string | undefined}
                />
              </FormControl>
              <FormDescription>
                Optional description
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="1st ICT International Research Colloquium"
                  {...field}
                  value={field.value as string | undefined}
                />
              </FormControl>
              <FormDescription>
                Complete official name of the conference
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conference Banner</FormLabel>
              <FormControl>
                <FileUpload
                  value={field.value as string || ""}
                  onFileSelect={async (file) => {
                    const url = await bannerUpload.uploadFile(file);
                    if (url) field.onChange(url);
                  }}
                  onRemove={() => field.onChange("")}
                  isUploading={bannerUpload.isUploading}
                  progress={bannerUpload.progress}
                  variant="image"
                  description="Upload a high-resolution banner or poster (event-images bucket)"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Barotac Nuevo, Philippines" {...field} value={field.value as string | undefined} />
                </FormControl>
                <FormDescription>
                  City, Country
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="venue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Venue</FormLabel>
                <FormControl>
                  <Input
                    placeholder="CICT Techno Hub, ISUFST Main Campus"
                    {...field}
                    value={field.value as string | undefined}
                  />
                </FormControl>
                <FormDescription>
                  Specific venue details
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Theme</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Resilience and Adaptation: Research for a More Equitable and Secure World"
                  {...field}
                  value={field.value as string | undefined}
                />
              </FormControl>
              <FormDescription>
                Conference theme or tagline
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>Organizers</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendOrganizer("")}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Organizer
            </Button>
          </div>
          {organizerFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input
                {...form.register(`organizers.${index}` as const)}
                placeholder="Organization name"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeOrganizer(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>Partners</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendPartner("")}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Partner
            </Button>
          </div>
          {partnerFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input
                {...form.register(`partners.${index}` as const)}
                placeholder="Partner organization"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removePartner(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="logoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Conference Logo (Optional)</FormLabel>
                <FormControl>
                  <FileUpload
                    value={field.value as string || ""}
                    onFileSelect={async (file) => {
                      const url = await logoUpload.uploadFile(file);
                      if (url) field.onChange(url);
                    }}
                    onRemove={() => field.onChange("")}
                    isUploading={logoUpload.isUploading}
                    progress={logoUpload.progress}
                    variant="image"
                    description="Upload the official conference or organizer logo"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="websiteUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website URL (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://conference.example.com"
                    {...field}
                    value={field.value as string | undefined}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : conference ? "Update Conference" : "Create Conference"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
