---
description: Safe Prisma migration without data loss
---

# Safe Prisma Migration Workflow

This workflow ensures database migrations don't wipe production/development data.

## Rules for Schema Changes

1. **New columns MUST be optional or have defaults**
   ```prisma
   // GOOD - Optional
   avatarUrl String?
   
   // GOOD - Has default
   isActive Boolean @default(true)
   
   // BAD - Required without default (will fail or prompt reset)
   avatarUrl String
   ```

2. **Never delete columns in dev** - Mark as deprecated first

3. **Never rename columns** - Add new, migrate data, then remove old

---

## Commands

### For Development (Supabase with existing data)

// turbo-all

1. First, generate migration file WITHOUT applying:
```bash
cd packages/database
npx prisma migrate dev --create-only --name your_migration_name
```

2. Review the generated SQL in `prisma/migrations/[timestamp]_your_migration_name/migration.sql`

3. If SQL looks safe (only ADD COLUMN, no DROP), apply manually:
```bash
npx prisma migrate deploy
```

4. Regenerate Prisma Client:
```bash
npx prisma generate
```

---

### Quick Safe Migration (recommended)

If you're ONLY adding optional columns:

```bash
cd packages/database
npx prisma db push
npx prisma generate
```

`db push` applies schema changes without creating migration files. Safe for development.

---

### If Prisma Prompts "Reset Database"

**NEVER say yes!** Instead:

1. Run `npx prisma migrate diff --from-schema-datamodel prisma/schema.prisma --to-schema-datasource prisma/schema.prisma`
2. Check what's different
3. If it's just new columns, use `npx prisma db push`
4. If migrations are out of sync, run `npx prisma migrate resolve --applied [migration_name]`

---

## Pre-Migration Checklist

- [ ] All new columns are optional (`?`) or have `@default()`
- [ ] No columns are being renamed or deleted
- [ ] Backup important data if unsure
- [ ] Use `--create-only` first to review SQL
