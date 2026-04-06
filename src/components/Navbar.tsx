import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Menu, LogOut, User } from 'lucide-react'

interface NavbarProps {
  onMenuClick: () => void
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-neutral-200 backdrop-blur-sm bg-opacity-95">
      <div className="flex items-center justify-between px-4 lg:px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-neutral-100 rounded-lg"
          >
            <Menu className="w-6 h-6 text-neutral-700" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-primary-700">Mini Bank</h1>
            <p className="text-xs text-neutral-500">Professional Banking Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <>
              <div className="hidden md:flex items-center gap-3">
                {user.avatar && (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full border-2 border-primary-200"
                  />
                )}
                <div>
                  <p className="text-sm font-medium text-neutral-900">{user.name}</p>
                  <p className="text-xs text-neutral-500">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-600 transition-smooth"
                  title="Profile"
                >
                  <User className="w-5 h-5" />
                </button>
                <button
                  onClick={logout}
                  className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-smooth"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
