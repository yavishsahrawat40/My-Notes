function LoadingSpinner({ size = 'medium', className = '' }) {
  const sizeClasses = {
    small: 'h-5 w-5',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  }

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-200 border-t-primary-600 shadow-sm ${sizeClasses[size]} ${className}`} />
  )
}

export default LoadingSpinner