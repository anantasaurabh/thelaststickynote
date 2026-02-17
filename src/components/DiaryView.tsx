import { useState, useRef, useEffect } from 'react'
import type { Note } from '@/types/database'
import CompactCard from './CompactCard'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import { format, addDays, subDays, startOfToday, isToday, parseISO } from 'date-fns'

interface DiaryViewProps {
  notes: Note[]
  onOpenPanel?: (note: Note) => void
  onAddNote?: (date: string) => void
}

// Generate array of dates dynamically
function generateDateRange(centerDate?: Date): Date[] {
  const center = centerDate || startOfToday()
  const dates: Date[] = []
  
  // Add past 10 days from center
  for (let i = 10; i >= 1; i--) {
    dates.push(subDays(center, i))
  }
  
  // Add center date
  dates.push(center)
  
  // Add next 10 days from center
  for (let i = 1; i <= 10; i++) {
    dates.push(addDays(center, i))
  }
  
  return dates
}

function UnassignedZone({ 
  notes, 
  onOpenPanel 
}: { 
  notes: Note[]
  onOpenPanel?: (note: Note) => void
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'unassigned-zone',
    data: { type: 'unassigned' }
  })

  return (
    <div className="">
      <div className="">
        <div
          ref={setNodeRef}
          className={`min-h-[100px] rounded-lg transition-colors ${
            isOver ? 'border-purple-400 bg-purple-50' : 'border-gray-300 bg-white'
          }`}
        >
          {notes.length === 0 ? (
            <div className="flex items-center justify-center h-[84px] text-sm text-gray-400">
              Drop cards here to unassign
            </div>
          ) : (
            <SortableContext
              items={notes.map(n => n.id)}
              strategy={horizontalListSortingStrategy}
            >
              <div className="flex gap-3 overflow-x-auto pb-2">
                {notes.map(note => (
                  <CompactCard
                    key={note.id}
                    note={note}
                    onViewDetails={onOpenPanel}
                  />
                ))}
              </div>
            </SortableContext>
          )}
        </div>
      </div>
    </div>
  )
}

