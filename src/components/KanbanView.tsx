import type { Note, NoteStatus } from '@/types/database'
import { NOTE_STATUSES } from '@/types/database'
import StickyNote from './StickyNote'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'

interface KanbanViewProps {
  notes: Note[]
  onUpdate: (noteId: string, updates: Partial<Note>) => void
  onDelete: (noteId: string) => void
  onAddNote: () => void
  onOpenPanel?: (note: Note) => void
  onSwitchCard?: (note: Note) => void
  isPanelOpen?: boolean
}

function KanbanColumn({ 
  status, 
  label, 
  notes, 
  onUpdate, 
  onDelete,
  onAddNote,
  onOpenPanel,
  onSwitchCard,
  isPanelOpen
}: { 
  status: NoteStatus
  label: string
  notes: Note[]
  onUpdate: (noteId: string, updates: Partial<Note>) => void
  onDelete: (noteId: string) => void
  onAddNote?: () => void
  onOpenPanel?: (note: Note) => void
  onSwitchCard?: (note: Note) => void
  isPanelOpen?: boolean
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${status}`,
    data: { status }
  })

  return (
    <div className="flex-1 min-w-[280px]">
      <div
        ref={setNodeRef}
        className={`bg-gray-50 rounded-lg p-3 min-h-[600px] ${
          isOver ? 'bg-blue-50 ring-2 ring-blue-300' : ''
        }`}
      >
        <div className="mb-3 pb-2 border-b border-gray-300">
          <h3 className="font-semibold text-gray-700 flex items-center justify-between">
            <span>{label}</span>
            <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
              {notes.length}
            </span>
          </h3>
        </div>
        
        <SortableContext
          items={notes.map(n => n.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {notes.map(note => (
              <StickyNote
                key={note.id}
                note={note}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onOpenPanel={onOpenPanel}
                onSwitchCard={onSwitchCard}
                isPanelOpen={isPanelOpen}
              />
            ))}
            
            {/* Add Note Button - Only in New column */}
            {status === 'new' && onAddNote && (
              <button
                onClick={onAddNote}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-purple-400 hover:bg-purple-50 transition-colors flex flex-col items-center justify-center gap-2 group"
              >
                <Plus className="w-8 h-8 text-gray-400 group-hover:text-purple-500 transition" />
                <span className="text-sm font-medium text-gray-600 group-hover:text-purple-600 transition">
                  Add Note
                </span>
              </button>
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  )
}

export default function KanbanView({ notes, onUpdate, onDelete, onAddNote, onOpenPanel, onSwitchCard, isPanelOpen }: KanbanViewProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {NOTE_STATUSES.map(({ value, label }) => (
        <KanbanColumn
          key={value}
          status={value}
          label={label}
          notes={notes.filter(n => n.status === value)}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onAddNote={value === 'new' ? onAddNote : undefined}
          onOpenPanel={onOpenPanel}
          onSwitchCard={onSwitchCard}
          isPanelOpen={isPanelOpen}
        />
      ))}
    </div>
  )
}
