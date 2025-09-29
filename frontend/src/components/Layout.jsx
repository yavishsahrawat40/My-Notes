import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { User, FileText, Home, LogOut, Menu, X, Bell, Search } from 'lucide-react'
import { useState } from 'react'

function Layout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Notes', href: '/notes', icon: FileText },
    { name: 'Profile', href: '/profile', icon: User },
  ]

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="min-h-screen">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className={`fixed inset-y-0 left-0 flex w-80 flex-col glass-card border-r-0 rounded-r-3xl transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex h-20 items-center justify-between px-6">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold gradient-text">NotesApp</h1>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-xl hover:bg-white/20 transition-colors"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
          </div>
          <nav className="flex-1 space-y-2 px-6 py-6">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center px-4 py-4 text-sm font-semibold rounded-2xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25 transform scale-105'
                      : 'text-gray-600 hover:bg-white/30 hover:text-gray-900 hover:transform hover:scale-105'
                  }`}
                >
                  <Icon className="mr-4 h-6 w-6" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <div className="border-t border-white/20 p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-primary-500 to-purple-500 flex items-center justify-center shadow-lg">
                  <span className="text-lg font-bold text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-600">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-sm font-semibold text-red-600 rounded-2xl hover:bg-red-50 transition-all duration-200"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-grow glass-card border-r border-white/20 rounded-r-3xl m-4 mr-0">
          <div className="flex items-center h-20 px-6">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold gradient-text">NotesApp</h1>
            </div>
          </div>
          <nav className="flex-1 space-y-2 px-6 py-6">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-4 py-4 text-sm font-semibold rounded-2xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25 transform scale-105'
                      : 'text-gray-600 hover:bg-white/30 hover:text-gray-900 hover:transform hover:scale-105'
                  }`}
                >
                  <Icon className="mr-4 h-6 w-6" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <div className="border-t border-white/20 p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-primary-500 to-purple-500 flex items-center justify-center shadow-lg">
                  <span className="text-lg font-bold text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-600">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-sm font-semibold text-red-600 rounded-2xl hover:bg-red-50 transition-all duration-200"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-20 shrink-0 items-center gap-x-4 glass-card border-b border-white/20 px-4 shadow-lg sm:gap-x-6 sm:px-6 lg:px-8 m-4 mb-0 rounded-2xl">
          <button
            type="button"
            className="p-3 text-gray-700 lg:hidden rounded-xl hover:bg-white/20 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 items-center">
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <h2 className="text-2xl font-bold gradient-text">
                {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
              </h2>
            </div>
            <div className="flex items-center gap-4 ml-auto">
              <button className="p-2 text-gray-600 hover:text-gray-900 rounded-xl hover:bg-white/20 transition-colors">
                <Search className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 rounded-xl hover:bg-white/20 transition-colors relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout