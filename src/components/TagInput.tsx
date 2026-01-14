import { useState } from 'react'
import { Tag, X } from 'lucide-react'

interface TagInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
}

export default function TagInput({ tags, onChange }: TagInputProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newTag, setNewTag] = useState('')

  const handleAddTag = () => {
    const trimmed = newTag.trim()
    if (!trimmed || tags.includes(trimmed)) {
      setNewTag('')
      setIsAdding(false)
      return
    }

    onChange([...tags, trimmed])
    setNewTag('')
    setIsAdding(false)
  }

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove))
  }

  return (
    <div className="space-y-2">
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-white bg-opacity-60 rounded-full text-xs text-gray-700 group"
            >
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="text-gray-500 hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {isAdding ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddTag()
              if (e.key === 'Escape') {
                setIsAdding(false)
                setNewTag('')
              }
            }}
            placeholder="Tag name..."
            className="flex-1 px-2 py-1 text-xs bg-white bg-opacity-50 rounded border border-gray-400"
            autoFocus
          />
          <button
            onClick={handleAddTag}
            className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
          >
            Add
          </button>
          <button
            onClick={() => {
              setIsAdding(false)
              setNewTag('')
            }}
            className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-800"
        >
          <Tag className="w-3 h-3" />
          Add Tag
        </button>
      )}
    </div>
  )
}
