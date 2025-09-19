"use client"

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/admin-layout'
import toast from 'react-hot-toast'
import { Package, Eye, EyeOff, ToggleLeft, ToggleRight } from 'lucide-react'

interface SiteContent {
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
}

interface Banner {
  id: string
  title: string
  description: string | null
  image: string
  link: string | null
  position: string
  priority: number
  isActive: boolean
  startsAt: string | null
  expiresAt: string | null
  metadata: string | null
  createdAt: string
  updatedAt: string
}

interface CountdownTimer {
  id: string
  title: string
  description: string | null
  targetDate: string
  type: string
  targetId: string | null
  isActive: boolean
  position: string
  priority: number
  metadata: string | null
  createdAt: string
  updatedAt: string
}

interface Page {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  metaTitle: string | null
  metaDescription: string | null
  metaKeywords: string | null
  template: string
  isPublished: boolean
  publishedAt: string | null
  authorId: string | null
  createdAt: string
  updatedAt: string
}

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  featuredImage: string | null
  metaTitle: string | null
  metaDescription: string | null
  metaKeywords: string | null
  isPublished: boolean
  publishedAt: string | null
  authorId: string | null
  category: string | null
  tags: string | null
  viewCount: number
  isFeatured: boolean
  createdAt: string
  updatedAt: string
}

interface Testimonial {
  id: string
  name: string
  email: string | null
  company: string | null
  position: string | null
  content: string
  rating: number
  avatar: string | null
  isActive: boolean
  isFeatured: boolean
  order: number
  createdAt: string
  updatedAt: string
}

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface HomepageSetting {
  id: string
  sectionKey: string
  sectionName: string
  isVisible: boolean
  sortOrder: number
  metadata: string | null
  createdAt: string
  updatedAt: string
}

