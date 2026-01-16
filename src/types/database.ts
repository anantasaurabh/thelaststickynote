export interface Database {
  public: {
    Tables: {
      boards: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      notes: {
        Row: {
          id: string
          board_id: string
          title: string
          short_desc: string
          long_desc: string
          color: string
          tags: string[]
          todos: TodoItem[]
          position: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          board_id: string
          title: string
          short_desc?: string
          long_desc?: string
          color?: string
          tags?: string[]
          todos?: TodoItem[]
          position?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          board_id?: string
          title?: string
          short_desc?: string
          long_desc?: string
          color?: string
          tags?: string[]
          todos?: TodoItem[]
          position?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export interface TodoItem {
  id: string
  text: string
  done: boolean
}

export interface Note {
  id: string
  board_id: string
  title: string
  short_desc: string
  long_desc: string
  color: string
  tags: string[]
  todos: TodoItem[]
  position: number
  status: string
  created_at: string
  updated_at: string
}

export type NoteStatus = 'new' | 'todo' | 'ongoing' | 'closed'

export const NOTE_STATUSES: { value: NoteStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'todo', label: 'Todo' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'closed', label: 'Closed' },
]

export interface Board {
  id: string
  name: string
  created_at: string
}

export interface RecentBoard {
  id: string
  name: string
  lastVisited: string
}
