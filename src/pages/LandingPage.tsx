import { useNavigate } from 'react-router-dom'
import { nanoid } from 'nanoid'
import { supabase } from '@/lib/supabase'
import { getRecentBoards, removeRecentBoard } from '@/lib/localStorage'
import { StickyNote, Trash2 } from 'lucide-react'
import { useState } from 'react'
import type { Database } from '@/types/database'

export default function LandingPage() {
  const navigate = useNavigate()
  const [recentBoards, setRecentBoards] = useState(getRecentBoards())
  const [isCreating, setIsCreating] = useState(false)

  const createNewBoard = async () => {
    try {
      setIsCreating(true)
      const boardId = nanoid(10)
      
      const boardInsert: Database['public']['Tables']['boards']['Insert'] = { id: boardId }
      const { error } = await supabase
        .from('boards')
        .insert(boardInsert)
      
      if (error) throw error
      
      navigate(`/board/${boardId}`)
    } catch (error) {
      console.error('Error creating board:', error)
      alert('Failed to create board. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteBoard = (boardId: string) => {
    removeRecentBoard(boardId)
    setRecentBoards(getRecentBoards())
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <StickyNote className="w-16 h-16 text-amber-400" />
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            The Last Sticky Note
          </h1>
          <p className="text-xl text-gray-600">
            No Login. No Signup. Just Create and Share.
          </p>
        </div>

        {/* Create Board Button */}
        <div className="text-center mb-12">
          <button
            onClick={createNewBoard}
            disabled={isCreating}
            className="bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-300 hover:from-yellow-400 hover:via-amber-400 hover:to-orange-400 text-gray-800 font-bold py-4 px-12 rounded-full text-xl shadow-lg transform transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed border border-amber-400"
          >
            {isCreating ? 'Creating...' : 'Create New Board'}
          </button>
        </div>

        {/* Recent Boards */}
        {recentBoards.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Recent Boards
            </h2>
            <div className="space-y-2">
              {recentBoards.map((board) => (
                <div
                  key={board.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg group"
                >
                  <button
                    onClick={() => navigate(`/board/${board.id}`)}
                    className="flex-1 text-left"
                  >
                    <div className="font-medium text-gray-800">
                      {board.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(board.lastVisited).toLocaleDateString()}
                    </div>
                  </button>
                  <button
                    onClick={() => handleDeleteBoard(board.id)}
                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-gray-600">
          <p className="text-sm">
            Share your board URL with anyone to collaborate in real-time
          </p>
        </div>

        {/* Security Warning */}
        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-800 text-center">
            ⚠️ <strong>Note:</strong> This tool is designed for fast collaboration, not security. 
            Do not put sensitive information on your boards. 
            Anyone with the link has full access to view, update, or delete the board.
          </p>
        </div>

        {/* Tip */}
        <p className="mt-2 text-xs text-gray-600 text-center">
            💡 <strong>Tip:</strong> Use the Export feature to backup your notes as JSON files.
          </p>
        
      </div>
    </div>
  )
}
