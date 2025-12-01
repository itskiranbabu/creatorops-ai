# CreatorOps AI - Quick Start Guide

Get CreatorOps AI running in production in under 30 minutes.

## 🚀 Fastest Path to Production

### Step 1: Clone Repository (1 min)

```bash
git clone https://github.com/itskiranbabu/creatorops-ai.git
cd creatorops-ai
```

### Step 2: Set Up Database (5 min)

**Option A: Supabase (Recommended)**
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy connection string from Settings → Database
4. Format: `postgresql://postgres:[password]@[host]:5432/postgres`

**Option B: Neon**
1. Go to [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string

**Option C: Railway**
1. Go to [railway.app](https://railway.app)
2. New Project → Add PostgreSQL
3. Copy connection string

### Step 3: Set Up Redis (3 min)

**Option A: Upstash (Recommended)**
1. Go to [upstash.com](https://upstash.com)
2. Create Redis database
3. Copy connection string

**Option B: Railway**
1. In your Railway project
2. Add Redis service
3. Copy connection string

### Step 4: Configure Stripe (5 min)

1. Go to [stripe.com/dashboard](https://dashboard.stripe.com)
2. Get API keys from Developers → API keys
3. Create products:
   - Pro: $29/month
   - Agency: $99/month
4. Copy price IDs

### Step 5: Get AI API Key (2 min)

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create API key
3. Copy key (starts with `sk-`)

### Step 6: Set Up Google OAuth (5 min)

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect: `https://your-domain.com/api/auth/callback/google`
6. Copy Client ID and Secret

### Step 7: Deploy to Vercel (5 min)

1. Go to [vercel.com](https://vercel.com)
2. Import Git Repository
3. Select `itskiranbabu/creatorops-ai`
4. Add environment variables (see below)
5. Click Deploy

### Step 8: Environment Variables (3 min)

Add these in Vercel dashboard:

```env
# Database
DATABASE_URL=postgresql://...

# Redis
REDIS_URL=redis://...

# NextAuth
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=run: openssl rand -base64 32

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# AI Provider
AI_PROVIDER_API_KEY=sk-...
AI_PROVIDER_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-4-turbo-preview

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_AGENCY_PRICE_ID=price_...

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=CreatorOps AI <noreply@creatorops.ai>

# App
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NODE_ENV=production
```

### Step 9: Run Migrations (2 min)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Pull environment variables
vercel env pull .env.local

# Run migrations
npx prisma migrate deploy
```

### Step 10: Configure Stripe Webhook (2 min)

1. Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-app.vercel.app/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
4. Copy webhook secret
5. Update `STRIPE_WEBHOOK_SECRET` in Vercel

## ✅ Verification Checklist

Test these features:

- [ ] Landing page loads
- [ ] Sign up with email works
- [ ] Sign in with email works
- [ ] Google OAuth works
- [ ] Dashboard loads
- [ ] Create content item
- [ ] AI repurposing works
- [ ] Create sponsor
- [ ] Create deal
- [ ] Generate follow-up
- [ ] Stripe checkout works
- [ ] Webhook events received

## 🎉 You're Live!

Your app is now running at: `https://your-app.vercel.app`

## 📊 Monitor Your App

### Vercel Dashboard
- View deployments
- Check logs
- Monitor performance

### Stripe Dashboard
- Track subscriptions
- View revenue
- Monitor webhooks

### Database
- Supabase: Built-in dashboard
- Neon: SQL editor
- Railway: Database browser

## 🔧 Common Issues

### Database Connection Failed
```bash
# Test connection
psql $DATABASE_URL

# Check if DATABASE_URL is correct
echo $DATABASE_URL
```

### Migrations Failed
```bash
# Reset database (CAUTION: destroys data)
npx prisma migrate reset

# Apply migrations
npx prisma migrate deploy
```

### Build Failed
```bash
# Check logs in Vercel dashboard
# Common issues:
# - Missing environment variables
# - TypeScript errors
# - Prisma client not generated
```

### Stripe Webhook Not Working
1. Check webhook URL is correct
2. Verify webhook secret matches
3. Check Stripe dashboard for delivery attempts
4. View logs in Vercel

## 🚀 Next Steps

1. **Custom Domain**: Add in Vercel settings
2. **Email Setup**: Configure SMTP or use SendGrid
3. **Monitoring**: Add Sentry for error tracking
4. **Analytics**: Add Google Analytics or Plausible
5. **Marketing**: Create landing page content
6. **Support**: Set up customer support system

## 💡 Pro Tips

### Performance
- Enable Vercel Analytics
- Use Vercel Image Optimization
- Enable caching headers

### Security
- Enable Vercel DDoS protection
- Set up rate limiting
- Regular security audits

### Scaling
- Monitor database connections
- Scale Redis if needed
- Consider read replicas

## 📚 Resources

- [Full Documentation](./README.md)
- [Architecture Guide](./ARCHITECTURE.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Project Summary](./PROJECT_SUMMARY.md)

## 🆘 Need Help?

- **GitHub Issues**: https://github.com/itskiranbabu/creatorops-ai/issues
- **Email**: support@creatorops.ai
- **Documentation**: Check README.md

---

**Estimated Setup Time**: 30 minutes  
**Difficulty**: Intermediate  
**Cost**: ~$200-700/month

**You're ready to launch!** 🎊