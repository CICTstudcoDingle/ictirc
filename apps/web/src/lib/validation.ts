import { z } from "zod";

/**
 * CICT Research Repository - Form Validation Schemas
 * Provides type-safe validation for the multi-step submission form
 */

// Helper function to count words in a string
const countWords = (text: string): number => {
  return text.trim().split(/\s+/).filter(Boolean).length;
};

/**
 * Step 1: Paper Details Validation
 */
export const paperDetailsSchema = z.object({
  title: z
    .string()
    .min(10, "Title must be at least 10 characters")
    .max(300, "Title must not exceed 300 characters"),
  
  abstract: z
    .string()
    .min(1, "Abstract is required")
    .refine(
      (text) => {
        const wordCount = countWords(text);
        return wordCount >= 250 && wordCount <= 500;
      },
      { message: "Abstract must be between 250-500 words" }
    ),
  
  keywords: z
    .string()
    .min(1, "Keywords are required")
    .refine(
      (keywords) => {
        const count = keywords.split(",").filter((k) => k.trim().length > 0).length;
        return count >= 3;
      },
      { message: "Please provide at least 3 keywords (comma-separated)" }
    ),
  
  category: z
    .string()
    .min(1, "Please select a category"),
});

export type PaperDetailsFormData = z.infer<typeof paperDetailsSchema>;

/**
 * Step 2: Authors Validation
 */
export const authorSchema = z.object({
  name: z
    .string()
    .min(2, "Author name is required")
    .max(100, "Name must not exceed 100 characters"),
  
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  
  affiliation: z
    .string()
    .min(2, "Affiliation is required")
    .max(200, "Affiliation must not exceed 200 characters"),
});

export const authorsStepSchema = z.object({
  authors: z
    .array(authorSchema)
    .min(1, "At least one author is required")
    .max(10, "Maximum 10 authors allowed"),
});

export type AuthorFormData = z.infer<typeof authorSchema>;
export type AuthorsStepFormData = z.infer<typeof authorsStepSchema>;

/**
 * Step 3: Upload Validation
 */
export const uploadSchema = z.object({
  file: z
    .custom<File>()
    .refine((file) => file !== null && file !== undefined, {
      message: "Please upload a manuscript file",
    })
    .refine((file) => {
      if (!file) return false;
      const validTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
      ];
      return validTypes.includes(file.type);
    }, {
      message: "Only PDF and DOCX files are accepted",
    })
    .refine((file) => {
      if (!file) return false;
      const maxSize = 50 * 1024 * 1024; // 50MB in bytes
      return file.size <= maxSize;
    }, {
      message: "File size must be less than 50MB",
    }),
});

export type UploadFormData = z.infer<typeof uploadSchema>;

/**
 * Complete Form Validation
 */
export const completeSubmissionSchema = paperDetailsSchema
  .merge(authorsStepSchema)
  .merge(uploadSchema);

export type CompleteSubmissionFormData = z.infer<typeof completeSubmissionSchema>;
