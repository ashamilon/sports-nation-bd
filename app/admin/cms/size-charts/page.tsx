"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Eye, EyeOff, Ruler } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import toast from 'react-hot-toast'

interface SizeChart {
  id: string
  key: string
  title: string | null
  content: string
  type: string
  category: string
  isActive: boolean
  metadata: string | null
  createdAt: string
  updatedAt: string
  fabricType?: string // Extracted from metadata
}

export default function SizeChartsManagement() {
  const [sizeCharts, setSizeCharts] = useState<SizeChart[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingChart, setEditingChart] = useState<SizeChart | null>(null)
  const [formData, setFormData] = useState({
    fabricType: '',
    title: '',
    content: '',
    isActive: true
  })

  useEffect(() => {
    fetchSizeCharts()
  }, [])

  const fetchSizeCharts = async () => {
    try {
      const response = await fetch('/api/cms/size-charts?active=false')
      const result = await response.json()
      
      if (result.success) {
        // Extract fabricType from metadata
        const chartsWithFabricType = result.data.map((chart: any) => {
          let fabricType = ''
          try {
            if (chart.metadata) {
              const metadata = JSON.parse(chart.metadata)
              fabricType = metadata.fabricType || ''
            }
          } catch (error) {
            console.error('Error parsing metadata:', error)
          }
          return {
            ...chart,
            fabricType
          }
        })
        setSizeCharts(chartsWithFabricType)
      } else {
        toast.error('Failed to fetch size charts')
      }
    } catch (error) {
      console.error('Error fetching size charts:', error)
      toast.error('Failed to fetch size charts')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.fabricType || !formData.content) {
      toast.error('Fabric type and content are required')
      return
    }

    try {
      const url = editingChart 
        ? `/api/cms/size-charts/${editingChart.id}`
        : '/api/cms/size-charts'
      
      const method = editingChart ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        toast.success(editingChart ? 'Size chart updated successfully' : 'Size chart created successfully')
        setShowForm(false)
        setEditingChart(null)
        setFormData({ fabricType: '', title: '', content: '', isActive: true })
        fetchSizeCharts()
      } else {
        toast.error(result.error || 'Failed to save size chart')
      }
    } catch (error) {
      console.error('Error saving size chart:', error)
      toast.error('Failed to save size chart')
    }
  }

  const handleEdit = (chart: SizeChart) => {
    setEditingChart(chart)
    setFormData({
      fabricType: chart.fabricType || '',
      title: chart.title || '',
      content: chart.content || '',
      isActive: chart.isActive
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this size chart?')) return

    try {
      const response = await fetch(`/api/cms/size-charts/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Size chart deleted successfully')
        fetchSizeCharts()
      } else {
        toast.error('Failed to delete size chart')
      }
    } catch (error) {
      console.error('Error deleting size chart:', error)
      toast.error('Failed to delete size chart')
    }
  }

  const toggleActive = async (chart: SizeChart) => {
    try {
      const response = await fetch(`/api/cms/size-charts/${chart.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...chart,
          isActive: !chart.isActive
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success(`Size chart ${!chart.isActive ? 'activated' : 'deactivated'}`)
        fetchSizeCharts()
      } else {
        toast.error('Failed to update size chart')
      }
    } catch (error) {
      console.error('Error updating size chart:', error)
      toast.error('Failed to update size chart')
    }
  }

  const resetForm = () => {
    setFormData({ fabricType: '', title: '', content: '', isActive: true })
    setEditingChart(null)
    setShowForm(false)
  }

  const sampleSizeChartContent = {
    type: 'structured',
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL'],
    measurements: [
      { 'Chest (inches)': '36', 'Length (inches)': '28' },
      { 'Chest (inches)': '38', 'Length (inches)': '29' },
      { 'Chest (inches)': '40', 'Length (inches)': '30' },
      { 'Chest (inches)': '42', 'Length (inches)': '31' },
      { 'Chest (inches)': '44', 'Length (inches)': '32' },
      { 'Chest (inches)': '46', 'Length (inches)': '33' },
      { 'Chest (inches)': '48', 'Length (inches)': '34' },
      { 'Chest (inches)': '50', 'Length (inches)': '35' }
    ]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Size Charts Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage size charts for different fabric types
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Size Chart
        </Button>
      </div>

      {/* Size Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sizeCharts.map((chart) => (
          <motion.div
            key={chart.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 rounded-lg"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Ruler className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{chart.title}</h3>
                  <p className="text-sm text-muted-foreground">{chart.fabricType}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleActive(chart)}
                  className={`p-1 rounded ${
                    chart.isActive 
                      ? 'text-green-600 hover:bg-green-50' 
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {chart.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => handleEdit(chart)}
                  className="p-1 text-primary hover:bg-primary/10 rounded"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(chart.id)}
                  className="p-1 text-destructive hover:bg-destructive/10 rounded"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground mb-3">
              {chart.content.length > 100 
                ? `${chart.content.substring(0, 100)}...` 
                : chart.content
              }
            </div>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Updated: {new Date(chart.updatedAt).toLocaleDateString()}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                chart.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {chart.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {sizeCharts.length === 0 && (
        <div className="text-center py-12">
          <Ruler className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No size charts found</h3>
          <p className="text-muted-foreground mb-4">
            Create your first size chart to help customers find the right fit
          </p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Size Chart
          </Button>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  {editingChart ? 'Edit Size Chart' : 'Add Size Chart'}
                </h2>
                <Button variant="ghost" onClick={resetForm}>
                  ×
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fabricType">Fabric Type *</Label>
                    <Select
                      value={formData.fabricType}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, fabricType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select fabric type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fan Version">Fan Version</SelectItem>
                        <SelectItem value="Player Version">Player Version</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Fan Version Size Chart"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="content">Size Chart Content *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Enter size chart content (HTML, JSON, or plain text)"
                    rows={8}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    You can use HTML, JSON structured data, or plain text. For structured data, use JSON format with sizes and measurements.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingChart ? 'Update Size Chart' : 'Create Size Chart'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>

              {/* Sample Content */}
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Sample JSON Structure:</h4>
                <pre className="text-xs text-muted-foreground overflow-x-auto">
                  {JSON.stringify(sampleSizeChartContent, null, 2)}
                </pre>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
