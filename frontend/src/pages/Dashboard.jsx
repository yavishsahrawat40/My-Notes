import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { notesAPI } from '../services/api'
import { FileText, Plus, Search, Filter } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'

function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalNotes: 0,
    completedNotes: 0,
    recentNotes: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch recent notes
      const recentResponse = await notesAPI.getNotes({ limit: 5 })
      const recentNotes = recentResponse.data.notes
      
      // Fetch all notes for stats
      const allResponse = await notesAPI.getNotes({ limit: 1000 })
      const allNotes = allResponse.data.notes
      
      const completedCount = allNotes.filter(note => note.isCompleted).length
      
      setStats({
        totalNotes: allNotes.length,
        completedNotes: completedCount,
        recentNotes: recentNotes
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="card card-hover">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-gray-600 text-lg">
              Here's what's happening with your notes today.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="h-20 w-20 bg-gradient-to-r from-primary-400 to-purple-400 rounded-3xl flex items-center justify-center floating">
              <FileText className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card card-hover animate-scale-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Notes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalNotes}</p>
            </div>
            <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <FileText className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <div className="card card-hover animate-scale-in" style={{animationDelay: '0.1s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Completed</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completedNotes}</p>
            </div>
            <div className="h-16 w-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/25">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card card-hover animate-scale-in" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Completion Rate</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalNotes > 0 ? Math.round((stats.completedNotes / stats.totalNotes) * 100) : 0}%
              </p>
            </div>
            <div className="h-16 w-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card animate-slide-up">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/notes"
            className="group flex items-center p-6 border border-gray-200 rounded-2xl hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:border-primary-200 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="h-12 w-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <span className="font-semibold text-gray-900">Create New Note</span>
          </Link>
          <Link
            to="/notes"
            className="group flex items-center p-6 border border-gray-200 rounded-2xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:border-blue-200 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
              <Search className="h-6 w-6 text-white" />
            </div>
            <span className="font-semibold text-gray-900">Search Notes</span>
          </Link>
          <Link
            to="/notes"
            className="group flex items-center p-6 border border-gray-200 rounded-2xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 hover:border-purple-200 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
              <Filter className="h-6 w-6 text-white" />
            </div>
            <span className="font-semibold text-gray-900">Filter Notes</span>
          </Link>
        </div>
      </div>

      {/* Recent Notes */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Notes</h2>
            <Link
              to="/notes"
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              View all
            </Link>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {stats.recentNotes.length > 0 ? (
            stats.recentNotes.map((note) => (
              <div key={note._id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {note.title}
                    </h3>
                    <p className="text-sm text-gray-500 truncate mt-1">
                      {note.content}
                    </p>
                    <div className="flex items-center mt-2 space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(note.priority)}`}>
                        {note.priority}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(note.createdAt)}
                      </span>
                    </div>
                  </div>
                  {note.isCompleted && (
                    <div className="ml-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-green-600 bg-green-100">
                        Completed
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No notes yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first note.
              </p>
              <div className="mt-6">
                <Link
                  to="/notes"
                  className="btn-primary"
                >
                  Create Note
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard