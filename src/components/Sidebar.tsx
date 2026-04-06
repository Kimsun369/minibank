import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Send, Plus, Minus, History, X } from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation()

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/transactions', label: 'Transactions', icon: History },
    { path: '/transfer', label: 'Transfer', icon: Send },
    { path: '/deposit', label: 'Deposit', icon: Plus },
    { path: '/withdraw', label: 'Withdraw', icon: Minus },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative left-0 top-0 h-screen w-64 bg-white border-r border-neutral-200 transition-transform lg:translate-x-0 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <h2 className="text-lg font-bold text-primary-700">Navigation</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 hover:bg-neutral-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-smooth ${
                  active
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-neutral-200 bg-neutral-50">
          <p className="text-xs text-neutral-500">
            Mini Bank v1.0
          </p>
          <p className="text-xs text-neutral-400 mt-1">
            Professional Banking Dashboard
          </p>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
