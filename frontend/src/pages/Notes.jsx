import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { notesAPI } from '../services/api'
import { Plus, Search, Filter, Edit, Trash2, X } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'

// Validation schema
const noteSchema = yup.object({
    title: yup.string().required('Title is required').max(100, 'Title must be less than 100 characters'),
    content: yup.string().required('Content is required').max(5000, 'Content must be less than 5000 characters'),
    category: yup.string().oneOf(['personal', 'work', 'ideas', 'todo', 'other'], 'Invalid category'),
    priority: yup.string().oneOf(['low', 'medium', 'high'], 'Invalid priority'),
    tags: yup.array().of(yup.string().max(20, 'Tag must be less than 20 characters'))
})

function Notes() {
    const [notes, setNotes] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')
    const [selectedPriority, setSelectedPriority] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [editingNote, setEditingNote] = useState(null)
    const [tagInput, setTagInput] = useState('')
    const [currentTags, setCurrentTags] = useState([])

    const categories = ['personal', 'work', 'ideas', 'todo', 'other']
    const priorities = ['low', 'medium', 'high']

    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
        resolver: yupResolver(noteSchema)
    })

    // Fetch notes on component mount
    useEffect(() => {
        fetchNotes()
    }, [])

    // Reset form when modal closes
    useEffect(() => {
        if (!showModal) {
            setCurrentTags([])
            setTagInput('')
        }
    }, [showModal])

    const fetchNotes = async () => {
        try {
            setLoading(true)
            const response = await notesAPI.getNotes()
            setNotes(response.data.notes || response.data)
        } catch (error) {
            console.error('Error fetching notes:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateNote = async (data) => {
        try {
            const noteData = { ...data, tags: currentTags }
            const response = await notesAPI.createNote(noteData)
            setNotes([response.data.note, ...notes])
            setShowModal(false)
            reset()
            setCurrentTags([])
        } catch (error) {
            console.error('Error creating note:', error)
        }
    }

    const handleUpdateNote = async (data) => {
        try {
            const noteData = { ...data, tags: currentTags }
            const response = await notesAPI.updateNote(editingNote._id, noteData)
            setNotes(notes.map(note =>
                note._id === editingNote._id ? response.data.note : note
            ))
            setShowModal(false)
            setEditingNote(null)
            reset()
            setCurrentTags([])
        } catch (error) {
            console.error('Error updating note:', error)
        }
    }

    const handleDeleteNote = async (noteId) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            try {
                await notesAPI.deleteNote(noteId)
                setNotes(notes.filter(note => note._id !== noteId))
            } catch (error) {
                console.error('Error deleting note:', error)
            }
        }
    }

    const openEditModal = (note) => {
        setEditingNote(note)
        setValue('title', note.title)
        setValue('content', note.content)
        setValue('category', note.category || '')
        setValue('priority', note.priority || 'medium')
        setCurrentTags(note.tags || [])
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setEditingNote(null)
        reset()
        setCurrentTags([])
        setTagInput('')
    }

    const addTag = () => {
        if (tagInput.trim() && !currentTags.includes(tagInput.trim()) && currentTags.length < 5) {
            setCurrentTags([...currentTags, tagInput.trim()])
            setTagInput('')
        }
    }

    const removeTag = (tagToRemove) => {
        setCurrentTags(currentTags.filter(tag => tag !== tagToRemove))
    }

    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            addTag()
        }
    }

    const onSubmit = (data) => {
        if (editingNote) {
            handleUpdateNote(data)
        } else {
            handleCreateNote(data)
        }
    }

    // Filter notes based on search term, category, and priority
    const filteredNotes = notes.filter(note => {
        const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
        const matchesCategory = !selectedCategory || note.category === selectedCategory
        const matchesPriority = !selectedPriority || note.priority === selectedPriority
        return matchesSearch && matchesCategory && matchesPriority
    })

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="large" />
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold gradient-text">My Notes</h1>
                    <p className="text-gray-600 mt-2">Organize your thoughts and ideas</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary flex items-center gap-3 text-lg pulse-glow"
                >
                    <Plus className="h-6 w-6" />
                    New Note
                </button>
            </div>

            {/* Search and Filter */}
            <div className="card">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Search notes, tags, content..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field pl-12"
                        />
                    </div>
                    <div className="flex gap-4">
                        <div className="relative">
                            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="input-field pl-12 pr-8 min-w-[150px]"
                            >
                                <option value="">All Categories</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="relative">
                            <select
                                value={selectedPriority}
                                onChange={(e) => setSelectedPriority(e.target.value)}
                                className="input-field pr-8 min-w-[140px]"
                            >
                                <option value="">All Priorities</option>
                                {priorities.map(priority => (
                                    <option key={priority} value={priority}>
                                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notes Grid */}
            {filteredNotes.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-500 text-lg">
                        {notes.length === 0 ? 'No notes yet. Create your first note!' : 'No notes match your search.'}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNotes.map((note, index) => (
                        <div key={note._id} className="card card-hover animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-lg font-semibold text-gray-900 truncate">{note.title}</h3>
                                <div className="flex gap-2 ml-2">
                                    <button
                                        onClick={() => openEditModal(note)}
                                        className="text-gray-400 hover:text-primary-600 transition-colors"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteNote(note._id)}
                                        className="text-gray-400 hover:text-red-600 transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-3">
                                {note.category && (
                                    <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                                        {note.category}
                                    </span>
                                )}
                                {note.priority && (
                                    <span className={`inline-block text-xs px-2 py-1 rounded-full ${note.priority === 'high' ? 'bg-red-100 text-red-800' :
                                        note.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-green-100 text-green-800'
                                        }`}>
                                        {note.priority}
                                    </span>
                                )}
                                {note.tags && note.tags.map(tag => (
                                    <span key={tag} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                                {note.content}
                            </p>

                            <div className="text-xs text-gray-400">
                                {new Date(note.updatedAt).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-xl font-semibold">
                                {editingNote ? 'Edit Note' : 'Create New Note'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    {...register('title')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="Enter note title"
                                />
                                {errors.title && (
                                    <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Category
                                    </label>
                                    <select
                                        {...register('category')}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                                    >
                                        <option value="">Select category</option>
                                        {categories.map(category => (
                                            <option key={category} value={category}>
                                                {category.charAt(0).toUpperCase() + category.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category && (
                                        <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Priority
                                    </label>
                                    <select
                                        {...register('priority')}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                                    >
                                        {priorities.map(priority => (
                                            <option key={priority} value={priority}>
                                                {priority.charAt(0).toUpperCase() + priority.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.priority && (
                                        <p className="text-red-600 text-sm mt-1">{errors.priority.message}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tags
                                </label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {currentTags.map(tag => (
                                        <span key={tag} className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded-full">
                                            #{tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={handleTagKeyDown}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="Add a tag..."
                                        maxLength={20}
                                    />
                                    <button
                                        type="button"
                                        onClick={addTag}
                                        disabled={!tagInput.trim() || currentTags.length >= 5}
                                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 rounded-lg transition-colors"
                                    >
                                        Add
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Press Enter or click Add to add tags (max 5)</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Content *
                                </label>
                                <textarea
                                    {...register('content')}
                                    rows={8}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-vertical"
                                    placeholder="Write your note content here..."
                                />
                                {errors.content && (
                                    <p className="text-red-600 text-sm mt-1">{errors.content.message}</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                                >
                                    {editingNote ? 'Update Note' : 'Create Note'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Notes