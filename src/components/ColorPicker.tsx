import { COLORS } from '@/lib/constants'
import { Palette } from 'lucide-react'
import { useState } from 'react'

interface ColorPickerProps {
  currentColor: string
  onChange: (color: string) => void
}

export default function ColorPicker({ currentColor, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  // First 5 colors for quick access
  const quickColors = COLORS.slice(0, 5)

  const getColorBorder = (color: typeof COLORS[number]) => {
    return currentColor === color.class ? color.border : color.border + '80'
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-1">
        {/* Quick color circles */}
        {quickColors.map(color => (
          <button
            key={color.class}
            onClick={() => onChange(color.class)}
            style={{
              borderColor: getColorBorder(color),
              borderWidth: '1px'
            }}
            className={`w-6 h-6 rounded-full ${color.class} ${
              currentColor === color.class
                ? 'scale-110 ring-1 ring-offset-1'
                : ''
            } hover:scale-110 transition-all`}
            title={color.name}
          />
        ))}

        {/* Show all colors button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-6 h-6 rounded-full bg-white border border-gray-400 hover:border-gray-700 hover:scale-110 transition-all flex items-center justify-center"
          title="More colors"
        >
          <Palette className="w-3 h-3 text-gray-600" />
        </button>
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-full left-0 mb-2 p-3 bg-white rounded-lg shadow-xl z-20 grid grid-cols-6 gap-2">
            {COLORS.map(color => (
              <button
                key={color.class}
                onClick={() => {
                  onChange(color.class)
                  setIsOpen(false)
                }}
                style={{
                  borderColor: getColorBorder(color),
                  borderWidth: '1px'
                }}
                className={`w-8 h-8 rounded ${color.class} ${
                  currentColor === color.class
                    ? 'ring-2 ring-offset-1'
                    : ''
                } hover:scale-110 transition-transform`}
                title={color.name}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
