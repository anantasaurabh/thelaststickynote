import { useState } from 'react'
import { nanoid } from 'nanoid'
import type { TodoItem } from '@/types/database'
import { Plus, X } from 'lucide-react'

interface TodoListProps {
  todos: TodoItem[]
  onChange: (todos: TodoItem[]) => void
}

export default function TodoList({ todos, onChange }: TodoListProps) {
  const [newTodoText, setNewTodoText] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const handleToggleTodo = (todoId: string) => {
    const updated = todos.map(todo =>
      todo.id === todoId ? { ...todo, done: !todo.done } : todo
    )
    onChange(updated)
  }

  const handleAddTodo = () => {
    if (!newTodoText.trim()) return

    const newTodo: TodoItem = {
      id: nanoid(),
      text: newTodoText.trim(),
      done: false,
    }

    onChange([...todos, newTodo])
    setNewTodoText('')
    setIsAdding(false)
  }

  const handleDeleteTodo = (todoId: string) => {
    onChange(todos.filter(todo => todo.id !== todoId))
  }

  return (
    <div className="space-y-2">
      {todos.length > 0 && (
        <div className="space-y-1">
          {todos.map(todo => (
            <div
              key={todo.id}
              className="flex items-center gap-2 group"
            >
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => handleToggleTodo(todo.id)}
                className="w-4 h-4 rounded cursor-pointer"
              />
              <span
                className={`flex-1 text-sm ${
                  todo.done ? 'line-through text-gray-500' : 'text-gray-800'
                }`}
              >
                {todo.text}
              </span>
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:text-red-700"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {isAdding ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddTodo()
              if (e.key === 'Escape') {
                setIsAdding(false)
                setNewTodoText('')
              }
            }}
            placeholder="Todo item..."
            className="flex-1 px-2 py-1 text-xs bg-white bg-opacity-50 rounded border border-gray-400"
            autoFocus
          />
          <button
            onClick={handleAddTodo}
            className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
          >
            Add
          </button>
          <button
            onClick={() => {
              setIsAdding(false)
              setNewTodoText('')
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
          <Plus className="w-3 h-3" />
          Add Todo
        </button>
      )}
    </div>
  )
}
