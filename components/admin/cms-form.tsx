"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Save } from 'lucide-react'
import toast from 'react-hot-toast'

interface CMSFormProps {
  type: 'content' | 'banner' | 'countdown'
  onSave: (data: any) => void
  onCancel: () => void
}

export default function CMSForm({ type, onSave, onCancel }: CMSFormProps) {
  const [formData, setFormData] = useState<any>({
    isActive: true,
    priority: 0
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (type === 'content' && (!formData.key || !formData.content)) {
      toast.error('Key and content are required')
      return
    }
    
    if (type === 'banner' && (!formData.title || !formData.image || !formData.position)) {
      toast.error('Title, image, and position are required')
      return
    }
    
    if (type === 'countdown' && (!formData.title || !formData.targetDate)) {
      toast.error('Title and target date are required')
      return
    }

    onSave(formData)
  }

  const renderContentForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Key (Unique identifier)</label>
        <Input
          placeholder="e.g., home_hero_title"
          value={formData.key || ''}
          onChange={(e) => setFormData({ ...formData, key: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <Input
          placeholder="Content title"
          value={formData.title || ''}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Content</label>
        <Textarea
          placeholder="Your content here..."
          value={formData.content || ''}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={4}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <Select value={formData.type || 'text'} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="html">HTML</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <Input
            placeholder="e.g., hero, footer"
            value={formData.category || ''}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />
        </div>
      </div>
    </div>
  )

  const renderBannerForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <Input
          placeholder="Banner title"
          value={formData.title || ''}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Textarea
          placeholder="Banner description"
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={2}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Image URL</label>
        <Input
          placeholder="https://example.com/banner.jpg"
          value={formData.image || ''}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Link URL (optional)</label>
        <Input
          placeholder="https://example.com"
          value={formData.link || ''}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Position</label>
          <Select value={formData.position || ''} onValueChange={(value) => setFormData({ ...formData, position: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="home_hero">Home Hero</SelectItem>
              <SelectItem value="home_top">Home Top</SelectItem>
              <SelectItem value="product_page">Product Page</SelectItem>
              <SelectItem value="category_page">Category Page</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Priority</label>
          <Input
            type="number"
            placeholder="0"
            value={formData.priority || 0}
            onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>
    </div>
  )

  const renderCountdownForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <Input
          placeholder="Countdown title"
          value={formData.title || ''}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Textarea
          placeholder="Countdown description"
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={2}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Target Date & Time</label>
        <Input
          type="datetime-local"
          value={formData.targetDate || ''}
          onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <Select value={formData.type || 'offer'} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="offer">Offer</SelectItem>
              <SelectItem value="product">Product</SelectItem>
              <SelectItem value="event">Event</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Position</label>
          <Select value={formData.position || 'home'} onValueChange={(value) => setFormData({ ...formData, position: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="home">Home</SelectItem>
              <SelectItem value="product">Product</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add New {type.charAt(0).toUpperCase() + type.slice(1)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'content' && renderContentForm()}
          {type === 'banner' && renderBannerForm()}
          {type === 'countdown' && renderCountdownForm()}
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
