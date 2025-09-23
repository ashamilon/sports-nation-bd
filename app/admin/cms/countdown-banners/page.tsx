"use client"

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/admin-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Edit, Trash, Eye, EyeOff, Calendar, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import ImageUpload from '@/components/ui/image-upload'

interface CountdownBanner {
  id: string
  title: string
  subtitle?: string
  targetDate: string
  backgroundImage?: string
  isVisible: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export default function CountdownBannersCMS() {
  const [countdownBanners, setCountdownBanners] = useState<CountdownBanner[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<CountdownBanner | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    targetDate: '',
    backgroundImage: '',
    isVisible: true,
    sortOrder: 0
  })

  const fetchCountdownBanners = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/cms/countdown-banners')
      if (!response.ok) throw new Error('Failed to fetch countdown banners')
      const data = await response.json()
      setCountdownBanners(data.data || [])
    } catch (error) {
      console.error('Error fetching countdown banners:', error)
      toast.error('Failed to fetch countdown banners')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCountdownBanners()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted with data:', formData)
    
    // Basic validation
    if (!formData.title.trim()) {
      toast.error('Title is required')
      return
    }
    
    if (!formData.targetDate) {
      toast.error('Target date is required')
      return
    }
    
    // Ensure targetDate is properly formatted
    let targetDate = formData.targetDate
    if (targetDate) {
      // If the date doesn't have seconds, add them
      if (targetDate.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)) {
        targetDate += ':00'
      }
      // Convert to ISO string for consistency
      targetDate = new Date(targetDate).toISOString()
    }
    
    try {
      const url = editingBanner 
        ? `/api/cms/countdown-banners/${editingBanner.id}`
        : '/api/cms/countdown-banners'
      
      const method = editingBanner ? 'PUT' : 'POST'
      
      console.log('Sending request to:', url, 'with method:', method)
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          targetDate: targetDate
        })
      })

      console.log('Response status:', response.status)
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error:', errorText)
        throw new Error(`Failed to save countdown banner: ${response.status} ${errorText}`)
      }

      toast.success(`Countdown banner ${editingBanner ? 'updated' : 'created'} successfully!`)
      resetForm()
      fetchCountdownBanners()
    } catch (error) {
      console.error('Error saving countdown banner:', error)
      toast.error('Failed to save countdown banner')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this countdown banner?')) return

    try {
      const response = await fetch(`/api/cms/countdown-banners/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete countdown banner')

      toast.success('Countdown banner deleted successfully!')
      fetchCountdownBanners()
    } catch (error) {
      console.error('Error deleting countdown banner:', error)
      toast.error('Failed to delete countdown banner')
    }
  }

  const handleEdit = (banner: CountdownBanner) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      targetDate: new Date(banner.targetDate).toISOString().slice(0, 16),
      backgroundImage: banner.backgroundImage || '',
      isVisible: banner.isVisible,
      sortOrder: banner.sortOrder
    })
    setIsAddModalOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      targetDate: '',
      backgroundImage: '',
      isVisible: true,
      sortOrder: 0
    })
    setEditingBanner(null)
    setIsAddModalOpen(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getTimeRemaining = (targetDate: string) => {
    const now = new Date().getTime()
    const target = new Date(targetDate).getTime()
    const difference = target - now

    if (difference <= 0) return 'Expired'

    const days = Math.floor(difference / (1000 * 60 * 60 * 24))
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))

    return `${days}d ${hours}h ${minutes}m`
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading countdown banners...</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Countdown Banners Management</h1>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="mr-2 h-4 w-4" /> Add Countdown Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>
                {editingBanner ? 'Edit Countdown Banner' : 'Add New Countdown Banner'}
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto pr-2 pb-4">
              <form id="countdown-banner-form" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Limited Time Offer"
                  required
                />
              </div>

              <div>
                <Label htmlFor="subtitle">Subtitle</Label>
                <Textarea
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g., Don't miss out on our exclusive deals"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="targetDate">Target Date & Time *</Label>
                <Input
                  id="targetDate"
                  type="datetime-local"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="backgroundImage">Background Image</Label>
                <ImageUpload
                  value={formData.backgroundImage}
                  onChange={(url) => setFormData({ ...formData, backgroundImage: url })}
                  placeholder="https://example.com/countdown-banner.jpg"
                  folder="countdown-banners"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isVisible"
                  checked={formData.isVisible}
                  onCheckedChange={(checked) => setFormData({ ...formData, isVisible: checked })}
                />
                <Label htmlFor="isVisible">Visible on homepage</Label>
              </div>

              <div>
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingBanner ? 'Update' : 'Create'} Banner
                </Button>
              </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Target Date</TableHead>
              <TableHead>Time Remaining</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sort Order</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {countdownBanners.map((banner) => (
              <TableRow key={banner.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{banner.title}</div>
                    {banner.subtitle && (
                      <div className="text-sm text-gray-500">{banner.subtitle}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{formatDate(banner.targetDate)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`text-sm font-medium ${
                    getTimeRemaining(banner.targetDate) === 'Expired' 
                      ? 'text-red-600' 
                      : 'text-green-600'
                  }`}>
                    {getTimeRemaining(banner.targetDate)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    {banner.isVisible ? (
                      <Eye className="h-4 w-4 text-green-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                    <span className="text-sm">
                      {banner.isVisible ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{banner.sortOrder}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(banner)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(banner.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {countdownBanners.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No countdown banners found. Create your first banner to get started.
        </div>
      )}
    </AdminLayout>
  )
}
