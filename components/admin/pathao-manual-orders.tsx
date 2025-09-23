"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Save, 
  X, 
  Package,
  User,
  Phone,
  MapPin,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'

interface ManualOrder {
  consignmentId: string
  merchantOrderId: string
  recipientName: string
  recipientPhone: string
  recipientAddress: string
  itemDescription: string
  itemWeight: number
  amountToCollect: number
  orderStatus: string
  deliveryFee: number
}

export default function PathaoManualOrders() {
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState<ManualOrder>({
    consignmentId: '',
    merchantOrderId: '',
    recipientName: '',
    recipientPhone: '',
    recipientAddress: '',
    itemDescription: '',
    itemWeight: 0.5,
    amountToCollect: 0,
    orderStatus: 'Pending',
    deliveryFee: 80
  })

  const handleInputChange = (field: keyof ManualOrder, value: string | number) => {
    setOrder(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/pathao/orders/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          consignment_id: order.consignmentId,
          merchant_order_id: order.merchantOrderId,
          store_id: 123, // Default store ID
          recipient_name: order.recipientName,
          recipient_phone: order.recipientPhone,
          recipient_address: order.recipientAddress,
          delivery_type: 48, // Normal delivery
          item_type: 2, // Parcel
          item_quantity: 1,
          item_weight: order.itemWeight,
          item_description: order.itemDescription,
          amount_to_collect: order.amountToCollect,
          order_status: order.orderStatus,
          delivery_fee: order.deliveryFee
        })
      })

      const data = await response.json()
      if (data.success) {
        toast.success('Order added successfully!')
        setShowForm(false)
        setOrder({
          consignmentId: '',
          merchantOrderId: '',
          recipientName: '',
          recipientPhone: '',
          recipientAddress: '',
          itemDescription: '',
          itemWeight: 0.5,
          amountToCollect: 0,
          orderStatus: 'Pending',
          deliveryFee: 80
        })
      } else {
        toast.error('Failed to add order')
      }
    } catch (error) {
      toast.error('Failed to add order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-foreground">Manual Order Entry</h4>
          <p className="text-sm text-muted-foreground">
            Add your existing orders to the system
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="glass-button px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Order</span>
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-foreground">Add Manual Order</h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Consignment ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={order.consignmentId}
                    onChange={(e) => handleInputChange('consignmentId', e.target.value)}
                    placeholder="CONS001"
                    className="glass-input w-full px-4 py-2 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Merchant Order ID
                  </label>
                  <input
                    type="text"
                    value={order.merchantOrderId}
                    onChange={(e) => handleInputChange('merchantOrderId', e.target.value)}
                    placeholder="ORD001"
                    className="glass-input w-full px-4 py-2 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Recipient Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={order.recipientName}
                    onChange={(e) => handleInputChange('recipientName', e.target.value)}
                    placeholder="John Doe"
                    className="glass-input w-full px-4 py-2 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Recipient Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={order.recipientPhone}
                    onChange={(e) => handleInputChange('recipientPhone', e.target.value)}
                    placeholder="01712345678"
                    className="glass-input w-full px-4 py-2 rounded-lg"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Recipient Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={order.recipientAddress}
                    onChange={(e) => handleInputChange('recipientAddress', e.target.value)}
                    placeholder="House 123, Road 4, Sector 10, Uttara, Dhaka-1230"
                    className="glass-input w-full px-4 py-2 rounded-lg"
                    rows={2}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Item Description
                  </label>
                  <input
                    type="text"
                    value={order.itemDescription}
                    onChange={(e) => handleInputChange('itemDescription', e.target.value)}
                    placeholder="Sports Jersey"
                    className="glass-input w-full px-4 py-2 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Item Weight (KG)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={order.itemWeight}
                    onChange={(e) => handleInputChange('itemWeight', parseFloat(e.target.value))}
                    className="glass-input w-full px-4 py-2 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Amount to Collect (৳)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={order.amountToCollect}
                    onChange={(e) => handleInputChange('amountToCollect', parseInt(e.target.value))}
                    placeholder="0 for non-COD"
                    className="glass-input w-full px-4 py-2 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Delivery Fee (৳)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={order.deliveryFee}
                    onChange={(e) => handleInputChange('deliveryFee', parseInt(e.target.value))}
                    className="glass-input w-full px-4 py-2 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Order Status
                  </label>
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleInputChange('orderStatus', e.target.value)}
                    className="glass-input w-full px-4 py-2 rounded-lg"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="glass-button px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 flex items-center space-x-2"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>{loading ? 'Adding...' : 'Add Order'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
