# The Last Sticky Note App 🗒️

A no-friction collaborative sticky note tool. Create a board instantly, share the URL, and collaborate in real-time.

## Features
- ✨ No login required
- 🚀 Instant board creation
- 🔗 Share via URL
- 🎨 12 pastel color options
- ✅ Todo lists within notes
- 🏷️ Tag system
- 📋 Kanban board view with status columns (New, Todo, Ongoing, Closed)
- 🎯 Drag and drop reordering
- 🔍 Client-side filtering

## Tech Stack
- **Frontend**: React + Vite + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: Zustand
- **Drag & Drop**: @dnd-kit
- **Database**: Supabase (PostgreSQL)
- **ID Generation**: nanoid

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Supabase Credentials

#### Where to Find Your Supabase Credentials:

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Log in to your account (or create one if you don't have it)
3. Select your project (or create a new one)
4. Click on the **Settings** icon (⚙️) in the left sidebar
5. Navigate to **API** section
6. You will see two important values:
   - **Project URL** - Copy this value
   - **anon public** key - Copy this value

#### Where to Use These Credentials:

1. Open the file: `config/.env`
2. Replace the placeholder values:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
3. Paste your actual values:
   ```
   VITE_SUPABASE_URL=https://abcdefghijk.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

**Note**: The `.env` file is prefixed with `VITE_` because Vite requires this prefix to expose environment variables to the client-side code.

### 3. Set Up Database Tables

Run the following SQL in your Supabase SQL Editor (found in the Supabase dashboard):

```sql
-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. Create the BOARDS table
create table public.boards (
  id text primary key,
  name text default 'Untitled Board',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create the NOTES table
create table public.notes (
  id uuid default gen_random_uuid() primary key,
  board_id text references public.boards(id) on delete cascade not null,
  title text not null,
  short_desc text default '',
  long_desc text default '',
  color text default 'bg-yellow-200',
  tags text[] default '{}',
  todos jsonb default '[]'::jsonb,
  position integer default 0,
  status text default 'new',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Create function to automatically update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language 'plpgsql';

-- 5. Create triggers for automatic updated_at updates
create trigger update_boards_updated_at 
    before update on public.boards 
    for each row 
    execute function update_updated_at_column();

create trigger update_notes_updated_at 
    before update on public.notes 
    for each row 
    execute function update_updated_at_column();

-- 6. Create an Index for speed
create index notes_board_id_idx on public.notes(board_id);

-- 7. Enable Realtime
alter publication supabase_realtime add table public.boards;
alter publication supabase_realtime add table public.notes;

-- 8. Enable Row Level Security
alter table public.boards enable row level security;
alter table public.notes enable row level security;

-- Create Policies for public access
create policy "Enable public access to boards"
on public.boards for all using (true) with check (true);

create policy "Enable public access to notes"
on public.notes for all using (true) with check (true);
```

### 3a. Migration for Existing Databases

If you already have the tables created, run this migration SQL to add the `updated_at` fields:

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

### 4. Run the Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 5. Build for Production
```bash
npm run build
```

## Project Structure
```
thelaststickynote/
├── config/
│   └── .env              # Supabase credentials (DO NOT commit to git)
├── public/               # Static assets
├── src/
│   ├── components/       # React components
│   ├── lib/             # Supabase client and utilities
│   ├── store/           # Zustand state management
│   ├── types/           # TypeScript types
│   ├── App.tsx          # Main app with routing
│   └── main.tsx         # Entry point
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Security Note
⚠️ **IMPORTANT**: Never commit your `config/.env` file to version control. It's already included in `.gitignore`.

## Color Palette
The app uses 12 pastel colors:
- Red, Orange, Amber, Yellow
- Lime, Green, Emerald, Teal
- Cyan, Sky, Indigo, Violet

## Support
For issues or questions, please refer to the `specs` file in the project root.

---
Built with ❤️ using React, Supabase, and Tailwind CSS
