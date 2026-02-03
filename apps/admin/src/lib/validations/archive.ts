import { z } from "zod";

// ============================================
// VOLUME SCHEMAS
// ============================================

export const volumeSchema = z.object({
  volumeNumber: z.number().int().positive(),
  year: z.number().int().min(2020).max(2100),
  description: z.string().optional(),
  coverImageUrl: z.string().url().optional().or(z.literal("")),
});

export const createVolumeSchema = volumeSchema;
export const updateVolumeSchema = volumeSchema.partial();

export type VolumeInput = z.infer<typeof volumeSchema>;
export type UpdateVolumeInput = z.infer<typeof updateVolumeSchema>;

// ============================================
// ISSUE SCHEMAS
// ============================================

export const issueSchema = z.object({
  issueNumber: z.number().int().positive(),
  month: z.string().optional(),
  publishedDate: z.date().or(z.string().transform((str) => new Date(str))),
  issn: z.string().regex(/^\d{4}-\d{4}$/).optional().or(z.literal("")),
  theme: z.string().optional(),
  description: z.string().optional(),
  coverImageUrl: z.string().url().optional().or(z.literal("")),
  volumeId: z.string().cuid(),
  conferenceId: z.string().cuid().optional().or(z.literal("")),
});

export const createIssueSchema = issueSchema;
export const updateIssueSchema = issueSchema.partial().extend({
  volumeId: z.string().cuid().optional(),
});

export type IssueInput = z.infer<typeof issueSchema>;
export type UpdateIssueInput = z.infer<typeof updateIssueSchema>;

// ============================================
// CONFERENCE SCHEMAS
// ============================================

export const conferenceSchema = z.object({
  name: z.string().min(1),
  fullName: z.string().optional(),
  description: z.string().optional(),
  startDate: z.date().or(z.string().transform((str) => new Date(str))),
  endDate: z.date().or(z.string().transform((str) => new Date(str))).optional().or(z.literal("")),
  location: z.string().optional(),
  venue: z.string().optional(),
  theme: z.string().optional(),
  organizers: z.array(z.string()).default([]),
  partners: z.array(z.string()).default([]),
  logoUrl: z.string().url().optional().or(z.literal("")),
  imageUrl: z.string().url().optional().or(z.literal("")),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  isPublished: z.boolean().default(true),
});

export const createConferenceSchema = conferenceSchema;
export const updateConferenceSchema = conferenceSchema.partial();

export type ConferenceInput = z.infer<typeof conferenceSchema>;
export type UpdateConferenceInput = z.infer<typeof updateConferenceSchema>;

// ============================================
// ARCHIVED PAPER AUTHOR SCHEMAS
// ============================================

export const archivedPaperAuthorSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  affiliation: z.string().optional(),
  order: z.number().int().nonnegative().default(0),
  isCorresponding: z.boolean().default(false),
});

export type ArchivedPaperAuthorInput = z.infer<typeof archivedPaperAuthorSchema>;

// ============================================
// ARCHIVED PAPER SCHEMAS
// ============================================

export const archivedPaperSchema = z.object({
  title: z.string().min(1),
  abstract: z.string().min(1),
  keywords: z.array(z.string()).default([]),
  doi: z.string().optional(),
  pdfUrl: z.string().url(),
  docxUrl: z.string().url().optional().or(z.literal("")),
  pageStart: z.number().int().positive().optional(),
  pageEnd: z.number().int().positive().optional(),
  publishedDate: z.date().or(z.string().transform((str) => new Date(str))),
  submittedDate: z.date().or(z.string().transform((str) => new Date(str))).optional(),
  acceptedDate: z.date().or(z.string().transform((str) => new Date(str))).optional(),
  categoryId: z.string().cuid(),
  issueId: z.string().cuid(),
  authors: z.array(archivedPaperAuthorSchema).min(1),
});

export const createArchivedPaperSchema = archivedPaperSchema;
export const updateArchivedPaperSchema = archivedPaperSchema.partial().extend({
  categoryId: z.string().cuid().optional(),
  issueId: z.string().cuid().optional(),
});

export type ArchivedPaperInput = z.infer<typeof archivedPaperSchema>;
export type UpdateArchivedPaperInput = z.infer<typeof updateArchivedPaperSchema>;

// ============================================
// BATCH UPLOAD SCHEMAS
// ============================================

export const batchUploadPaperSchema = archivedPaperSchema.omit({
  pdfUrl: true,
  docxUrl: true,
}).extend({
  pdfFileName: z.string(),
  docxFileName: z.string().optional(),
});

export const batchUploadSchema = z.object({
  issueId: z.string().cuid(),
  papers: z.array(batchUploadPaperSchema).min(1),
});

export type BatchUploadPaperInput = z.infer<typeof batchUploadPaperSchema>;
export type BatchUploadInput = z.infer<typeof batchUploadSchema>;

// ============================================
// CSV ROW SCHEMA
// ============================================

export const csvRowSchema = z.object({
  title: z.string(),
  abstract: z.string(),
  keywords: z.string(), // Semicolon-separated
  category: z.string(),
  page_start: z.string().optional(),
  page_end: z.string().optional(),
  pdf_filename: z.string(),
  docx_filename: z.string().optional(),
  author_1_name: z.string(),
  author_1_email: z.string().optional(),
  author_1_affiliation: z.string().optional(),
  author_2_name: z.string().optional(),
  author_2_email: z.string().optional(),
  author_2_affiliation: z.string().optional(),
  author_3_name: z.string().optional(),
  author_3_email: z.string().optional(),
  author_3_affiliation: z.string().optional(),
  author_4_name: z.string().optional(),
  author_4_email: z.string().optional(),
  author_4_affiliation: z.string().optional(),
  author_5_name: z.string().optional(),
  author_5_email: z.string().optional(),
  author_5_affiliation: z.string().optional(),
  submitted_date: z.string().optional(),
  accepted_date: z.string().optional(),
});

export type CSVRowInput = z.infer<typeof csvRowSchema>;
