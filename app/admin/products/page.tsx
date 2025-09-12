import { Metadata } from 'next'
import AdminLayout from '@/components/admin/admin-layout'
import ProductsManagement from '@/components/admin/products-management'

export const metadata: Metadata = {
  title: 'Products Management | Admin Dashboard',
  description: 'Manage products, categories, and inventory',
}

export default function AdminProductsPage() {
  return (
    <AdminLayout>
      <ProductsManagement />
    </AdminLayout>
  )
}
