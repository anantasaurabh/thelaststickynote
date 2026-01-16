# Database Migration Guide

## Summary of Changes

This migration adds `updated_at` timestamp fields to both the `boards` and `notes` tables to track when records are last modified.

## What Changed

1. **boards table**: Added `updated_at` column
2. **notes table**: Added `updated_at` column  
3. **Triggers**: Automatic triggers to update `updated_at` on any UPDATE operation
4. **Function**: `update_updated_at_column()` function that sets timestamp to current UTC time

## Migration Instructions

### Option 1: For New Databases

If you're setting up a new database, use the updated CREATE TABLE statements in the [README.md](../README.md#3-set-up-database-tables).

### Option 2: For Existing Databases

If you already have tables created, run the migration SQL below in your Supabase SQL Editor:

#### Step 1: Run the Migration SQL

Navigate to your Supabase Dashboard → SQL Editor, and run:

```sql
-- Add updated_at column to boards table
ALTER TABLE public.boards 
ADD COLUMN updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;

-- Add updated_at column to notes table
ALTER TABLE public.notes 
ADD COLUMN updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for boards table
CREATE TRIGGER update_boards_updated_at 
    BEFORE UPDATE ON public.boards 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for notes table
CREATE TRIGGER update_notes_updated_at 
    BEFORE UPDATE ON public.notes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Backfill existing records (set updated_at to created_at for existing rows)
UPDATE public.boards SET updated_at = created_at WHERE updated_at IS NULL;
UPDATE public.notes SET updated_at = created_at WHERE updated_at IS NULL;
```

#### Step 2: Verify the Migration

Run this query to verify the columns were added:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'boards' AND column_name = 'updated_at'
UNION ALL
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'notes' AND column_name = 'updated_at';
```

You should see two rows showing `updated_at` columns with type `timestamp with time zone`.

#### Step 3: Test the Triggers

Update a record and verify the `updated_at` changes:

```sql
-- Test on a note (replace the id with an actual note id from your database)
UPDATE public.notes 
SET title = title 
WHERE id = (SELECT id FROM public.notes LIMIT 1);

-- Check the updated_at timestamp
SELECT id, title, created_at, updated_at 
FROM public.notes 
ORDER BY updated_at DESC 
LIMIT 5;
```

The `updated_at` should be more recent than `created_at` for the updated record.

## Rollback (If Needed)

If you need to rollback these changes:

```sql
-- Drop triggers
DROP TRIGGER IF EXISTS update_boards_updated_at ON public.boards;
DROP TRIGGER IF EXISTS update_notes_updated_at ON public.notes;

-- Drop function
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Remove columns
ALTER TABLE public.boards DROP COLUMN IF EXISTS updated_at;
ALTER TABLE public.notes DROP COLUMN IF EXISTS updated_at;
```

## Impact on Application

The TypeScript types in [src/types/database.ts](../src/types/database.ts) have been updated to include the `updated_at` field. The side panel now displays both created and updated timestamps at the bottom.

## Notes

- The `updated_at` field is automatically maintained by database triggers
- No application code changes needed for updates - triggers handle it automatically
- Existing records are backfilled with `created_at` value for `updated_at`
- All timestamps are stored in UTC timezone