function DatePane({ 
  date, 
  notes, 
  onOpenPanel,
  onAddNote
}: { 
  date: Date
  notes: Note[]
  onOpenPanel?: (note: Note) => void
  onAddNote?: (date: string) => void
}) {
  const dateStr = format(date, 'yyyy-MM-dd')
  const { setNodeRef, isOver } = useDroppable({
    id: `date-${dateStr}`,
    data: { type: 'date-pane', date: dateStr }
  })

  const todayClass = isToday(date)

  const handleAddNote = () => {
    if (onAddNote) {
      onAddNote(dateStr)
    }
  }

  return (
    <div className="flex-shrink-0 w-[280px]">
      <div
        ref={setNodeRef}
        className={`rounded-lg border-2 min-h-[400px] transition-all ${
          isOver
            ? 'border-purple-400 bg-purple-50'
            : todayClass
            ? 'border-purple-300 bg-purple-50/30'
            : 'border-gray-200 bg-gray-50'
        }`}
      >
        {/* Date Header */}
        <div className={`p-3 border-b-2 ${
          todayClass 
            ? 'border-purple-300 bg-purple-100' 
            : 'border-gray-200 bg-white'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-xs font-semibold uppercase tracking-wide ${
                todayClass ? 'text-purple-700' : 'text-gray-500'
              }`}>
                {format(date, 'EEE')}
              </div>
              <div className={`text-lg font-bold ${
                todayClass ? 'text-purple-800' : 'text-gray-800'
              }`}>
                {format(date, 'MMM d')}
              </div>
              {todayClass && (
                <div className="text-xs font-medium text-purple-600">Today</div>
              )}
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              todayClass 
                ? 'bg-purple-200 text-purple-800' 
                : 'bg-gray-200 text-gray-700'
            }`}>
              {notes.length}
            </span>
          </div>
        </div>

        {/* Cards */}
        <div className="p-3">
          <SortableContext
            items={notes.map(n => n.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="space-y-2">
              {notes.map(note => (
                <CompactCard
                  key={note.id}
                  note={note}
                  onViewDetails={onOpenPanel}
                />
              ))}
              
              {/* Add Note Button */}
              {onAddNote && (
                <button
                  onClick={handleAddNote}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg p-3 hover:border-purple-400 hover:bg-purple-50 transition-colors flex items-center justify-center gap-2 group mt-2"
                >
                  <Plus className="w-4 h-4 text-gray-400 group-hover:text-purple-500 transition" />
                  <span className="text-xs font-medium text-gray-600 group-hover:text-purple-600 transition">
                    Add Note
                  </span>
                </button>
              )}
            </div>
          </SortableContext>
        </div>
      </div>
    </div>
  )
}

export default function DiaryView({ notes, onOpenPanel, onAddNote }: DiaryViewProps) {
  const [centerDate, setCenterDate] = useState<Date>(startOfToday())
  const dates = generateDateRange(centerDate)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const todayRef = useRef<HTMLDivElement>(null)
  const centerRef = useRef<HTMLDivElement>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [shouldScroll, setShouldScroll] = useState(true)
  
  // Separate unassigned notes (diary_date is null) from assigned notes
  const unassignedNotes = notes.filter(note => !note.diary_date)
  
  // Group notes by date - include ALL dates that have notes
  const notesByDate: Record<string, Note[]> = {}
  
  // First, add all notes to their respective dates
  notes.forEach(note => {
    if (note.diary_date) {
      if (!notesByDate[note.diary_date]) {
        notesByDate[note.diary_date] = []
      }
      notesByDate[note.diary_date].push(note)
    }
  })
  
  // Ensure all dates in our range have an entry (even if empty)
  dates.forEach(date => {
    const dateStr = format(date, 'yyyy-MM-dd')
    if (!notesByDate[dateStr]) {
      notesByDate[dateStr] = []
    }
  })

  // Scroll to center date when it changes
  useEffect(() => {
    if (!shouldScroll) return
    
    const targetRef = isToday(centerDate) ? todayRef : centerRef
    
    if (targetRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const targetElement = targetRef.current
      
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        const containerWidth = container.offsetWidth
        const targetLeft = targetElement.offsetLeft
        const targetWidth = targetElement.offsetWidth
        
        container.scrollTo({
          left: targetLeft - (containerWidth / 2) + (targetWidth / 2),
          behavior: 'smooth'
        })
      }, 100)
    }
    
    setShouldScroll(false)
  }, [centerDate, shouldScroll])

  // Handle date jump
  const handleDateJump = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value
    setSelectedDate(dateValue)
    
    if (!dateValue) return
    
    try {
      const selectedDateObj = parseISO(dateValue)
      setCenterDate(selectedDateObj)
      setShouldScroll(true)
    } catch (error) {
      console.error('Invalid date selected:', error)
    }
  }

  const handleGoToToday = () => {
    const today = startOfToday()
    setSelectedDate(format(today, 'yyyy-MM-dd'))
    setCenterDate(today)
    setShouldScroll(true)
  }

  const handleAddNoteWithDate = (date: string) => {
    if (onAddNote) {
      onAddNote(date)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Unassigned Cards Section */}
      <UnassignedZone notes={unassignedNotes} onOpenPanel={onOpenPanel} />
      
      {/* Date Jump Control */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-2">
        <label htmlFor="date-jump" className="text-sm text-gray-600 font-medium">Jump to:</label>
        <input
          id="date-jump"
          type="date"
          value={selectedDate}
          onChange={handleDateJump}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        <button
          onClick={handleGoToToday}
          className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-sm font-medium transition"
        >
          Go to Today
        </button>
      </div>
      
      {/* Date Panes Section */}
      <div className="flex-1 overflow-hidden">
        <div ref={scrollContainerRef} className="h-full overflow-x-auto">
          <div className="flex gap-4 p-4 h-full">
            {dates.map(date => {
              const dateStr = format(date, 'yyyy-MM-dd')
              const isTodayPane = isToday(date)
              const isCenterPane = format(date, 'yyyy-MM-dd') === format(centerDate, 'yyyy-MM-dd')
              return (
                <div 
                  key={dateStr} 
                  id={`date-pane-${dateStr}`}
                  ref={isTodayPane ? todayRef : (isCenterPane ? centerRef : null)}
                >
                  <DatePane
                    date={date}
                    notes={notesByDate[dateStr] || []}
                    onOpenPanel={onOpenPanel}
                    onAddNote={handleAddNoteWithDate}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
