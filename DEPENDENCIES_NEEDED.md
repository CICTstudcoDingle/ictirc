# Missing Dependencies - Installation Required

## Overview
The archive system implementation is complete, but some UI components require additional dependencies that aren't currently installed.

## Required Installations

### 1. Admin App Dependencies

Run this command in the project root:

```bash
cd apps/admin
pnpm add react-hook-form @hookform/resolvers
```

These packages are needed for:
- `volume-form.tsx` - Volume creation/editing
- `issue-form.tsx` - Issue creation/editing  
- `conference-form.tsx` - Conference creation/editing

### 2. UI Package - Form Components

The form components used in the archive system need to be added to the `@ictirc/ui` package.

**Option A: Install shadcn/ui form components**

```bash
cd packages/ui
npx shadcn@latest add form select textarea label
```

Then update `packages/ui/src/index.ts` to export them:

```typescript
// Form components
export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "./components/form";

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./components/select";

export { Textarea } from "./components/textarea";
export { Label } from "./components/label";
```

**Option B: Create simple versions manually**

If you don't want to use shadcn/ui, you'll need to create simple implementations of:
- Form wrapper components
- Select dropdown
- Textarea
- Label

### 3. Toast System

The `toast` function is imported but needs to be configured properly. Check if `apps/admin/src/lib/toast.tsx` exports the toast function correctly.

Current import in forms:
```typescript
import { toast } from "@/lib/toast";
```

Make sure the toast.tsx file exports it:
```typescript
export function toast({ title, description, variant }: ToastProps) {
  // Implementation
}
```

### 4. Storage Package - uploadFile Function

The upload forms reference `uploadFile` from `@ictirc/storage`:

```typescript
import { uploadFile } from "@ictirc/storage";
```

This function needs to be implemented in `packages/storage/src/index.ts`:

```typescript
export async function uploadFile(
  file: File,
  path: string,
  bucket?: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  // Implementation for Cloudflare R2 or Supabase Storage
}
```

## Build Errors Summary

Current build will fail with these errors:

1. **Missing packages**: `react-hook-form`, `@hookform/resolvers/zod`
2. **Missing UI components**: Form, FormField, FormControl, Select, Textarea, Label
3. **Missing storage function**: `uploadFile`
4. **Toast export**: May need to verify toast function export

## Quick Fix Steps

1. Install dependencies:
   ```bash
   pnpm add -D react-hook-form @hookform/resolvers --filter @ictirc/admin
   ```

2. Add form components to UI package (using shadcn/ui):
   ```bash
   cd packages/ui
   npx shadcn@latest init
   npx shadcn@latest add form select textarea label
   ```

3. Update UI package exports in `packages/ui/src/index.ts`

4. Implement `uploadFile` function in storage package

5. Rebuild:
   ```bash
   pnpm build
   ```

## Current Status

✅ **Working without dependencies:**
- Archive dashboard (read-only views)
- Volume/Issue/Conference list pages (display only)
- Public archive pages
- All server actions (backend logic)

❌ **Requires dependencies to work:**
- Creating/editing volumes
- Creating/editing issues
- Creating/editing conferences
- Uploading papers (single or batch)

## Workaround (Temporary)

If you want to test the system immediately, you can:
1. Use Prisma Studio to manually create test data
2. View it through the list pages and public archive page
3. Install dependencies later when ready to use the forms

```bash
cd packages/database
pnpm prisma studio
```

Then manually create:
- A Volume record
- An Issue record (linked to the volume)
- A Conference record (optional)
- ArchivedPaper records (linked to the issue)
- ArchivedPaperAuthor records (linked to the papers)
