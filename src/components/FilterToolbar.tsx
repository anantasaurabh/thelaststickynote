import { COLORS } from '@/lib/constants'
import { useFilterStore } from '@/store/filterStore'
import { Filter, X } from 'lucide-react'

interface FilterToolbarProps {
  allTags: string[]
}

export default function FilterToolbar({ allTags }: FilterToolbarProps) {
  const { selectedColor, selectedTag, setColorFilter, setTagFilter, clearFilters } = useFilterStore()

  const hasActiveFilters = selectedColor || selectedTag

  return (
    <div className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-gray-700">
            <Filter className="w-4 h-4" />
            <span className="font-medium">Filters:</span>
          </div>

          {/* Color Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Color:</span>
            <div className="flex gap-1">
              {COLORS.map(color => (
                <button
                  key={color.class}
                  onClick={() =>
                    setColorFilter(selectedColor === color.class ? null : color.class)
                  }
                  className={`w-6 h-6 rounded ${color.class} border-2 ${
                    selectedColor === color.class
                      ? 'border-gray-800 scale-110'
                      : 'border-gray-300'
                  } hover:border-gray-600 transition-all`}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Tag Filter */}
          {allTags.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Tag:</span>
              <div className="flex gap-1 flex-wrap">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() =>
                      setTagFilter(selectedTag === tag ? null : tag)
                    }
                    className={`px-3 py-1 rounded-full text-xs ${
                      selectedTag === tag
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } transition`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
