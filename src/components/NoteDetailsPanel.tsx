import { useState } from 'react'
import type { Note, TodoItem, NoteStatus } from '@/types/database'
import { X, Calendar, Tag, Plus, Trash2 } from 'lucide-react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import ColorPicker from './ColorPicker'
import { nanoid } from 'nanoid'

interface NoteDetailsPanelProps {
  note: Note
  onClose: () => void
  onUpdate: (noteId: string, updates: Partial<Note>) => void
}

export default function NoteDetailsPanel({ note, onClose, onUpdate }: NoteDetailsPanelProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editTitle, setEditTitle] = useState(note.title)
  
  const [isEditingShortDesc, setIsEditingShortDesc] = useState(false)
  const [editShortDesc, setEditShortDesc] = useState(note.short_desc || '')
  
  const [isEditingLongDesc, setIsEditingLongDesc] = useState(false)
  const [longDesc, setLongDesc] = useState(note.long_desc || '')
  
  const [isEditingTags, setIsEditingTags] = useState(false)
  const [newTag, setNewTag] = useState('')
  
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null)
  const [editingTodoText, setEditingTodoText] = useState('')

  const handleSaveTitle = () => {
    onUpdate(note.id, { title: editTitle })
    setIsEditingTitle(false)
  }

  const handleSaveShortDesc = () => {
    onUpdate(note.id, { short_desc: editShortDesc })
    setIsEditingShortDesc(false)
  }

  const handleSaveLongDesc = () => {
    onUpdate(note.id, { long_desc: longDesc })
    setIsEditingLongDesc(false)
  }

  const handleColorChange = (color: string) => {
    onUpdate(note.id, { color })
  }

  const handleStatusChange = (status: NoteStatus) => {
    onUpdate(note.id, { status })
  }

  const handleAddTag = () => {
    if (newTag.trim()) {
      const updatedTags = [...(note.tags || []), newTag.trim()]
      onUpdate(note.id, { tags: updatedTags })
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = note.tags.filter(tag => tag !== tagToRemove)
    onUpdate(note.id, { tags: updatedTags })
  }

  const handleToggleTodo = (todoId: string) => {
    const updatedTodos = note.todos.map(todo =>
      todo.id === todoId ? { ...todo, done: !todo.done } : todo
    )
    onUpdate(note.id, { todos: updatedTodos })
  }

  const handleAddTodo = () => {
    const newTodo: TodoItem = {
      id: nanoid(),
      text: 'New task',
      done: false
    }
    onUpdate(note.id, { todos: [...note.todos, newTodo] })
  }

  const handleStartEditingTodo = (todoId: string, currentText: string) => {
    setEditingTodoId(todoId)
    setEditingTodoText(currentText)
  }

  const handleSaveTodoText = (todoId: string) => {
    if (editingTodoText.trim()) {
      const updatedTodos = note.todos.map(todo =>
        todo.id === todoId ? { ...todo, text: editingTodoText } : todo
      )
      onUpdate(note.id, { todos: updatedTodos })
    }
    setEditingTodoId(null)
    setEditingTodoText('')
  }

  const handleCancelEditingTodo = () => {
    setEditingTodoId(null)
    setEditingTodoText('')
  }

  const handleRemoveTodo = (todoId: string) => {
    const updatedTodos = note.todos.filter(todo => todo.id !== todoId)
    onUpdate(note.id, { todos: updatedTodos })
  }

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      ['link'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']
    ],
  }

  const formats = [
    'bold', 'italic', 'underline',
    'link',
    'list', 'bullet'
  ]

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex-1 mr-2">
          {isEditingTitle ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveTitle()
                if (e.key === 'Escape') {
                  setEditTitle(note.title)
                  setIsEditingTitle(false)
                }
              }}
              autoFocus
              className="w-full px-2 py-1 text-lg font-bold border-2 border-purple-500 rounded focus:outline-none"
            />
          ) : (
            <h2 
              onClick={() => setIsEditingTitle(true)}
              className="text-lg font-bold text-gray-800 cursor-pointer hover:text-purple-600 transition truncate"
              title={note.title}
            >
              {note.title}
            </h2>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-200 rounded-lg transition flex-shrink-0"
          title="Close panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Short Description */}
        <div>
          {isEditingShortDesc ? (
            <textarea
              value={editShortDesc}
              onChange={(e) => setEditShortDesc(e.target.value)}
              onBlur={handleSaveShortDesc}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setEditShortDesc(note.short_desc || '')
                  setIsEditingShortDesc(false)
                }
              }}
              autoFocus
              rows={3}
              maxLength={100}
              className="w-full px-3 py-2 text-sm border-2 border-purple-500 rounded-lg focus:outline-none resize-none"
              placeholder="Short description..."
            />
          ) : (
            <p 
              onClick={() => setIsEditingShortDesc(true)}
              className="text-sm text-gray-600 break-words cursor-pointer hover:text-purple-600 transition p-2 -m-2 rounded hover:bg-purple-50"
            >
              {note.short_desc || <span className="text-gray-400 italic">Add short description...</span>}
            </p>
          )}
        </div>

        {/* Long Description */}
        <div>
          {isEditingLongDesc ? (
            <div className="space-y-2">
              <ReactQuill
                theme="snow"
                value={longDesc}
                onChange={setLongDesc}
                modules={modules}
                formats={formats}
                className="bg-white rounded-lg"
                placeholder="Detailed description with formatting..."
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setLongDesc(note.long_desc || '')
                    setIsEditingLongDesc(false)
                  }}
                  className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveLongDesc}
                  className="px-3 py-1 text-sm bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div 
              onClick={() => setIsEditingLongDesc(true)}
              className="prose prose-sm max-w-none bg-gray-50 p-3 rounded-lg cursor-pointer hover:bg-purple-50 transition min-h-[80px]"
            >
              {longDesc ? (
                <div dangerouslySetInnerHTML={{ __html: longDesc }} />
              ) : (
                <p className="text-gray-400 italic text-sm">Add detailed description...</p>
              )}
            </div>
          )}
        </div>

        {/* Status */}
        <div className="flex flex-wrap gap-2">
          {(['new', 'todo', 'ongoing', 'closed'] as NoteStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition ${
                note.status === status
                  ? status === 'new' ? 'bg-blue-500 text-white' :
                    status === 'todo' ? 'bg-yellow-500 text-white' :
                    status === 'ongoing' ? 'bg-purple-500 text-white' :
                    'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Color */}
        <ColorPicker
          currentColor={note.color}
          onChange={handleColorChange}
        />

        {/* Tags */}
        <div>
          <div className="flex flex-wrap gap-2 mb-2">
            {note.tags && note.tags.length > 0 ? (
              note.tags.map((tag, index) => (
                <span
                  key={index}
                  className="group px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full flex items-center gap-1"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="opacity-0 group-hover:opacity-100 transition hover:text-purple-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            ) : null}
          </div>
          {isEditingTags ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddTag()
                    setIsEditingTags(false)
                  }
                  if (e.key === 'Escape') {
                    setNewTag('')
                    setIsEditingTags(false)
                  }
                }}
                onBlur={() => {
                  if (newTag.trim()) handleAddTag()
                  setIsEditingTags(false)
                }}
                autoFocus
                placeholder="Tag name..."
                className="flex-1 px-2 py-1 text-xs border-2 border-purple-500 rounded focus:outline-none"
              />
            </div>
          ) : (
            <button
              onClick={() => setIsEditingTags(true)}
              className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              Add Tag
            </button>
          )}
        </div>

        {/* Todos */}
        <div>
          <div className="space-y-2 mb-2">
            {note.todos && note.todos.length > 0 ? (
              note.todos.map((todo) => (
                <div key={todo.id} className="group flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={todo.done}
                    onChange={() => handleToggleTodo(todo.id)}
                    className="mt-1 rounded cursor-pointer"
                  />
                  {editingTodoId === todo.id ? (
                    <input
                      type="text"
                      value={editingTodoText}
                      onChange={(e) => setEditingTodoText(e.target.value)}
                      onBlur={() => handleSaveTodoText(todo.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveTodoText(todo.id)
                        if (e.key === 'Escape') handleCancelEditingTodo()
                      }}
                      autoFocus
                      className={`flex-1 text-sm bg-white border-b-2 border-purple-500 focus:outline-none px-1 ${
                        todo.done ? 'line-through text-gray-400' : 'text-gray-700'
                      }`}
                    />
                  ) : (
                    <span
                      onClick={() => handleStartEditingTodo(todo.id, todo.text)}
                      className={`flex-1 text-sm cursor-pointer hover:bg-purple-50 transition px-1 py-0.5 rounded ${
                        todo.done ? 'line-through text-gray-400' : 'text-gray-700'
                      }`}
                    >
                      {todo.text}
                    </span>
                  )}
                  <button
                    onClick={() => handleRemoveTodo(todo.id)}
                    className="opacity-0 group-hover:opacity-100 transition text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))
            ) : null}
          </div>
          <button
            onClick={handleAddTodo}
            className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            Add Todo
          </button>
        </div>

        {/* Created & Updated Dates */}
        <div className="pt-2 border-t border-gray-200 space-y-1">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>Created: {new Date(note.created_at).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>Updated: {new Date(note.updated_at).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}