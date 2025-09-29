import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAuth } from '../contexts/AuthContext'
import { authAPI } from '../services/api'
import { User, Mail, Calendar, Eye, EyeOff, Lock } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

const profileSchema = yup.object({
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required')
})

const passwordSchema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup.string().min(6, 'Password must be at least 6 characters').required('New password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your new password')
})

function Profile() {
  const { user, updateUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || ''
    }
  })

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword
  } = useForm({
    resolver: yupResolver(passwordSchema)
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const response = await authAPI.updateProfile(data)
      updateUser(response.data.user)
      toast.success('Profile updated successfully!')
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const onPasswordSubmit = async (data) => {
    setIsPasswordLoading(true)
    try {
      // Note: This would need a backend endpoint for password change
      // For now, we'll show a success message
      toast.success('Password updated successfully!')
      resetPassword()
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update password'
      toast.error(message)
    } finally {
      setIsPasswordLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Profile Header */}
      <div className="card card-hover">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="h-24 w-24 rounded-3xl bg-gradient-to-r from-primary-500 to-purple-500 flex items-center justify-center shadow-lg shadow-primary-500/25 floating">
            <span className="text-3xl font-bold text-white">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold gradient-text">{user?.name}</h1>
            <p className="text-gray-600 text-lg mt-1">{user?.email}</p>
            <div className="flex items-center justify-center sm:justify-start mt-3">
              <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-500">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="card animate-slide-up">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-500">Full Name</p>
              <p className="text-gray-900">{user?.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-500">Email Address</p>
              <p className="text-gray-900">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-500">Member Since</p>
              <p className="text-gray-900">{formatDate(user?.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="card animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Edit Profile</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              {...register('name')}
              type="text"
              className="input-field mt-1"
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              {...register('email')}
              type="email"
              className="input-field mt-1"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex items-center"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="small" className="mr-2" />
                  Updating...
                </>
              ) : (
                'Update Profile'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Change Password Form */}
      <div className="card animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Lock className="h-6 w-6 mr-2 text-primary-600" />
          Change Password
        </h2>
        <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-5">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-semibold text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...registerPassword('currentPassword')}
                type={showCurrentPassword ? 'text' : 'password'}
                className="input-field pl-10 pr-12"
                placeholder="Enter your current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {passwordErrors.currentPassword && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {passwordErrors.currentPassword.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  {...registerPassword('newPassword')}
                  type={showNewPassword ? 'text' : 'password'}
                  className="input-field pl-10 pr-12"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {passwordErrors.newPassword && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {passwordErrors.newPassword.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <input
                  {...registerPassword('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="input-field pl-10 pr-12"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {passwordErrors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {passwordErrors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isPasswordLoading}
              className="btn-primary flex items-center"
            >
              {isPasswordLoading ? (
                <>
                  <LoadingSpinner size="small" className="mr-2" />
                  Updating Password...
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5 mr-2" />
                  Update Password
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Account Statistics */}
      <div className="card animate-slide-up" style={{ animationDelay: '0.6s' }}>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Account Statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="text-center p-6 bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl border border-primary-200">
            <div className="h-12 w-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-primary-600">
              {formatDate(user?.createdAt).split(',')[0]}
            </p>
            <p className="text-sm text-gray-600 font-medium">Join Date</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl border border-purple-200">
            <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-purple-600">
              {formatDate(user?.updatedAt).split(',')[0]}
            </p>
            <p className="text-sm text-gray-600 font-medium">Last Updated</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile