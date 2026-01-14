export interface Database {
  public: {
    Tables: {
      boards: {
        Row: {
          id: string
          created_at: string
        }
        Insert: {
          id: string
          created_at?: string
        }
        Update: {
          id?: string
          created_at?: string
        }
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
          created_at: string
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
          created_at?: string
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
          created_at?: string
        }
      }
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
  created_at: string
}

export interface Board {
  id: string
  created_at: string
}

export interface RecentBoard {
  id: string
  name: string
  lastVisited: string
}
