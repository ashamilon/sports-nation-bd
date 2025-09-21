# 🎯 Content Management System (CMS) Guide

## Overview
Your website now has a powerful Content Management System that allows you to easily update content, manage banners, and create countdown timers without touching any code!

## 🚀 How to Access the CMS

1. **Login to Admin Dashboard**: Go to `/admin` and login with your admin credentials
2. **Navigate to CMS**: Click on "Content CMS" in the admin sidebar
3. **Manage Content**: Use the tabs to switch between different content types

## 📝 Content Types

### 1. Site Content
Manage text content, titles, descriptions, and other website text.

**Examples:**
- Hero section titles and subtitles
- Contact information (email, phone, address)
- Footer text and descriptions
- Product descriptions
- Policy text

**How to Use:**
1. Go to "Site Content" tab
2. Click "Edit" on any existing content
3. Update the text and click "Save"
4. Changes appear immediately on your website

### 2. Banners
Create and manage promotional banners for different sections.

**Banner Positions:**
- `home_top` - Top of homepage
- `home_hero` - Hero section of homepage
- `product_page` - Product detail pages
- `category_page` - Category listing pages

**How to Create a Banner:**
1. Go to "Banners" tab
2. Click "Add New Banner"
3. Fill in the details:
   - **Title**: Banner headline
   - **Description**: Subtitle or description
   - **Image URL**: Link to your banner image
   - **Link URL**: Where users go when they click (optional)
   - **Position**: Where to display the banner
   - **Priority**: Higher numbers appear first
4. Click "Save"

### 3. Countdown Timers
Create countdown timers for offers, product launches, and events.

**Timer Types:**
- `offer` - Sales and promotions
- `product` - Product launches
- `event` - Special events

**Positions:**
- `home` - Homepage
- `product` - Product pages
- `category` - Category pages

**How to Create a Countdown:**
1. Go to "Countdown Timers" tab
2. Click "Add New Countdown"
3. Fill in the details:
   - **Title**: Countdown headline
   - **Description**: Additional details
   - **Target Date & Time**: When the countdown ends
   - **Type**: What kind of countdown
   - **Position**: Where to display
4. Click "Save"

## 🎨 Common Use Cases

### Flash Sales
1. Create a countdown timer for the sale end date
2. Create a banner promoting the sale
3. Set both to appear on homepage

### Product Launches
1. Create a countdown timer for launch date
2. Create banners showing the new product
3. Update site content with product information

### Seasonal Promotions
1. Create seasonal banners
2. Update hero section content
3. Add countdown timers for limited offers

### Contact Information Updates
1. Go to Site Content
2. Find "contact_email" or "contact_phone"
3. Update with new information
4. Save - changes appear immediately

## 🔧 Technical Details

### Content Keys
Each piece of content has a unique "key" that identifies it:
- `home_hero_title` - Main homepage title
- `contact_email` - Contact email address
- `footer_about` - Footer description

### Banner Scheduling
Banners can be scheduled with:
- **Start Date**: When to start showing
- **End Date**: When to stop showing
- **Priority**: Display order (higher = first)

### Countdown Features
- Automatically calculates time remaining
- Shows days, hours, minutes, seconds
- Displays "Offer Expired" when time runs out
- Can trigger actions when completed

## 📱 Mobile Responsive
All CMS content is automatically mobile-responsive:
- Banners scale to fit mobile screens
- Countdown timers stack vertically on mobile
- Text content wraps properly

## 🚀 Quick Start Examples

### Example 1: Create a Sale Banner
```
Title: "Black Friday Sale - 70% Off!"
Description: "Limited time offer on all products"
Image: "https://your-domain.com/sale-banner.jpg"
Position: "home_top"
Priority: 10
```

### Example 2: Add a Countdown Timer
```
Title: "Sale Ends Soon!"
Description: "Don't miss out on amazing deals"
Target Date: "2024-12-31T23:59:59"
Type: "offer"
Position: "home"
```

### Example 3: Update Contact Info
```
Key: "contact_phone"
Content: "+880 1868 556390"
Category: "contact"
```

## 🎯 Best Practices

1. **Use High-Quality Images**: Banners should be at least 1200px wide
2. **Keep Titles Short**: Banner titles work best under 50 characters
3. **Test on Mobile**: Always check how content looks on mobile devices
4. **Set Priorities**: Use priority numbers to control display order
5. **Schedule Content**: Use start/end dates for time-sensitive content

## 🔄 Making Changes

### Immediate Updates
- Site content changes appear instantly
- Banner changes are immediate
- Countdown timers update in real-time

### No Code Required
- Everything is managed through the admin interface
- No need to edit files or restart the server
- Changes are saved to the database automatically

## 🆘 Troubleshooting

### Banner Not Showing
- Check if banner is active
- Verify the position setting
- Ensure image URL is accessible
- Check if banner has expired

### Countdown Not Working
- Verify target date is in the future
- Check if countdown is active
- Ensure position is correct

### Content Not Updating
- Refresh the page
- Check if content is active
- Verify the content key is correct

## 🎉 You're All Set!

Your CMS is now ready to use! You can:
- ✅ Update any text content instantly
- ✅ Add/remove banners without coding
- ✅ Create countdown timers for promotions
- ✅ Schedule content for specific dates
- ✅ Manage everything from the admin dashboard

No more manual file editing - everything is now point-and-click! 🚀
