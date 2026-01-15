import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { addRecentBoard } from '@/lib/localStorage'
import type { Note, Database } from '@/types/database'
import type { NoteStatus } from '@/types/database'
import StickyNote from '@/components/StickyNote'
import FilterToolbar from '@/components/FilterToolbar'
import KanbanView from '@/components/KanbanView'
import { useFilterStore } from '@/store/filterStore'
import { Plus, Home, Copy, Check, Download, Upload, LayoutGrid, Columns, Info } from 'lucide-react'
import Footer from '@/components/Footer'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable'

export default function BoardPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [boardName, setBoardName] = useState('Untitled Board')
  const [isEditingName, setIsEditingName] = useState(false)
  const [editName, setEditName] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'kanban'>('grid')
  const { selectedColor, selectedTag } = useFilterStore()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    if (!id) return

    // Load board details
    loadBoard()

    // Load notes
    loadNotes()

    // Subscribe to realtime changes
    const subscription = supabase
      .channel(`board:${id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notes',
          filter: `board_id=eq.${id}`,
        },
        () => {
          loadNotes()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [id])

  const loadBoard = async () => {
    if (!id) return

    try {
      const { data, error } = await supabase
        .from('boards')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      
      const name = (data as Database['public']['Tables']['boards']['Row']).name || 'Untitled Board'
      setBoardName(name)
      
      // Add to recent boards with name
      addRecentBoard(id, name)
    } catch (error) {
      console.error('Error loading board:', error)
    }
  }

  const loadNotes = async () => {
    if (!id) return

    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('board_id', id)
        .order('position')

      if (error) throw error
      setNotes(data || [])
    } catch (error) {
      console.error('Error loading notes:', error)
    } finally {
      setLoading(false)
    }
  }

  const addNote = async () => {
    if (!id) return

    try {
      const maxPosition = Math.max(...notes.map(n => n.position), -1)
      
      const newNote: Database['public']['Tables']['notes']['Insert'] = {
        board_id: id,
        title: 'New Note',
        position: maxPosition + 1,
        status: 'new',
      }
      
      const { error } = await supabase
        .from('notes')
        .insert(newNote)

      if (error) throw error
    } catch (error) {
      console.error('Error creating note:', error)
    }
  }

  const updateNote = async (noteId: string, updates: Partial<Note>) => {
    try {
      const noteUpdate: Database['public']['Tables']['notes']['Update'] = updates
      const { error } = await supabase
        .from('notes')
        .update(noteUpdate)
        .eq('id', noteId)

      if (error) throw error
    } catch (error) {
      console.error('Error updating note:', error)
    }
  }

  const deleteNote = async (noteId: string) => {
    try {
      // Optimistically update UI
      setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId))

      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting note:', error)
      // Reload notes on error to sync with database
      loadNotes()
    }
  }

  const updateBoardName = async () => {
    if (!id || !editName.trim()) {
      setIsEditingName(false)
      return
    }

    try {
      const newName = editName.trim()
      const boardUpdate: Database['public']['Tables']['boards']['Update'] = { name: newName }
      const { error } = await supabase
        .from('boards')
        .update(boardUpdate)
        .eq('id', id)

      if (error) throw error

      setBoardName(newName)
      addRecentBoard(id, newName)
      setIsEditingName(false)
    } catch (error) {
      console.error('Error updating board name:', error)
      setIsEditingName(false)
    }
  }

  const startEditingName = () => {
    setEditName(boardName)
    setIsEditingName(true)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    // Check if dropped over a kanban column
    const overId = over.id.toString()
    if (overId.startsWith('column-')) {
      const newStatus = overId.replace('column-', '') as NoteStatus
      const noteId = active.id.toString()
      
      // Update status
      await updateNote(noteId, { status: newStatus })
      return
    }

    if (active.id === over.id) return

    const oldIndex = notes.findIndex(n => n.id === active.id)
    const newIndex = notes.findIndex(n => n.id === over.id)

    const newNotes = arrayMove(notes, oldIndex, newIndex)
    setNotes(newNotes)

    // Update positions in database
    try {
      const updates = newNotes.map((note, index) => ({
        id: note.id,
        position: index,
      }))

      for (const update of updates) {
        const positionUpdate: Database['public']['Tables']['notes']['Update'] = { position: update.position }
        await supabase
          .from('notes')
          .update(positionUpdate)
          .eq('id', update.id)
      }
    } catch (error) {
      console.error('Error updating positions:', error)
      loadNotes() // Reload on error
    }
  }

  const copyBoardUrl = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const exportNotes = () => {
    if (!id || notes.length === 0) {
      alert('No notes to export!')
      return
    }

    const exportData = {
      boardName: boardName,
      exportDate: new Date().toISOString(),
      notes: notes.map(note => ({
        title: note.title,
        short_desc: note.short_desc,
        long_desc: note.long_desc,
        color: note.color,
        tags: note.tags,
        todos: note.todos,
        status: note.status,
      }))
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${boardName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const importNotes = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        const text = await file.text()
        const importData = JSON.parse(text)

        if (!importData.notes || !Array.isArray(importData.notes)) {
          alert('Invalid JSON format!')
          return
        }

        const maxPosition = Math.max(...notes.map(n => n.position), -1)

        for (let i = 0; i < importData.notes.length; i++) {
          const note = importData.notes[i]
          const newNote: Database['public']['Tables']['notes']['Insert'] = {
            board_id: id!,
            title: note.title || 'Imported Note',
            short_desc: note.short_desc || '',
            long_desc: note.long_desc || '',
            color: note.color || 'bg-pastel-yellow',
            tags: note.tags || [],
            todos: note.todos || [],
            status: note.status || 'new',
            position: maxPosition + i + 1,
          }
          await supabase.from('notes').insert(newNote)
        }

        alert(`Successfully imported ${importData.notes.length} note(s)!`)
      } catch (error) {
        console.error('Error importing notes:', error)
        alert('Failed to import notes. Please check the file format.')
      }
    }
    input.click()
  }

  // Filter notes
  const filteredNotes = notes.filter(note => {
    if (selectedColor && note.color !== selectedColor) return false
    if (selectedTag && !note.tags.includes(selectedTag)) return false
    return true
  })

  // Get all unique tags
  const allTags = Array.from(new Set(notes.flatMap(n => n.tags)))

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading board...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <Home className="w-5 h-5" />
                <span className="hidden sm:inline">Home</span>
              </button>
              
              <button
                onClick={() => navigate('/about')}
                className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition"
              >
                <Info className="w-5 h-5" />
                <span className="hidden sm:inline">About</span>
              </button>
              
              <div className="h-6 w-px bg-gray-300 hidden sm:block" />
              
              {isEditingName ? (
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={updateBoardName}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') updateBoardName()
                    if (e.key === 'Escape') setIsEditingName(false)
                  }}
                  className="px-2 py-1 border border-purple-500 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg font-semibold"
                  autoFocus
                />
              ) : (
                <button
                  onClick={startEditingName}
                  className="text-lg font-semibold text-gray-800 hover:text-purple-600 transition px-2 py-1 rounded hover:bg-purple-50"
                  title="Click to rename board"
                >
                  {boardName}
                </button>
              )}

              <div className="h-6 w-px bg-gray-300 hidden sm:block" />

              {/* View Toggle */}
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-1 px-3 py-2 text-sm transition ${
                    viewMode === 'grid'
                      ? 'bg-white text-gray-900 shadow-sm font-semibold'
                      : 'bg-transparent text-gray-600 hover:text-gray-900'
                  }`}
                  title="Grid view"
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="hidden md:inline">Grid</span>
                </button>
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`flex items-center gap-1 px-3 py-2 text-sm transition ${
                    viewMode === 'kanban'
                      ? 'bg-white text-gray-900 shadow-sm font-semibold'
                      : 'bg-transparent text-gray-600 hover:text-gray-900'
                  }`}
                  title="Kanban view"
                >
                  <Columns className="w-4 h-4" />
                  <span className="hidden md:inline">Kanban</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={exportNotes}
                className="flex items-center gap-2 px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition"
                title="Export notes as JSON"
              >
                <Download className="w-4 h-4" />
                <span className="hidden md:inline text-sm">Export</span>
              </button>

              <button
                onClick={importNotes}
                className="flex items-center gap-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition"
                title="Import notes from JSON"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden md:inline text-sm">Import</span>
              </button>

              <button
                onClick={copyBoardUrl}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span className="hidden sm:inline text-sm">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="hidden sm:inline text-sm">Share</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar - Only show in grid view */}
      {viewMode === 'grid' && <FilterToolbar allTags={allTags} />}

      {/* Notes View */}
      <div className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {notes.length === 0 && filteredNotes.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <button
              onClick={addNote}
              className="border-4 border-dashed border-gray-300 rounded-lg p-8 hover:border-purple-400 hover:bg-purple-50 transition-colors flex flex-col items-center justify-center gap-3 min-h-[250px] group"
            >
              <Plus className="w-12 h-12 text-gray-400 group-hover:text-purple-500 transition" />
              <span className="text-lg font-medium text-gray-600 group-hover:text-purple-600 transition">
                Add Note
              </span>
            </button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            {viewMode === 'kanban' ? (
              <KanbanView
                notes={filteredNotes}
                onUpdate={updateNote}
                onDelete={deleteNote}
                onAddNote={addNote}
              />
            ) : (
              <SortableContext
                items={filteredNotes.map(n => n.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredNotes.map(note => (
                    <StickyNote
                      key={note.id}
                      note={note}
                      onUpdate={updateNote}
                      onDelete={deleteNote}
                    />
                  ))}
                  
                  {/* Add Note Placeholder */}
                  <button
                    onClick={addNote}
                    className="border-4 border-dashed border-gray-300 rounded-lg p-8 hover:border-purple-400 hover:bg-purple-50 transition-colors flex flex-col items-center justify-center gap-3 min-h-[250px] group"
                  >
                    <Plus className="w-12 h-12 text-gray-400 group-hover:text-purple-500 transition" />
                    <span className="text-lg font-medium text-gray-600 group-hover:text-purple-600 transition">
                      Add Note
                    </span>
                  </button>
                </div>
              </SortableContext>
            )}
          </DndContext>
        )}
      </div>
      
      <Footer />
    </div>
  )
}
