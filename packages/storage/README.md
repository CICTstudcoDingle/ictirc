# @ictirc/storage

Storage management package for the ICTIRC Research Repository.

## Architecture

This package implements a **dual-storage strategy**:

- **Hot Storage**: Supabase Storage for active manuscripts and fast access
- **Cold Storage**: Cloudflare R2 for backups and long-term archival

## Features

- ✅ Supabase Storage integration for hot storage
- ✅ Cloudflare R2 integration for cold storage/backup
- ✅ Type-safe file upload/download operations
- ✅ Signed URL generation with expiry
- ✅ File validation and metadata handling
- ✅ S3-compatible API for R2

## Installation

This is an internal workspace package. Install dependencies:

```bash
pnpm install
```

## Usage

### Supabase Storage (Hot)

```typescript
import { uploadToHotStorage, getHotStorageSignedUrl } from "@ictirc/storage/supabase";

// Upload a file
const result = await uploadToHotStorage(fileBuffer, "papers/paper-id/manuscript.pdf", {
  contentType: "application/pdf",
});

// Get signed URL (1 hour expiry)
const urlResult = await getHotStorageSignedUrl("papers/paper-id/manuscript.pdf", 3600);
```

### Cloudflare R2 (Cold)

```typescript
import { uploadToR2, copyToR2ColdStorage } from "@ictirc/storage/r2";

// Backup to R2 cold storage
const backupResult = await copyToR2ColdStorage(
  fileBuffer,
  "backups/2026/paper-id.pdf"
);

// Get R2 signed URL
const r2Url = await getR2SignedUrl("backups/2026/paper-id.pdf");
```

### File Validation

```typescript
import { fileUploadSchema, generateFilePath } from "@ictirc/storage";

// Validate file
const validation = fileUploadSchema.safeParse({ file });

// Generate storage path
const path = generateFilePath("paper-id", "manuscript.pdf", "raw");
// Result: "papers/paper-id/raw/1706659200000_manuscript.pdf"
```

## Environment Variables

### Supabase (Hot Storage)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SUPABASE_BUCKET_HOT=manuscripts
```

### Cloudflare R2 (Cold Storage)
```env
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME_COLD=cict-cold-storage
```

## API Reference

### Supabase Operations

- `uploadToHotStorage(file, path, options)` - Upload to Supabase
- `downloadFromHotStorage(path)` - Download from Supabase
- `deleteFromHotStorage(paths)` - Delete files
- `getHotStorageSignedUrl(path, expiresIn)` - Get time-limited URL
- `getPublicUrl(path)` - Get public URL (if bucket is public)

### R2 Operations

- `uploadToR2(file, path, metadata)` - Upload to R2
- `downloadFromR2(path)` - Download from R2
- `deleteFromR2(path)` - Delete from R2 (Dean only)
- `getR2SignedUrl(path, expiresIn)` - Get signed URL
- `copyToR2ColdStorage(buffer, path, metadata)` - Backup from Supabase to R2

## Storage Strategy

### Paper Submission Flow

1. **Upload**: File uploaded to Supabase `manuscripts` bucket
2. **Review**: Served via signed URLs with 1-hour expiry
3. **Publication**: PDF branded and stored in Supabase
4. **Backup**: Daily copy to R2 cold storage

### File Organization

```
Supabase (manuscripts bucket):
  papers/
    {paper-id}/
      raw/
        {timestamp}_{original-name}.pdf
      branded/
        {paper-id}-published.pdf
      review/
        {paper-id}-watermarked.pdf

Cloudflare R2 (cict-cold-storage):
  backups/
    {year}/
      {paper-id}.pdf
  archive/
    {year}/
      published/
        {doi}.pdf
```

## Security

- All hot storage access controlled via Supabase RLS policies
- R2 credentials stored server-side only (never exposed to client)
- Signed URLs expire after 1 hour (configurable)
- File type and size validation enforced
- Only Dean role can delete from cold storage

## License

Private - ISUFST CICT Department
