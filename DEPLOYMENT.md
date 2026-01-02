# Orbi City Batumi - Deployment Guide

This guide covers deploying the Orbi City Batumi website to various platforms.

## 📋 Prerequisites

Before deploying, ensure you have:
- Node.js 18+ installed
- A Supabase project (or Lovable Cloud)
- All required API keys (see Environment Variables section)

## 🔐 Environment Variables

### Frontend Variables (in `.env` file)

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `VITE_SUPABASE_URL` | Supabase project URL | Supabase Dashboard → Settings → API |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon key | Supabase Dashboard → Settings → API |
| `VITE_SUPABASE_PROJECT_ID` | Supabase project ID | Supabase Dashboard → Settings → General |

### Edge Function Secrets

These must be configured as secrets in your hosting platform or Supabase:

| Secret | Description | Where to Get |
|--------|-------------|--------------|
| `GOOGLE_MAPS_API_KEY` | Google Maps integration | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |
| `YOUTUBE_API_KEY` | YouTube video fetching | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |
| `RESEND_API_KEY` | Email sending | [Resend Dashboard](https://resend.com/api-keys) |
| `GOOGLE_ANALYTICS_ID` | Analytics tracking | Google Analytics → Admin → Data Streams |
| `META_PIXEL_ID` | Facebook Pixel | Meta Business Suite → Events Manager |
| `META_ACCESS_TOKEN` | Meta Conversions API | Meta Business Suite → Events Manager → Settings |

## 🚀 Deployment Options

### Option 1: Lovable (Recommended)

The easiest deployment option. Just click "Publish" in the Lovable editor.

1. Open your project in Lovable
2. Click the **Publish** button (top right)
3. Configure your custom domain (optional)
4. All secrets are already configured ✅

### Option 2: Vercel

1. **Connect Repository**
   ```bash
   # Push your code to GitHub first
   git remote add origin https://github.com/your-username/orbi-city-batumi.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Framework Preset: **Vite**

3. **Configure Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.example`

4. **Deploy**
   ```bash
   vercel --prod
   ```

### Option 3: Netlify

1. **Connect Repository**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository

2. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **Environment Variables**
   - Go to Site Settings → Environment Variables
   - Add all required variables

4. **Deploy**
   - Automatic on push to main branch
   - Or trigger manual deploy from dashboard

### Option 4: Railway

1. **Create New Project**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"

2. **Configure Variables**
   - Click on your service → "Variables"
   - Add all environment variables

3. **Deploy**
   - Railway auto-deploys on push

## 🗄️ Supabase Setup

If deploying outside Lovable, you need to set up Supabase manually:

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the project to initialize

### 2. Run Database Migrations

The database schema is defined in `supabase/migrations/`. Apply them:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_ID

# Run migrations
supabase db push
```

### 3. Deploy Edge Functions

```bash
# Deploy all edge functions
supabase functions deploy

# Or deploy individually
supabase functions deploy chat
supabase functions deploy send-email
supabase functions deploy google-places
supabase functions deploy fetch-youtube-videos
supabase functions deploy generate-sitemap
supabase functions deploy track-conversion
supabase functions deploy get-website-leads
```

### 4. Configure Edge Function Secrets

```bash
# Set secrets for edge functions
supabase secrets set GOOGLE_MAPS_API_KEY=your-key
supabase secrets set YOUTUBE_API_KEY=your-key
supabase secrets set RESEND_API_KEY=your-key
supabase secrets set GOOGLE_ANALYTICS_ID=your-id
```

### 5. Configure Authentication

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Email provider
3. Configure SMTP settings for production emails (optional)
4. Set up OAuth providers if needed (Google, etc.)

## 📦 Build Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🔧 Troubleshooting

### Edge Functions Not Working

1. Check if functions are deployed: `supabase functions list`
2. Check function logs: `supabase functions logs FUNCTION_NAME`
3. Verify secrets are set: `supabase secrets list`

### Maps Not Loading

1. Verify `GOOGLE_MAPS_API_KEY` is set correctly
2. Enable required APIs in Google Cloud Console:
   - Maps JavaScript API
   - Places API
   - Geocoding API

### Emails Not Sending

1. Verify `RESEND_API_KEY` is correct
2. Check Resend dashboard for delivery status
3. Verify sender domain is configured in Resend

### YouTube Videos Not Loading

1. Check `YOUTUBE_API_KEY` is valid
2. Ensure YouTube Data API v3 is enabled
3. Check API quota limits

## 🌐 Custom Domain Setup

### Lovable
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as shown

### Vercel
1. Go to Project Settings → Domains
2. Add domain and configure DNS

### Netlify
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Configure DNS or use Netlify DNS

## 📊 Post-Deployment Checklist

- [ ] All pages load correctly
- [ ] Booking form works
- [ ] Contact form sends emails
- [ ] Maps display correctly
- [ ] YouTube videos load
- [ ] Authentication works
- [ ] Admin panel accessible
- [ ] Google Analytics tracking
- [ ] Meta Pixel tracking
- [ ] SSL certificate active
- [ ] Custom domain configured
- [ ] Mobile responsive design verified

## 🆘 Support

For issues with:
- **Lovable Platform**: [docs.lovable.dev](https://docs.lovable.dev)
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Netlify**: [docs.netlify.com](https://docs.netlify.com)

---

© 2025 Orbi City Batumi. All rights reserved.
