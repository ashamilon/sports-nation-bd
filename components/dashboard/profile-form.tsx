"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Save,
  Camera,
  Eye,
  EyeOff
} from 'lucide-react'

export default function ProfileForm() {
  const { data: session } = useSession()
  const [showPassword, setShowPassword] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  // User data - will be populated from API
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    image: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoadingData(true)
        const response = await fetch('/api/user/profile')
        const data = await response.json()
        
        if (data.success) {
          setUserData({
            name: data.user.name || '',
            email: data.user.email || '',
            image: data.user.image || '',
            phone: data.user.phone || '',
            address: data.user.address || '',
            city: data.user.city || '',
            postalCode: data.user.postalCode || '',
            country: data.user.country || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          })
        } else {
          toast.error('Failed to load profile data')
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        toast.error('Failed to load profile data')
      } finally {
        setIsLoadingData(false)
      }
    }

    if (session?.user?.id) {
      fetchUserProfile()
    }
  }, [session?.user?.id])

  const handleInputChange = (field: string, value: string) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file')
      return
    }

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB')
      return
    }

    setIsUploadingImage(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/user/profile/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setUserData(prev => ({
          ...prev,
          image: data.user.image
        }))
        // Trigger sidebar refresh
        localStorage.setItem('profile-updated', Date.now().toString())
        toast.success('Profile image updated successfully!')
      } else {
        toast.error(data.error || 'Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image')
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          phone: userData.phone,
          address: userData.address,
          city: userData.city,
          country: userData.country,
          postalCode: userData.postalCode,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Profile updated successfully!')
        setIsEditing(false)
        // Clear password fields
        setUserData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }))
      } else {
        toast.error(data.message || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset form data to original values
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/user/profile')
        const data = await response.json()
        
        if (data.success) {
          setUserData({
            name: data.user.name || '',
            email: data.user.email || '',
            image: data.user.image || '',
            phone: data.user.phone || '',
            address: data.user.address || '',
            city: data.user.city || '',
            postalCode: data.user.postalCode || '',
            country: data.user.country || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          })
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      }
    }
    
    fetchUserProfile()
  }

  if (isLoadingData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profile data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 px-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your personal information and preferences</p>
        </div>
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="glass-button px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="glass-button px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="glass-button px-4 py-2 rounded-lg"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Picture */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-1"
        >
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-xl font-semibold text-foreground mb-6">Profile Picture</h2>
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center overflow-hidden ring-4 ring-white/20 shadow-lg">
                {userData.image ? (
                  <img
                    src={userData.image}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <span className="text-white font-bold text-4xl">
                    {userData.name ? userData.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isUploadingImage}
                />
                <button 
                  className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto disabled:opacity-50"
                  disabled={isUploadingImage}
                >
                  <Camera className="h-4 w-4" />
                  <span>{isUploadingImage ? 'Uploading...' : 'Change Photo'}</span>
                </button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                JPG, PNG or GIF. Max size 2MB.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Basic Information */}
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-xl font-semibold text-foreground mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={userData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!isEditing}
                    className="glass-input w-full pl-10 pr-4 py-2 rounded-lg disabled:opacity-50"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={userData.email}
                    disabled={true}
                    className="glass-input w-full pl-10 pr-4 py-2 rounded-lg opacity-50 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="tel"
                    value={userData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                    className="glass-input w-full pl-10 pr-4 py-2 rounded-lg disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-xl font-semibold text-foreground mb-6">Address Information</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <textarea
                    value={userData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    disabled={!isEditing}
                    rows={3}
                    className="glass-input w-full pl-10 pr-4 py-2 rounded-lg disabled:opacity-50"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={userData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    disabled={!isEditing}
                    className="glass-input w-full px-4 py-2 rounded-lg disabled:opacity-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={userData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    disabled={!isEditing}
                    className="glass-input w-full px-4 py-2 rounded-lg disabled:opacity-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={userData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    disabled={!isEditing}
                    className="glass-input w-full px-4 py-2 rounded-lg disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Password Change */}
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-card p-6 rounded-2xl"
            >
              <h2 className="text-xl font-semibold text-foreground mb-6">Change Password</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={userData.currentPassword}
                      onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                      className="glass-input w-full px-4 py-2 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={userData.newPassword}
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    className="glass-input w-full px-4 py-2 rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={userData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="glass-input w-full px-4 py-2 rounded-lg"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
