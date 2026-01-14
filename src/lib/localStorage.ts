import type { RecentBoard } from '@/types/database'

const RECENT_BOARDS_KEY = 'recent_boards'

export const getRecentBoards = (): RecentBoard[] => {
  try {
    const stored = localStorage.getItem(RECENT_BOARDS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export const addRecentBoard = (id: string, name: string = 'Untitled Board') => {
  const boards = getRecentBoards()
  const existingIndex = boards.findIndex(b => b.id === id)
  
  const newBoard: RecentBoard = {
    id,
    name,
    lastVisited: new Date().toISOString()
  }
  
  if (existingIndex !== -1) {
    boards[existingIndex] = newBoard
  } else {
    boards.unshift(newBoard)
  }
  
  // Keep only the last 10 boards
  const recentBoards = boards.slice(0, 10)
  localStorage.setItem(RECENT_BOARDS_KEY, JSON.stringify(recentBoards))
}

export const removeRecentBoard = (id: string) => {
  const boards = getRecentBoards()
  const filtered = boards.filter(b => b.id !== id)
  localStorage.setItem(RECENT_BOARDS_KEY, JSON.stringify(filtered))
}
