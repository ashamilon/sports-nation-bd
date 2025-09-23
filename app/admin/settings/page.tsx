"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, 
  Save, 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Mail, 
  Phone,
  MapPin,
  Building,
  FileText,
  CreditCard,
  Truck,
  Database,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'

interface AdminSettings {
  // General Settings
  siteName: string
  siteDescription: string
  siteUrl: string
  adminEmail: string
  supportEmail: string
  supportPhone: string
  
  // Business Information
  businessName: string
  businessAddress: string
  businessCity: string
  businessCountry: string
  tradeLicense: string
  
  // Notification Settings
  emailNotifications: boolean
  smsNotifications: boolean
  orderNotifications: boolean
  stockNotifications: boolean
  
  // Security Settings
  twoFactorAuth: boolean
  sessionTimeout: number
  passwordPolicy: string
  
  // Payment Settings
  defaultCurrency: string
  paymentMethods: string[]
  
  // Shipping Settings
  defaultShippingMethod: string
  freeShippingThreshold: number
  
  // System Settings
  maintenanceMode: boolean
  debugMode: boolean
  cacheEnabled: boolean
}

const defaultSettings: AdminSettings = {
  siteName: 'Sports Nation BD',
  siteDescription: 'Premium Sports & Lifestyle Products',
  siteUrl: 'https://sportsnationbd.com',
  adminEmail: 'admin@sportsnationbd.com',
  supportEmail: 'info@sportsnationbd.com',
  supportPhone: '+880 1647 429992',
  
  businessName: 'Sports Nation BD',
  businessAddress: '4th Floor, Ananda City Center, Kandirpar',
  businessCity: 'Cumilla',
  businessCountry: 'Bangladesh',
  tradeLicense: '2101021100033934',
  
  emailNotifications: true,
  smsNotifications: true,
  orderNotifications: true,
  stockNotifications: true,
  
  twoFactorAuth: false,
  sessionTimeout: 30,
  passwordPolicy: 'strong',
  
  defaultCurrency: 'BDT',
  paymentMethods: ['sslcommerz', 'bkash', 'nagad', 'rocket'],
  
  defaultShippingMethod: 'pathao',
  freeShippingThreshold: 2000,
  
  maintenanceMode: false,
  debugMode: false,
  cacheEnabled: true
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AdminSettings>(defaultSettings)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  const tabs = [
    { id: 'general', name: 'General', icon: Globe },
    { id: 'business', name: 'Business', icon: Building },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'payment', name: 'Payment', icon: CreditCard },
    { id: 'shipping', name: 'Shipping', icon: Truck },
    { id: 'system', name: 'System', icon: Database }
  ]

  const handleInputChange = (field: keyof AdminSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Here you would typically save to your database
      console.log('Saving settings:', settings)
      
      toast.success('Settings saved successfully!')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Site Name
          </label>
          <input
            type="text"
            value={settings.siteName}
            onChange={(e) => handleInputChange('siteName', e.target.value)}
            className="glass-input w-full px-4 py-2 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Site URL
          </label>
          <input
            type="url"
            value={settings.siteUrl}
            onChange={(e) => handleInputChange('siteUrl', e.target.value)}
            className="glass-input w-full px-4 py-2 rounded-lg"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Site Description
        </label>
        <textarea
          value={settings.siteDescription}
          onChange={(e) => handleInputChange('siteDescription', e.target.value)}
          rows={3}
          className="glass-input w-full px-4 py-2 rounded-lg"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Admin Email
          </label>
          <input
            type="email"
            value={settings.adminEmail}
            onChange={(e) => handleInputChange('adminEmail', e.target.value)}
            className="glass-input w-full px-4 py-2 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Support Email
          </label>
          <input
            type="email"
            value={settings.supportEmail}
            onChange={(e) => handleInputChange('supportEmail', e.target.value)}
            className="glass-input w-full px-4 py-2 rounded-lg"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Support Phone
        </label>
        <input
          type="tel"
          value={settings.supportPhone}
          onChange={(e) => handleInputChange('supportPhone', e.target.value)}
          className="glass-input w-full px-4 py-2 rounded-lg"
        />
      </div>
    </div>
  )

  const renderBusinessSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Business Name
        </label>
        <input
          type="text"
          value={settings.businessName}
          onChange={(e) => handleInputChange('businessName', e.target.value)}
          className="glass-input w-full px-4 py-2 rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Business Address
        </label>
        <textarea
          value={settings.businessAddress}
          onChange={(e) => handleInputChange('businessAddress', e.target.value)}
          rows={3}
          className="glass-input w-full px-4 py-2 rounded-lg"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            City
          </label>
          <input
            type="text"
            value={settings.businessCity}
            onChange={(e) => handleInputChange('businessCity', e.target.value)}
            className="glass-input w-full px-4 py-2 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Country
          </label>
          <input
            type="text"
            value={settings.businessCountry}
            onChange={(e) => handleInputChange('businessCountry', e.target.value)}
            className="glass-input w-full px-4 py-2 rounded-lg"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Trade License
        </label>
        <input
          type="text"
          value={settings.tradeLicense}
          onChange={(e) => handleInputChange('tradeLicense', e.target.value)}
          className="glass-input w-full px-4 py-2 rounded-lg"
        />
      </div>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 glass-card rounded-lg">
          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-blue-500" />
            <div>
              <h3 className="font-medium text-foreground">Email Notifications</h3>
              <p className="text-sm text-muted-foreground">Receive notifications via email</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 glass-card rounded-lg">
          <div className="flex items-center space-x-3">
            <Phone className="h-5 w-5 text-green-500" />
            <div>
              <h3 className="font-medium text-foreground">SMS Notifications</h3>
              <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.smsNotifications}
              onChange={(e) => handleInputChange('smsNotifications', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 glass-card rounded-lg">
          <div className="flex items-center space-x-3">
            <Bell className="h-5 w-5 text-yellow-500" />
            <div>
              <h3 className="font-medium text-foreground">Order Notifications</h3>
              <p className="text-sm text-muted-foreground">Get notified about new orders</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.orderNotifications}
              onChange={(e) => handleInputChange('orderNotifications', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 glass-card rounded-lg">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <div>
              <h3 className="font-medium text-foreground">Stock Notifications</h3>
              <p className="text-sm text-muted-foreground">Get notified about low stock</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.stockNotifications}
              onChange={(e) => handleInputChange('stockNotifications', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 glass-card rounded-lg">
        <div className="flex items-center space-x-3">
          <Shield className="h-5 w-5 text-purple-500" />
          <div>
            <h3 className="font-medium text-foreground">Two-Factor Authentication</h3>
            <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.twoFactorAuth}
            onChange={(e) => handleInputChange('twoFactorAuth', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Session Timeout (minutes)
        </label>
        <input
          type="number"
          value={settings.sessionTimeout}
          onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
          className="glass-input w-full px-4 py-2 rounded-lg"
          min="5"
          max="120"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Password Policy
        </label>
        <select
          value={settings.passwordPolicy}
          onChange={(e) => handleInputChange('passwordPolicy', e.target.value)}
          className="glass-input w-full px-4 py-2 rounded-lg"
        >
          <option value="basic">Basic (6+ characters)</option>
          <option value="medium">Medium (8+ characters, numbers)</option>
          <option value="strong">Strong (8+ characters, numbers, symbols)</option>
        </select>
      </div>
    </div>
  )

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Default Currency
        </label>
        <select
          value={settings.defaultCurrency}
          onChange={(e) => handleInputChange('defaultCurrency', e.target.value)}
          className="glass-input w-full px-4 py-2 rounded-lg"
        >
          <option value="BDT">Bangladeshi Taka (BDT)</option>
          <option value="USD">US Dollar (USD)</option>
          <option value="EUR">Euro (EUR)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Payment Methods
        </label>
        <div className="space-y-2">
          {['sslcommerz', 'bkash', 'nagad', 'rocket', 'cash_on_delivery'].map((method) => (
            <label key={method} className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.paymentMethods.includes(method)}
                onChange={(e) => {
                  if (e.target.checked) {
                    handleInputChange('paymentMethods', [...settings.paymentMethods, method])
                  } else {
                    handleInputChange('paymentMethods', settings.paymentMethods.filter(m => m !== method))
                  }
                }}
                className="rounded border-gray-300"
              />
              <span className="text-foreground capitalize">{method.replace('_', ' ')}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  const renderShippingSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Default Shipping Method
        </label>
        <select
          value={settings.defaultShippingMethod}
          onChange={(e) => handleInputChange('defaultShippingMethod', e.target.value)}
          className="glass-input w-full px-4 py-2 rounded-lg"
        >
          <option value="pathao">Pathao</option>
          <option value="redx">RedX</option>
          <option value="e-courier">E-Courier</option>
          <option value="manual">Manual Delivery</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Free Shipping Threshold (BDT)
        </label>
        <input
          type="number"
          value={settings.freeShippingThreshold}
          onChange={(e) => handleInputChange('freeShippingThreshold', parseInt(e.target.value))}
          className="glass-input w-full px-4 py-2 rounded-lg"
          min="0"
        />
      </div>
    </div>
  )

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 glass-card rounded-lg">
        <div className="flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-orange-500" />
          <div>
            <h3 className="font-medium text-foreground">Maintenance Mode</h3>
            <p className="text-sm text-muted-foreground">Temporarily disable the site for maintenance</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.maintenanceMode}
            onChange={(e) => handleInputChange('maintenanceMode', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      <div className="flex items-center justify-between p-4 glass-card rounded-lg">
        <div className="flex items-center space-x-3">
          <Database className="h-5 w-5 text-blue-500" />
          <div>
            <h3 className="font-medium text-foreground">Debug Mode</h3>
            <p className="text-sm text-muted-foreground">Enable detailed error logging</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.debugMode}
            onChange={(e) => handleInputChange('debugMode', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      <div className="flex items-center justify-between p-4 glass-card rounded-lg">
        <div className="flex items-center space-x-3">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <div>
            <h3 className="font-medium text-foreground">Cache Enabled</h3>
            <p className="text-sm text-muted-foreground">Enable caching for better performance</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.cacheEnabled}
            onChange={(e) => handleInputChange('cacheEnabled', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings()
      case 'business':
        return renderBusinessSettings()
      case 'notifications':
        return renderNotificationSettings()
      case 'security':
        return renderSecuritySettings()
      case 'payment':
        return renderPaymentSettings()
      case 'shipping':
        return renderShippingSettings()
      case 'system':
        return renderSystemSettings()
      default:
        return renderGeneralSettings()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Settings className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Settings</h1>
            <p className="text-muted-foreground">Manage your website and system settings</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSaveSettings}
          disabled={saving}
          className="glass-button flex items-center space-x-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Save className="h-5 w-5" />
          )}
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="border-b border-border/50">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="glass-card p-6 rounded-lg"
      >
        {renderTabContent()}
      </motion.div>
    </div>
  )
}
