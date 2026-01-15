import { COLORS } from '@/lib/constants'
import { useFilterStore } from '@/store/filterStore'
import { Filter, X } from 'lucide-react'

interface FilterToolbarProps {
  allTags: string[]
}

export default function FilterToolbar({ allTags }: FilterToolbarProps) {
  const { selectedColor, selectedTag, setColorFilter, setTagFilter, clearFilters } = useFilterStore()

  const hasActiveFilters = selectedColor || selectedTag

  const getColorBorder = (color: typeof COLORS[number]) => {
    return selectedColor === color.class ? color.border : color.border + '80'
  }

  return (
    <div className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <div className="flex items-center gap-1 sm:gap-2 text-gray-700 flex-shrink-0">
            <Filter className="w-4 h-4" />
            <span className="font-medium text-sm sm:text-base">Filters:</span>
          </div>

          {/* Color Filter */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1 min-w-0">
            <div className="flex gap-1 sm:gap-1.5">
              {COLORS.map(color => (
                <button
                  key={color.class}
                  onClick={() =>
                    setColorFilter(selectedColor === color.class ? null : color.class)
                  }
                  style={{
                    borderColor: getColorBorder(color),
                    borderWidth: '1px'
                  }}
                  className={`w-7 h-7 sm:w-6 sm:h-6 rounded-full ${color.class} ${
                    selectedColor === color.class
                      ? 'scale-110 ring-2 ring-offset-1'
                      : ''
                  } hover:scale-110 transition-all flex-shrink-0`}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Tag Filter */}
          {allTags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm text-gray-600 flex-shrink-0">Tag:</span>
              <div className="flex gap-1.5 flex-wrap">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() =>
                      setTagFilter(selectedTag === tag ? null : tag)
                    }
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs border ${
                      selectedTag === tag
                        ? 'bg-purple-500 text-white border-purple-600'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 hover:border-gray-400'
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
              className="flex items-center gap-1 px-2 sm:px-3 py-1 text-xs sm:text-sm text-red-600 hover:bg-red-50 rounded-full border border-red-300 hover:border-red-400 transition flex-shrink-0"
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Clear Filters</span>
              <span className="sm:hidden">Clear</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
