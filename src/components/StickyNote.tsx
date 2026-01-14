import { useState } from 'react'
import type { Note, TodoItem } from '@/types/database'
import { NOTE_STATUSES } from '@/types/database'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Trash2, GripVertical, Edit2, X, Check } from 'lucide-react'
import ColorPicker from './ColorPicker'
import TagInput from './TagInput'
import TodoList from './TodoList'
import NoteDetailsModal from './NoteDetailsModal'

interface StickyNoteProps {
  note: Note
  onUpdate: (noteId: string, updates: Partial<Note>) => void
  onDelete: (noteId: string) => void
}

export default function StickyNote({ note, onUpdate, onDelete }: StickyNoteProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(note.title)
  const [editShortDesc, setEditShortDesc] = useState(note.short_desc)
  const [showDetails, setShowDetails] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: note.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleSave = () => {
    onUpdate(note.id, {
      title: editTitle,
      short_desc: editShortDesc,
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditTitle(note.title)
    setEditShortDesc(note.short_desc)
    setIsEditing(false)
  }

  const handleColorChange = (color: string) => {
    onUpdate(note.id, { color })
  }

  const handleTagsChange = (tags: string[]) => {
    onUpdate(note.id, { tags })
  }

  const handleTodosChange = (todos: TodoItem[]) => {
    onUpdate(note.id, { todos })
  }

  const handleLongDescChange = (longDesc: string) => {
    onUpdate(note.id, { long_desc: longDesc })
  }

  const handleStatusChange = (status: string) => {
    onUpdate(note.id, { status })
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`${note.color} rounded-lg shadow-md p-4 relative group hover:shadow-lg transition-shadow`}
      >
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition"
        >
          <GripVertical className="w-5 h-5 text-gray-600" />
        </div>

        {/* Actions */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancel}
                className="p-1 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(note.id)}
                className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Content */}
        <div className="mt-8 space-y-3">
          {isEditing ? (
            <>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-2 py-1 bg-white bg-opacity-50 rounded border-2 border-gray-400 font-bold text-lg"
                placeholder="Title"
              />
              <textarea
                value={editShortDesc}
                onChange={(e) => setEditShortDesc(e.target.value)}
                className="w-full px-2 py-1 bg-white bg-opacity-50 rounded border-2 border-gray-400 text-sm resize-none"
                rows={3}
                placeholder="Short description"
                maxLength={100}
              />
            </>
          ) : (
            <>
              <h3 
                onClick={() => setIsEditing(true)}
                className="font-bold text-lg text-gray-800 break-words cursor-pointer hover:text-purple-600 transition"
                title="Click to edit"
              >
                {note.title}
              </h3>
              {note.short_desc && (
                <p 
                  onClick={() => setIsEditing(true)}
                  className="text-sm text-gray-700 break-words cursor-pointer hover:text-purple-600 transition"
                  title="Click to edit"
                >
                  {note.short_desc}
                </p>
              )}
            </>
          )}

          {/* Long Description Link */}
          {note.long_desc && (
            <button
              onClick={() => setShowDetails(true)}
              className="text-xs text-blue-600 hover:underline"
            >
              View Details
            </button>
          )}

          {/* Tags */}
          <TagInput tags={note.tags} onChange={handleTagsChange} />

          {/* Todos */}
          <TodoList todos={note.todos} onChange={handleTodosChange} />
        </div>

        {/* Color Picker - Bottom Right */}
        <div className="absolute bottom-3 right-3">
          <ColorPicker
            currentColor={note.color}
            onChange={handleColorChange}
          />
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && (
        <NoteDetailsModal
          note={note}
          onClose={() => setShowDetails(false)}
          onUpdate={handleLongDescChange}
        />
      )}
    </>
  )
}
