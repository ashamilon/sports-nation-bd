# 🏆 Sports Nation BD - Premium Sports Gear E-commerce Platform

A comprehensive, modern e-commerce platform built with Next.js 15, featuring regional pricing, multi-language support, and advanced admin management.

## 🌟 Features

### 🛒 **E-commerce Core**
- **Product Management**: Complete CRUD operations with variants, images, and categories
- **Shopping Cart**: Persistent cart with real-time updates
- **Wishlist**: Save and manage favorite products
- **Order Management**: Complete order tracking and management system
- **Payment Integration**: SSL Commerz payment gateway for Bangladesh

### 🌍 **Regional Features**
- **Multi-Region Support**: Bangladesh, Germany, Netherlands, Europe
- **Currency Conversion**: Automatic BDT to EUR conversion (7x multiplier)
- **Regional Delivery**: Different delivery times and charges per region
- **Multi-Language**: English, German (Deutsch), Dutch support
- **Location Detection**: Automatic region detection based on timezone

### 🎨 **User Experience**
- **Responsive Design**: Mobile-first approach with modern UI
- **Glass Morphism**: Beautiful glass-effect components
- **Animations**: Smooth transitions with Framer Motion
- **Image Optimization**: Next.js Image component with placeholder system
- **SEO Optimized**: Meta tags, structured data, and performance optimization

### 👨‍💼 **Admin Features**
- **Admin Dashboard**: Comprehensive admin panel
- **CMS System**: Content management for banners, pages, blog posts
- **Product Management**: Advanced product creation and editing
- **Order Management**: Track and manage customer orders
- **Analytics**: Sales and performance insights

### 🔐 **Authentication & Security**
- **NextAuth.js**: Secure authentication system
- **Role-based Access**: Admin and customer roles
- **Google OAuth**: Social login integration
- **Protected Routes**: Middleware-based route protection

### 📱 **Additional Features**
- **SMS Integration**: Order confirmation via SMS (Bangladesh)
- **Custom Jerseys**: Name and number customization
- **Premium Badges**: Optional premium product badges
- **Size Guides**: Product sizing information
- **Reviews & Ratings**: Customer feedback system

## 🚀 **Regional Configuration**

| Region | Currency | Delivery | Free Delivery Min | Money Back | Language |
|--------|----------|----------|-------------------|------------|----------|
| Bangladesh | BDT (৳) | 7 days | ৳2,000 | 7 days | English |
| Germany | EUR (€) | 15 days | €280 (20,000 BDT) | 15 days | German |
| Netherlands | EUR (€) | 15 days | €280 (20,000 BDT) | 15 days | Dutch |
| Europe | EUR (€) | 15 days | €280 (20,000 BDT) | 15 days | English |
| Other | BDT (৳) | 10 days | ৳2,000 | 7 days | English |

## 🛠️ **Tech Stack**

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js
- **State Management**: Zustand
- **UI Components**: Radix UI
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Payment**: SSL Commerz
- **SMS**: BulkSMSBD integration

## 📦 **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/ashamilon/sports-nation-bd.git
   cd sports-nation-bd
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following variables:
   ```env
   # Database
   DATABASE_URL="file:./dev.db"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   
   # Google OAuth (optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   # SSL Commerz
   SSL_STORE_ID="your-store-id"
   SSL_STORE_PASSWORD="your-store-password"
   SSL_IS_LIVE=false
   
   # SMS Configuration
   SMS_PROVIDER="bulksmsbd"
   BULKSMS_API_KEY="your-api-key"
   BULKSMS_SENDER_ID="your-sender-id"
   ```

4. **Set up the database**
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 **Usage**

### **For Customers**
1. Browse products by category
2. Add items to cart or wishlist
3. Select your region for localized pricing
4. Proceed to checkout with SSL Commerz
5. Receive SMS confirmation (Bangladesh)

### **For Admins**
1. Access admin panel at `/admin`
2. Manage products, orders, and customers
3. Use CMS to update content
4. Monitor analytics and performance

## 📁 **Project Structure**

```
sports-nation-bd/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   └── product/           # Product pages
├── components/            # React components
│   ├── admin/             # Admin components
│   ├── ui/                # UI components
│   └── ...                # Feature components
├── lib/                   # Utility libraries
│   ├── store/             # Zustand stores
│   └── ...                # Helper functions
├── prisma/                # Database schema
├── public/                # Static assets
└── ...                    # Configuration files
```

## 🔧 **Development**

### **Available Scripts**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push database schema
- `npm run db:seed` - Seed database

### **Database Management**
```bash
# View database
npx prisma studio

# Reset database
npx prisma db push --force-reset

# Generate Prisma client
npx prisma generate
```

## 🚀 **Deployment**

### **Vercel (Recommended)**
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### **Other Platforms**
- **Netlify**: Compatible with static export
- **Railway**: Full-stack deployment
- **DigitalOcean**: VPS deployment

## 📞 **Support**

For support and questions:
- **Email**: info@sportsnationbd.com
- **Phone**: +880 1868 556390
- **Website**: [sportsnationbd.com](https://sportsnationbd.com)

## 📄 **License**

This project is proprietary software. All rights reserved.

## 🙏 **Acknowledgments**

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Prisma for the excellent ORM
- All open-source contributors

---

**Built with ❤️ for Sports Nation BD**