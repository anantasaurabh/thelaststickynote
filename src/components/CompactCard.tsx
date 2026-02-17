import type { Note } from '@/types/database'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Eye } from 'lucide-react'

interface CompactCardProps {
  note: Note
  onViewDetails?: (note: Note) => void
}

export default function CompactCard({ note, onViewDetails }: CompactCardProps) {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${note.color} min-h-[100px] rounded-lg shadow-sm p-3 relative group hover:shadow-md transition-shadow min-w-[200px] max-w-[250px] flex-shrink-0`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition"
      >
        <GripVertical className="w-4 h-4 text-gray-600" />
      </div>

      {/* Title */}
      <h3 className="font-medium text-sm text-gray-800 pr-6 pl-4 truncate" title={note.title}>
        {note.title}
      </h3>

      {/* View Details Button */}
      {onViewDetails && (
        <button
          onClick={() => onViewDetails(note)}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition p-1 hover:bg-white/50 rounded"
          title="View details"
        >
          <Eye className="w-4 h-4 text-gray-600" />
        </button>
      )}

      {/* Short Description */}
      {note.short_desc && (
        <div className="mt-2 px-1">
          <p className="text-xs text-gray-600 line-clamp-2" title={note.short_desc}>
            {note.short_desc}
          </p>
        </div>
      )}
    </div>
  )
}
