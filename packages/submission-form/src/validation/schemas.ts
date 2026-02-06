import { z } from "zod";

/**
 * ICTIRC Shared Submission Form - Validation Schemas
 * Used by both apps/web and apps/author
 */

// Helper function to count words in a string
const countWords = (text: string): number => {
  return text.trim().split(/\s+/).filter(Boolean).length;
};

// ============================================
// AUTHOR SCHEMA
// ============================================

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

export type AuthorFormData = z.infer<typeof authorSchema>;

// ============================================
// PAPER DETAILS SCHEMA
// ============================================

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
  
  categoryId: z
    .string()
    .min(1, "Please select a category"),
});

export type PaperDetailsFormData = z.infer<typeof paperDetailsSchema>;

// ============================================
// AUTHORS STEP SCHEMA
// ============================================

export const authorsStepSchema = z.object({
  authors: z
    .array(authorSchema)
    .min(1, "At least one author is required")
    .max(10, "Maximum 10 authors allowed"),
});

export type AuthorsStepFormData = z.infer<typeof authorsStepSchema>;

// ============================================
// FILE UPLOAD SCHEMA
// ============================================

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

// ============================================
// FULL SUBMISSION SCHEMA
// ============================================

export const fullSubmissionSchema = paperDetailsSchema
  .merge(authorsStepSchema)
  .merge(uploadSchema);

export type FullSubmissionFormData = z.infer<typeof fullSubmissionSchema>;