export default function CMSPage() {
  const [activeTab, setActiveTab] = useState('content')
  const [siteContent, setSiteContent] = useState<SiteContent[]>([])
  const [banners, setBanners] = useState<Banner[]>([])
  const [countdowns, setCountdowns] = useState<CountdownTimer[]>([])
  const [pages, setPages] = useState<Page[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [homepageSettings, setHomepageSettings] = useState<HomepageSetting[]>([])
  const [loading, setLoading] = useState(true)
  
  // Modal states
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('')
  const [editingItem, setEditingItem] = useState<any>(null)
  
  // Form states
  const [formData, setFormData] = useState<any>({})

  useEffect(() => {
    fetchData()
  }, [])

  // Modal and form handlers
  const openModal = (type: string, item: any = null) => {
    setModalType(type)
    setEditingItem(item)
    setShowModal(true)
    
    // Initialize form data based on type
    if (item) {
      setFormData(item)
    } else {
      setFormData(getDefaultFormData(type))
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setModalType('')
    setEditingItem(null)
    setFormData({})
  }

  const getDefaultFormData = (type: string) => {
    switch (type) {
      case 'content':
        return { key: '', title: '', content: '', type: 'text', category: 'general', isActive: true }
      case 'banner':
        return { title: '', description: '', image: '', link: '', position: 'home_top', priority: 1, isActive: true }
      case 'countdown':
        return { title: '', description: '', targetDate: '', type: 'general', position: 'home', priority: 1, isActive: true }
      case 'page':
        return { title: '', slug: '', content: '', excerpt: '', template: 'default', isPublished: false }
      case 'blog':
        return { title: '', slug: '', content: '', excerpt: '', category: '', isPublished: false, isFeatured: false }
      case 'testimonial':
        return { name: '', email: '', company: '', position: '', content: '', rating: 5, isActive: true, isFeatured: false, order: 0 }
      case 'faq':
        return { question: '', answer: '', category: 'general', isActive: true, order: 0 }
      default:
        return {}
    }
  }

  const handleBannerImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('file', file)

      // Upload file to server
      const response = await fetch('/api/admin/banners/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        // Update form data with uploaded image URL
        setFormData((prev: any) => ({ ...prev, image: data.file.url }))
        toast.success('Banner image uploaded successfully')
      } else {
        toast.error(data.error || 'Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading banner image:', error)
      toast.error('Failed to upload image')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Client-side validation for banner
    if (modalType === 'banner') {
      if (!formData.title?.trim()) {
        toast.error('Please enter a title')
        return
      }
      if (!formData.image?.trim()) {
        toast.error('Please upload an image or provide an image URL')
        return
      }
      if (!formData.position?.trim()) {
        toast.error('Please select a position')
        return
      }
    }
    
    // Client-side validation for countdown
    if (modalType === 'countdown') {
      if (!formData.title?.trim()) {
        toast.error('Please enter a title')
        return
      }
      if (!formData.targetDate?.trim()) {
        toast.error('Please select a target date')
        return
      }
    }
    
    // Client-side validation for content
    if (modalType === 'content') {
      if (!formData.key?.trim()) {
        toast.error('Please enter a key')
        return
      }
      if (!formData.content?.trim()) {
        toast.error('Please enter content')
        return
      }
    }
    
    try {
      console.log('Submitting form data:', formData)
      const url = editingItem 
        ? `/api/cms/${modalType}s/${editingItem.id}`
        : `/api/cms/${modalType}s`
      
      const method = editingItem ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('API Error:', errorData)
        throw new Error(errorData.error || 'Failed to save')
      }
      
      toast.success(editingItem ? 'Updated successfully!' : 'Created successfully!')
      closeModal()
      fetchData() // Refresh data
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save')
      console.error(error)
    }
  }

  const handleDelete = async (type: string, id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    
    try {
      const response = await fetch(`/api/cms/${type}s/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete')
      
      toast.success('Deleted successfully!')
      fetchData() // Refresh data
    } catch (error) {
      toast.error('Failed to delete')
      console.error(error)
    }
  }

  const handleToggleActive = async (type: string, id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/cms/${type}s/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      })
      
      if (!response.ok) throw new Error('Failed to update status')
      
      toast.success(`${type} ${!currentStatus ? 'activated' : 'deactivated'} successfully!`)
      fetchData() // Refresh data
    } catch (error) {
      toast.error('Failed to update status')
      console.error(error)
    }
  }

  const handleToggleHomepageSection = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/cms/homepage-settings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisible: !currentStatus })
      })
      
      if (!response.ok) throw new Error('Failed to update section visibility')
      
      toast.success(`Section ${!currentStatus ? 'shown' : 'hidden'} successfully!`)
      fetchData() // Refresh data
    } catch (error) {
      toast.error('Failed to update section visibility')
      console.error(error)
    }
  }

  const ToggleButton = ({ isActive, onToggle, type }: { isActive: boolean, onToggle: () => void, type: string }) => (
    <button
      onClick={onToggle}
      className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
        isActive 
          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
      title={`${isActive ? 'Hide' : 'Show'} ${type} on website`}
    >
      {isActive ? (
        <>
          <Eye className="h-4 w-4" />
          <span>Visible</span>
        </>
      ) : (
        <>
          <EyeOff className="h-4 w-4" />
          <span>Hidden</span>
        </>
      )}
    </button>
  )

  const fetchData = async () => {
    try {
      const [
        contentRes, 
        bannersRes, 
        countdownsRes,
        pagesRes,
        blogRes,
        testimonialsRes,
        faqRes,
        homepageSettingsRes
      ] = await Promise.all([
        fetch('/api/cms/content?all=true'),
        fetch('/api/cms/banners?active=false'), // Get all banners (active and inactive)
        fetch('/api/cms/countdowns?active=false'), // Get all countdowns (active and inactive)
        fetch('/api/cms/pages'),
        fetch('/api/cms/blog'),
        fetch('/api/cms/testimonials?active=false'), // Get all testimonials (active and inactive)
        fetch('/api/cms/faq?active=false'), // Get all FAQs (active and inactive)
        fetch('/api/cms/homepage-settings')
      ])

      const [
        contentData, 
        bannersData, 
        countdownsData,
        pagesData,
        blogData,
        testimonialsData,
        faqData,
        homepageSettingsData
      ] = await Promise.all([
        contentRes.json(),
        bannersRes.json(),
        countdownsRes.json(),
        pagesRes.json(),
        blogRes.json(),
        testimonialsRes.json(),
        faqRes.json(),
        homepageSettingsRes.json()
      ])

      if (contentData.success) setSiteContent(contentData.data)
      if (bannersData.success) {
        console.log('Banners data received:', bannersData.data)
        setBanners(bannersData.data)
      } else {
        console.log('Banners data error:', bannersData)
      }
      if (countdownsData.success) setCountdowns(countdownsData.data)
      if (pagesData.success) setPages(pagesData.data)
      if (blogData.success) setBlogPosts(blogData.data)
      if (testimonialsData.success) setTestimonials(testimonialsData.data)
      if (faqData.success) setFaqs(faqData.data)
      if (homepageSettingsData.success) setHomepageSettings(homepageSettingsData.data)
    } catch (error) {
      console.error('Error fetching CMS data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading CMS data...</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Content Management System</h1>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {[
              { id: 'content', name: 'Site Content' },
              { id: 'pages', name: 'Pages' },
              { id: 'blog', name: 'Blog Posts' },
              { id: 'banners', name: 'Banners' },
              { id: 'countdowns', name: 'Countdowns' },
              { id: 'testimonials', name: 'Testimonials' },
              { id: 'faq', name: 'FAQs' },
              { id: 'badges', name: 'Football Badges' },
              { id: 'collections', name: 'Collections' },
              { id: 'homepage', name: 'Homepage Sections' },
              { id: 'menu-config', name: 'Menu Configuration' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-foreground">Site Content</h2>
              <button 
                onClick={() => openModal('content')}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90"
              >
                Add New Content
              </button>
            </div>
            <div className="grid gap-4">
              {siteContent.map((content) => (
                <div key={content.id} className="border border-border bg-card rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{content.title || content.key}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{content.category}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {content.content.length > 100 
                          ? `${content.content.substring(0, 100)}...` 
                          : content.content
                        }
                      </p>
                      <div className="mt-3">
                        <ToggleButton
                          isActive={content.isActive}
                          onToggle={() => handleToggleActive('content', content.id, content.isActive)}
                          type="content"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button 
                        onClick={() => openModal('content', content)}
                        className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded border border-blue-200 hover:bg-blue-50"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete('content', content.id)}
                        className="text-red-600 hover:text-red-800 px-3 py-1 rounded border border-red-200 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pages Tab */}
        {activeTab === 'pages' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Pages ({pages.length})</h2>
              <button 
                onClick={() => openModal('page')}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90"
              >
                Add New Page
              </button>
            </div>
            <div className="grid gap-4">
              {pages.map((page) => (
                <div key={page.id} className="border border-border bg-card rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-foreground">{page.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">/{page.slug}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {page.excerpt || page.content.substring(0, 100) + '...'}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          page.isPublished ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
                        }`}>
                          {page.isPublished ? 'Published' : 'Draft'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(page.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => openModal('page', page)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete('page', page.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Blog Tab */}
        {activeTab === 'blog' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Blog Posts ({blogPosts.length})</h2>
              <button 
                onClick={() => openModal('blog')}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90"
              >
                Add New Post
              </button>
            </div>
            <div className="grid gap-4">
              {blogPosts.map((post) => (
                <div key={post.id} className="border border-border bg-card rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-foreground">{post.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">/{post.slug}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {post.excerpt || post.content.substring(0, 100) + '...'}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          post.isPublished ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
                        }`}>
                          {post.isPublished ? 'Published' : 'Draft'}
                        </span>
                        {post.isFeatured && (
                          <span className="px-2 py-1 rounded text-xs bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400">
                            Featured
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {post.viewCount} views
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => openModal('blog', post)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete('blog', post.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Banners Tab */}
        {activeTab === 'banners' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Banners ({banners.length})</h2>
              <button 
                onClick={() => openModal('banner')}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90"
              >
                Add New Banner
              </button>
            </div>
            <div className="grid gap-4">
              {banners.map((banner) => (
                <div key={banner.id} className="border border-border bg-card rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{banner.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">Position: {banner.position}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {banner.description || 'No description'}
                      </p>
                      <div className="mt-3">
                        <ToggleButton
                          isActive={banner.isActive}
                          onToggle={() => handleToggleActive('banner', banner.id, banner.isActive)}
                          type="banner"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button 
                        onClick={() => openModal('banner', banner)}
                        className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded border border-blue-200 hover:bg-blue-50"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete('banner', banner.id)}
                        className="text-red-600 hover:text-red-800 px-3 py-1 rounded border border-red-200 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Countdowns Tab */}
        {activeTab === 'countdowns' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Countdown Timers ({countdowns.length})</h2>
              <button 
                onClick={() => openModal('countdown')}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90"
              >
                Add New Countdown
              </button>
            </div>
            <div className="grid gap-4">
              {countdowns.map((countdown) => (
                <div key={countdown.id} className="border border-border bg-card rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-foreground">{countdown.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">Type: {countdown.type}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Target Date: {new Date(countdown.targetDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => openModal('countdown', countdown)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete('countdown', countdown.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Testimonials Tab */}
        {activeTab === 'testimonials' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Testimonials ({testimonials.length})</h2>
              <button 
                onClick={() => openModal('testimonial')}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90"
              >
                Add New Testimonial
              </button>
            </div>
            <div className="grid gap-4">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="border border-border bg-card rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-foreground">{testimonial.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {testimonial.company && `${testimonial.company} • `}
                        {testimonial.position}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {testimonial.content.substring(0, 100)}...
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-yellow-400 ${
                              i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}>
                              ★
                            </span>
                          ))}
                        </div>
                        {testimonial.isFeatured && (
                          <span className="px-2 py-1 rounded text-xs bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => openModal('testimonial', testimonial)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete('testimonial', testimonial.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">FAQs ({faqs.length})</h2>
              <button 
                onClick={() => openModal('faq')}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90"
              >
                Add New FAQ
              </button>
            </div>
            <div className="grid gap-4">
              {faqs.map((faq) => (
                <div key={faq.id} className="border border-border bg-card rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-foreground">{faq.question}</h3>
                      <p className="text-sm text-muted-foreground mt-1">Category: {faq.category}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {faq.answer.substring(0, 100)}...
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => openModal('faq', faq)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete('faq', faq.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Badges Tab */}
        {activeTab === 'badges' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Football Badges</h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => window.open('/admin/badges-simple', '_blank')}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90"
                >
                  Manage Badges
                </button>
              </div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Football Badge Management</h3>
              <p className="text-muted-foreground mb-4">
                Create and manage football badges for product customization. Add team badges, tournament logos, and custom designs.
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Create unlimited football badges</p>
                <p>• Upload custom badge images</p>
                <p>• Set prices and categories</p>
                <p>• Use badges in product customization</p>
              </div>
              <button 
                onClick={() => window.open('/admin/badges-simple', '_blank')}
                className="mt-4 bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90"
              >
                Open Badge Manager
              </button>
            </div>
          </div>
        )}

        {/* Collections Tab */}
        {activeTab === 'collections' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Collections</h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => window.open('/admin/cms/collections', '_blank')}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90"
                >
                  Manage Collections
                </button>
              </div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Collection Management</h3>
              <p className="text-muted-foreground mb-4">
                Create and manage product collections, sub-collections, and organize your products into custom groups.
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Create unlimited collections and sub-collections</p>
                <p>• Add products to multiple collections</p>
                <p>• Set featured products within collections</p>
                <p>• Organize products with custom sorting</p>
              </div>
              <button 
                onClick={() => window.open('/admin/cms/collections', '_blank')}
                className="mt-4 bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90"
              >
                Open Collection Manager
              </button>
            </div>
          </div>
        )}

        {/* Homepage Sections Tab */}
        {activeTab === 'homepage' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Homepage Section Visibility</h2>
              <p className="text-sm text-muted-foreground">
                Control which sections are displayed on your homepage
              </p>
            </div>
            <div className="grid gap-4">
              {homepageSettings.map((setting) => (
                <div key={setting.id} className="border border-border bg-card rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{setting.sectionName}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Section Key: <code className="bg-muted px-1 rounded text-xs">{setting.sectionKey}</code>
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Order: {setting.sortOrder}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <ToggleButton
                        isActive={setting.isVisible}
                        onToggle={() => handleToggleHomepageSection(setting.id, setting.isVisible)}
                        type="section"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-muted/20 rounded-lg">
              <h4 className="font-medium text-foreground mb-2">💡 How it works:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Toggle sections on/off to control what appears on your homepage</li>
                <li>• Hidden sections won't be displayed to visitors</li>
                <li>• Changes take effect immediately</li>
                <li>• You can always re-enable sections later</li>
              </ul>
            </div>
          </div>
        )}

        {/* Menu Configuration Tab */}
        {activeTab === 'menu-config' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Menu Configuration</h2>
              <p className="text-sm text-muted-foreground">
                Manage dropdown menus for header navigation
              </p>
            </div>
            <div className="bg-muted/20 rounded-lg p-6 text-center">
              <h3 className="text-lg font-medium text-foreground mb-2">Menu Configuration</h3>
              <p className="text-muted-foreground mb-4">
                Create and manage dropdown menus for your header navigation
              </p>
              <a
                href="/admin/cms/menu-config"
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Open Menu Configuration
              </a>
            </div>
            <div className="mt-6 p-4 bg-muted/20 rounded-lg">
              <h4 className="font-medium text-foreground mb-2">💡 How it works:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Create dropdown menus with collections of your choice</li>
                <li>• Choose which collections appear in each dropdown</li>
                <li>• Set the order and visibility of menu items</li>
                <li>• Menus appear in the header navigation automatically</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                {editingItem ? 'Edit' : 'Add New'} {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
              </h2>
              <button 
                onClick={closeModal}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {renderFormFields()}
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-input bg-background text-foreground rounded-lg hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  {editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )

  function renderFormFields() {
    switch (modalType) {
      case 'content':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Key</label>
              <input
                type="text"
                value={formData.key || ''}
                onChange={(e) => setFormData({...formData, key: e.target.value})}
                className="w-full border border-input bg-background text-foreground rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Title</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full border border-input bg-background text-foreground rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Content</label>
              <textarea
                value={formData.content || ''}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="w-full border border-input bg-background text-foreground rounded-lg px-3 py-2 h-32"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Category</label>
              <input
                type="text"
                value={formData.category || ''}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full border border-input bg-background text-foreground rounded-lg px-3 py-2"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive || false}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                className="mr-2"
              />
              <label className="text-sm font-medium text-foreground">Active</label>
            </div>
          </>
        )
      
      case 'banner':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Title *</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full border border-input bg-background text-foreground rounded-lg px-3 py-2"
                required
                placeholder="Enter banner title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full border border-input bg-background text-foreground rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Banner Image *</label>
              <div className="space-y-3">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Upload Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerImageUpload}
                    className="w-full border border-input bg-background text-foreground rounded-lg px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Max 5MB. Supported formats: JPG, PNG, GIF, WebP</p>
                </div>
                
                {/* OR Divider */}
                <div className="flex items-center">
                  <div className="flex-1 border-t border-border"></div>
                  <span className="px-3 text-sm text-muted-foreground">OR</span>
                  <div className="flex-1 border-t border-border"></div>
                </div>
                
                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Image URL</label>
                  <input
                    type="text"
                    value={formData.image || ''}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    className="w-full border border-input bg-background text-foreground rounded-lg px-3 py-2"
                    placeholder="https://example.com/image.jpg or /uploads/banners/filename.png"
                  />
                </div>
                
                {/* Image Preview */}
                {formData.image && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Preview</label>
                    <div className="border border-border rounded-lg p-3 bg-muted/20">
                      <img
                        src={formData.image}
                        alt="Banner preview"
                        className="max-w-full h-32 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Link URL</label>
              <input
                type="url"
                value={formData.link || ''}
                onChange={(e) => setFormData({...formData, link: e.target.value})}
                className="w-full border border-input bg-background text-foreground rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Position *</label>
              <select
                value={formData.position || 'home_top'}
                onChange={(e) => setFormData({...formData, position: e.target.value})}
                className="w-full border border-input bg-background text-foreground rounded-lg px-3 py-2"
                required
              >
                <option value="home_top">Home Top</option>
                <option value="home_hero">Home Hero</option>
                <option value="sidebar">Sidebar</option>
                <option value="footer">Footer</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive || false}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                className="mr-2"
              />
              <label className="text-sm font-medium text-foreground">Active</label>
            </div>
          </>
        )
      
      case 'countdown':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Title</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full border border-input bg-background text-foreground rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full border border-input bg-background text-foreground rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Target Date</label>
              <input
                type="datetime-local"
                value={formData.targetDate || ''}
                onChange={(e) => setFormData({...formData, targetDate: e.target.value})}
                className="w-full border border-input bg-background text-foreground rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={formData.type || 'offer'}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full border border-input bg-background text-foreground rounded-lg px-3 py-2"
              >
                <option value="offer">Offer</option>
                <option value="product">Product</option>
                <option value="event">Event</option>
                <option value="sale">Sale</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Position</label>
              <select
                value={formData.position || 'home'}
                onChange={(e) => setFormData({...formData, position: e.target.value})}
                className="w-full border border-input bg-background text-foreground rounded-lg px-3 py-2"
              >
                <option value="home">Home</option>
                <option value="product">Product</option>
                <option value="category">Category</option>
                <option value="sidebar">Sidebar</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <input
                type="number"
                value={formData.priority || 0}
                onChange={(e) => setFormData({...formData, priority: parseInt(e.target.value) || 0})}
                className="w-full border border-input bg-background text-foreground rounded-lg px-3 py-2"
                min="0"
                max="100"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive || false}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                className="mr-2"
              />
              <label className="text-sm font-medium text-foreground">Active</label>
            </div>
          </>
        )
      
      case 'page':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Title</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full border border-input bg-background text-foreground rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug</label>
              <input
                type="text"
                value={formData.slug || ''}
                onChange={(e) => setFormData({...formData, slug: e.target.value})}
                className="w-full border border-input bg-background text-foreground rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Content</label>
              <textarea
                value={formData.content || ''}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 h-40"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Excerpt</label>
              <textarea
                value={formData.excerpt || ''}
                onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                className="w-full border border-input bg-background text-foreground rounded-lg px-3 py-2"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isPublished || false}
                onChange={(e) => setFormData({...formData, isPublished: e.target.checked})}
                className="mr-2"
              />
              <label className="text-sm font-medium">Published</label>
            </div>
          </>
        )
      
      case 'blog':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Title</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full border border-input bg-background text-foreground rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug</label>
              <input
                type="text"
                value={formData.slug || ''}
                onChange={(e) => setFormData({...formData, slug: e.target.value})}
                className="w-full border border-input bg-background text-foreground rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Content</label>
              <textarea
                value={formData.content || ''}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 h-40"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Excerpt</label>
              <textarea
                value={formData.excerpt || ''}
                onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                className="w-full border border-input bg-background text-foreground rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Category</label>
              <input
                type="text"
                value={formData.category || ''}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full border border-input bg-background text-foreground rounded-lg px-3 py-2"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isPublished || false}
                  onChange={(e) => setFormData({...formData, isPublished: e.target.checked})}
                  className="mr-2"
                />
                <label className="text-sm font-medium">Published</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isFeatured || false}
                  onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                  className="mr-2"
                />
                <label className="text-sm font-medium">Featured</label>
              </div>
            </div>
          </>
        )
      
      case 'testimonial':
        return (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full border border-input bg-background text-foreground rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full border border-input bg-background text-foreground rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Company</label>
              <input
                type="text"
                value={formData.company || ''}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                className="w-full border border-input bg-background text-foreground rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Content</label>
              <textarea
                value={formData.content || ''}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="w-full border border-input bg-background text-foreground rounded-lg px-3 py-2 h-32"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Rating</label>
              <select
                value={formData.rating || 5}
                onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                className="w-full border border-input bg-background text-foreground rounded-lg px-3 py-2"
              >
                <option value={1}>1 Star</option>
                <option value={2}>2 Stars</option>
                <option value={3}>3 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={5}>5 Stars</option>
              </select>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive || false}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-foreground">Active</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isFeatured || false}
                  onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                  className="mr-2"
                />
                <label className="text-sm font-medium">Featured</label>
              </div>
            </div>
          </>
        )
      
      case 'faq':
        return (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Question</label>
              <input
                type="text"
                value={formData.question || ''}
                onChange={(e) => setFormData({...formData, question: e.target.value})}
                className="w-full border border-input bg-background text-foreground rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Answer</label>
              <textarea
                value={formData.answer || ''}
                onChange={(e) => setFormData({...formData, answer: e.target.value})}
                className="w-full border border-input bg-background text-foreground rounded-lg px-3 py-2 h-32"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Category</label>
              <input
                type="text"
                value={formData.category || ''}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full border border-input bg-background text-foreground rounded-lg px-3 py-2"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive || false}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                className="mr-2"
              />
              <label className="text-sm font-medium text-foreground">Active</label>
            </div>
          </>
        )
      
      default:
        return <div>Form not implemented for {modalType}</div>
    }
  }
}