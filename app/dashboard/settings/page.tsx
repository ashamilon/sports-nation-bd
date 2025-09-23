'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Bell, 
  Shield, 
  Key, 
  Save,
  Eye,
  EyeOff,
  Check,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface UserSettings {
  name: string;
  email: string;
  phone: string;
  country: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private';
    showEmail: boolean;
    showPhone: boolean;
  };
}

interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function DashboardSettings() {
  const { data: session, update } = useSession();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'privacy'>('profile');
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [settings, setSettings] = useState<UserSettings>({
    name: '',
    email: '',
    phone: '',
    country: '',
    notifications: {
      email: true,
      sms: true,
      push: true,
    },
    privacy: {
      profileVisibility: 'private',
      showEmail: false,
      showPhone: false,
    },
  });

  const [passwordChange, setPasswordChange] = useState<PasswordChange>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (session?.user) {
      setSettings(prev => ({
        ...prev,
        name: session.user.name || '',
        email: session.user.email || '',
        phone: '',
        country: '',
      }));
    }
  }, [session]);

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: settings.name,
          phone: settings.phone,
          country: settings.country,
        }),
      });

      if (response.ok) {
        await update();
        toast.success('Profile updated successfully!');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordChange.newPassword !== passwordChange.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordChange.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordChange),
      });

      if (response.ok) {
        toast.success('Password changed successfully!');
        setPasswordChange({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to change password');
      }
    } catch (error) {
      toast.error('Error changing password');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings.notifications),
      });

      if (response.ok) {
        toast.success('Notification preferences updated!');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to update notification preferences');
      }
    } catch (error) {
      toast.error('Error updating notification preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePrivacy = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/privacy', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings.privacy),
      });

      if (response.ok) {
        toast.success('Privacy settings updated!');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to update privacy settings');
      }
    } catch (error) {
      toast.error('Error updating privacy settings');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Key },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FEFEFE] to-[#E7E9F0] p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
          <p className="text-gray-600">Manage your account preferences and security settings</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                          : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <User className="text-blue-500" size={24} />
                    <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={settings.name}
                        onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="email"
                          value={settings.email}
                          disabled
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="tel"
                          value={settings.phone}
                          onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="text"
                          value={settings.country}
                          onChange={(e) => setSettings(prev => ({ ...prev, country: e.target.value }))}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter your country"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                    >
                      <Save size={20} />
                      <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <Shield className="text-green-500" size={24} />
                    <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={passwordChange.currentPassword}
                          onChange={(e) => setPasswordChange(prev => ({ ...prev, currentPassword: e.target.value }))}
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordChange.newPassword}
                          onChange={(e) => setPasswordChange(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={passwordChange.confirmPassword}
                          onChange={(e) => setPasswordChange(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleChangePassword}
                      disabled={loading}
                      className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                    >
                      <Key size={20} />
                      <span>{loading ? 'Updating...' : 'Update Password'}</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <Bell className="text-yellow-500" size={24} />
                    <h2 className="text-2xl font-bold text-gray-900">Notification Preferences</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-white/20">
                      <div>
                        <h3 className="font-medium text-gray-900">Email Notifications</h3>
                        <p className="text-sm text-gray-600">Receive updates via email</p>
                      </div>
                      <button
                        onClick={() => setSettings(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, email: !prev.notifications.email }
                        }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.notifications.email ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.notifications.email ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-white/20">
                      <div>
                        <h3 className="font-medium text-gray-900">SMS Notifications</h3>
                        <p className="text-sm text-gray-600">Receive updates via SMS</p>
                      </div>
                      <button
                        onClick={() => setSettings(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, sms: !prev.notifications.sms }
                        }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.notifications.sms ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.notifications.sms ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-white/20">
                      <div>
                        <h3 className="font-medium text-gray-900">Push Notifications</h3>
                        <p className="text-sm text-gray-600">Receive push notifications</p>
                      </div>
                      <button
                        onClick={() => setSettings(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, push: !prev.notifications.push }
                        }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.notifications.push ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.notifications.push ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveNotifications}
                      disabled={loading}
                      className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-3 rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                    >
                      <Save size={20} />
                      <span>{loading ? 'Saving...' : 'Save Preferences'}</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <Key className="text-purple-500" size={24} />
                    <h2 className="text-2xl font-bold text-gray-900">Privacy Settings</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-white/50 rounded-xl border border-white/20">
                      <h3 className="font-medium text-gray-900 mb-2">Profile Visibility</h3>
                      <p className="text-sm text-gray-600 mb-4">Control who can see your profile information</p>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="profileVisibility"
                            value="public"
                            checked={settings.privacy.profileVisibility === 'public'}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              privacy: { ...prev.privacy, profileVisibility: e.target.value as 'public' | 'private' }
                            }))}
                            className="text-blue-500 focus:ring-blue-500"
                          />
                          <span className="text-gray-700">Public - Anyone can see your profile</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="profileVisibility"
                            value="private"
                            checked={settings.privacy.profileVisibility === 'private'}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              privacy: { ...prev.privacy, profileVisibility: e.target.value as 'public' | 'private' }
                            }))}
                            className="text-blue-500 focus:ring-blue-500"
                          />
                          <span className="text-gray-700">Private - Only you can see your profile</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-white/20">
                      <div>
                        <h3 className="font-medium text-gray-900">Show Email Address</h3>
                        <p className="text-sm text-gray-600">Display your email on your profile</p>
                      </div>
                      <button
                        onClick={() => setSettings(prev => ({
                          ...prev,
                          privacy: { ...prev.privacy, showEmail: !prev.privacy.showEmail }
                        }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.privacy.showEmail ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.privacy.showEmail ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-white/20">
                      <div>
                        <h3 className="font-medium text-gray-900">Show Phone Number</h3>
                        <p className="text-sm text-gray-600">Display your phone number on your profile</p>
                      </div>
                      <button
                        onClick={() => setSettings(prev => ({
                          ...prev,
                          privacy: { ...prev.privacy, showPhone: !prev.privacy.showPhone }
                        }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.privacy.showPhone ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.privacy.showPhone ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleSavePrivacy}
                      disabled={loading}
                      className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                    >
                      <Save size={20} />
                      <span>{loading ? 'Saving...' : 'Save Privacy Settings'}</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
