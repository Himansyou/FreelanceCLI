import { useState } from 'react'
import { useAuth } from '../auth'
import { useNavigate } from 'react-router-dom'

export default function TopBar({ onMenuToggle }: { onMenuToggle: () => void }) {
  const { username } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/sessions?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="flex items-center justify-between px-4 md:px-8 py-4 w-full sticky top-0 z-40 bg-[rgba(14,14,14,0.8)] dark:bg-[rgba(14,14,14,0.8)] rounded-b-[2rem] backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-surface-container-highest text-on-surface hover:bg-surface-variant transition-colors"
          aria-label="Open menu"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <form onSubmit={handleSearch} className="flex items-center bg-surface-container-highest rounded-2xl px-4 py-2 w-48 sm:w-72 md:w-96 transition-all focus-within:ring-1 focus-within:ring-primary/30">
          <span className="material-symbols-outlined text-on-surface-variant mr-3" data-icon="search">search</span>
          <input
            className="bg-transparent border-none focus:ring-0 text-sm w-full text-on-surface outline-none"
            placeholder="Search sessions..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-surface-container-highest rounded-full px-4 py-2">
          <span className="material-symbols-outlined text-primary text-lg">account_circle</span>
          <span className="text-sm font-semibold text-on-surface hidden sm:inline">Hey, {username || 'User'}</span>
        </div>
      </div>
    </header>
  );
}
