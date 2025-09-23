# Supabase Storage Setup Guide

This guide will help you set up Supabase Storage for image uploads in your Sports Nation BD application.

## Prerequisites

- Supabase project with database already configured
- Admin access to your Supabase dashboard

## Step 1: Get Your Supabase Credentials

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL** (e.g., `https://kebgbomwiyfumhrslfgg.supabase.co`)
   - **Service Role Key** (starts with `eyJ...`)

## Step 2: Add Environment Variables

Add these environment variables to your Vercel deployment:

### In Vercel Dashboard:
1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add the following:

```
NEXT_PUBLIC_SUPABASE_URL=https://kebgbomwiyfumhrslfgg.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ... (your service role key)
```

### For Local Development:
Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://kebgbomwiyfumhrslfgg.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ... (your service role key)
```

## Step 3: Set Up Storage Buckets

Run the setup script to create the required storage buckets:

```bash
node scripts/setup-supabase-storage.js
```

This will create the following buckets:
- `products` - Product images
- `categories` - Category images  
- `badges` - Badge images
- `banners` - Banner images
- `users` - User profile images
- `uploads` - General uploads

## Step 4: Configure Bucket Policies

In your Supabase Dashboard:

1. Go to **Storage** → **Policies**
2. For each bucket, create a policy:

### Public Read Policy (for all buckets):
```sql
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'bucket_name');
```

### Authenticated Upload Policy (for admin uploads):
```sql
CREATE POLICY "Authenticated upload access" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'bucket_name' AND 
  auth.role() = 'authenticated'
);
```

## Step 5: Test the Setup

1. Deploy your application to Vercel
2. Go to the admin dashboard
3. Try uploading an image in any section
4. Check that the image appears correctly

## Troubleshooting

### Issue: "Missing Supabase service role key"
**Solution:** Make sure you've added `SUPABASE_SERVICE_ROLE_KEY` to your environment variables.

### Issue: "Upload failed: Bucket not found"
**Solution:** Run the setup script to create the required buckets.

### Issue: "Upload failed: Policy violation"
**Solution:** Check that your bucket policies are correctly configured.

### Issue: Images not displaying
**Solution:** Verify that your bucket has public read access enabled.

## Fallback Behavior

If Supabase Storage is not configured, the application will automatically fall back to using placeholder images from Picsum Photos. This ensures your application continues to work even without proper storage setup.

## Security Notes

- The Service Role Key has full access to your Supabase project
- Keep it secure and never commit it to version control
- Use it only for server-side operations
- Consider using Row Level Security (RLS) for additional protection

## Cost Considerations

Supabase Storage pricing:
- **Free tier:** 1GB storage, 2GB bandwidth
- **Pro tier:** $0.021/GB storage, $0.09/GB bandwidth

For a typical e-commerce site, the free tier should be sufficient for initial testing.

## Next Steps

Once Supabase Storage is set up:

1. **Test image uploads** in all admin sections
2. **Verify image display** on product pages
3. **Set up image optimization** (optional)
4. **Configure CDN** for better performance (optional)

## Support

If you encounter any issues:

1. Check the Supabase Dashboard logs
2. Verify your environment variables
3. Test with the setup script
4. Check the browser console for errors

---

**Note:** This setup is already integrated into your application. You just need to add the environment variables and run the setup script.
