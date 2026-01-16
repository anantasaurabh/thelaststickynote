-- Migration: Add updated_at fields to boards and notes tables
-- Date: 2026-01-16

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
