import { COLORS } from '@/lib/constants'
import { Palette } from 'lucide-react'
import { useState } from 'react'

interface ColorPickerProps {
  currentColor: string
  onChange: (color: string) => void
}

export default function ColorPicker({ currentColor, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-800"
      >
        <Palette className="w-3 h-3" />
        Change Color
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-full left-0 mb-2 p-2 bg-white rounded-lg shadow-lg z-20 grid grid-cols-6 gap-1">
            {COLORS.map(color => (
              <button
                key={color.class}
                onClick={() => {
                  onChange(color.class)
                  setIsOpen(false)
                }}
                className={`w-8 h-8 rounded ${color.class} border-2 ${
                  currentColor === color.class
                    ? 'border-gray-800'
                    : 'border-gray-300'
                } hover:border-gray-600 transition`}
                title={color.name}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
