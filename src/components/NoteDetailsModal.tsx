import { useState } from 'react'
import type { Note } from '@/types/database'
import { X } from 'lucide-react'

interface NoteDetailsModalProps {
  note: Note
  onClose: () => void
  onUpdate: (longDesc: string) => void
}

export default function NoteDetailsModal({ note, onClose, onUpdate }: NoteDetailsModalProps) {
  const [longDesc, setLongDesc] = useState(note.long_desc)
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = () => {
    onUpdate(longDesc)
    setIsEditing(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">{note.title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {isEditing ? (
            <textarea
              value={longDesc}
              onChange={(e) => setLongDesc(e.target.value)}
              className="w-full h-64 px-3 py-2 border rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter detailed description..."
            />
          ) : (
            <div className="prose max-w-none">
              {longDesc ? (
                <p className="whitespace-pre-wrap text-gray-700">{longDesc}</p>
              ) : (
                <p className="text-gray-400 italic">No detailed description yet.</p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  setLongDesc(note.long_desc)
                  setIsEditing(false)
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
              >
                Save
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
              >
                Edit Details
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
