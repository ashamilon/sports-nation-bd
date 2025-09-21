"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Ruler, Info } from 'lucide-react'

interface SizeChartData {
  id: string
  fabricType: string
  title: string
  content: string
  metadata?: any
}

interface SizeChartProps {
  fabricType: string
  isVisible: boolean
  onClose: () => void
}

export default function SizeChart({ fabricType, isVisible, onClose }: SizeChartProps) {
  const [sizeChartData, setSizeChartData] = useState<SizeChartData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isVisible && fabricType) {
      fetchSizeChart()
    }
  }, [isVisible, fabricType])

  const fetchSizeChart = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/cms/size-charts?fabricType=${encodeURIComponent(fabricType)}&active=true`)
      const result = await response.json()
      
      if (result.success && result.data && result.data.length > 0) {
        const chart = result.data[0]
        // Extract fabricType from metadata
        let extractedFabricType = fabricType
        try {
          if (chart.metadata) {
            const metadata = JSON.parse(chart.metadata)
            extractedFabricType = metadata.fabricType || fabricType
          }
        } catch (error) {
          console.error('Error parsing metadata:', error)
        }
        
        setSizeChartData({
          ...chart,
          fabricType: extractedFabricType
        })
      } else {
        setError('Size chart not available for this fabric type')
      }
    } catch (err) {
      setError('Failed to load size chart')
      console.error('Error fetching size chart:', err)
    } finally {
      setLoading(false)
    }
  }

  const parseSizeChartContent = (content: string) => {
    try {
      // Try to parse as JSON first (for structured data)
      return JSON.parse(content)
    } catch {
      // If not JSON, return as HTML/text content
      return { type: 'html', content }
    }
  }

  const renderSizeChart = () => {
    if (!sizeChartData) return null

    const chartData = parseSizeChartContent(sizeChartData.content)

    if (chartData.type === 'html') {
      // Render HTML content
      return (
        <div 
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: chartData.content }}
        />
      )
    }

    // Render structured size chart data
    if (chartData.sizes && Array.isArray(chartData.sizes)) {
      return (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-border rounded-lg">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left font-medium">Size</th>
                {chartData.measurements && Object.keys(chartData.measurements[0] || {}).map(measurement => (
                  <th key={measurement} className="border border-border px-3 py-2 text-center font-medium">
                    {measurement}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chartData.sizes.map((size: any, index: number) => (
                <tr key={index} className="hover:bg-muted/50">
                  <td className="border border-border px-3 py-2 font-medium">{size}</td>
                  {chartData.measurements && chartData.measurements[index] && 
                    Object.values(chartData.measurements[index]).map((value: any, i: number) => (
                      <td key={i} className="border border-border px-3 py-2 text-center">
                        {value}
                      </td>
                    ))
                  }
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }

    // Fallback to raw content
    return (
      <div className="whitespace-pre-wrap text-sm">
        {sizeChartData.content}
      </div>
    )
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 bg-background border border-border rounded-2xl shadow-2xl z-50 max-w-4xl mx-auto max-h-[80vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Ruler className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {sizeChartData?.title || `${fabricType} Size Chart`}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Find your perfect fit
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <Info className="h-5 w-5 text-destructive" />
                  <p className="text-destructive">{error}</p>
                </div>
              )}

              {sizeChartData && !loading && !error && (
                <div className="space-y-4">
                  {renderSizeChart()}
                  
                  {/* Additional info */}
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Size Guide Tips:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Measure your chest at the fullest point</li>
                      <li>• For jerseys, consider if you prefer a loose or fitted look</li>
                      <li>• If between sizes, we recommend sizing up</li>
                      <li>• Different fabric types may fit slightly differently</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
