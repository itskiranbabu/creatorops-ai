# CreatorOps AI - Deployment Guide

This guide covers deploying CreatorOps AI to production using various platforms.

## Prerequisites

Before deploying, ensure you have:

1. **GitHub Repository**: Code pushed to GitHub
2. **Database**: PostgreSQL instance (Supabase, Neon, Railway, or AWS RDS)
3. **Redis**: Redis instance (Upstash, Railway, or AWS ElastiCache)
4. **Stripe Account**: For payment processing
5. **OpenAI API Key**: Or compatible AI provider
6. **Google OAuth Credentials**: For social login

## Option 1: Deploy to Vercel (Recommended for Next.js)

### Step 1: Prepare Database

```bash
# Create a PostgreSQL database on Supabase/Neon/Railway
# Get your DATABASE_URL connection string
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository: `itskiranbabu/creatorops-ai`
4. Configure environment variables (see below)
5. Click "Deploy"

### Step 3: Set Environment Variables

In Vercel dashboard, add these variables:

```env
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=generate-random-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
AI_PROVIDER_API_KEY=your-openai-key
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=CreatorOps AI <noreply@creatorops.ai>
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### Step 4: Run Database Migrations

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Run migrations
vercel env pull .env.local
npx prisma migrate deploy
```

### Step 5: Configure Stripe Webhooks

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-app.vercel.app/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

## Option 2: Deploy to Railway

### Step 1: Install Railway CLI

```bash
npm i -g @railway/cli
railway login
```

### Step 2: Create New Project

```bash
railway init
```

### Step 3: Add Services

```bash
# Add PostgreSQL
railway add --database postgres

# Add Redis
railway add --database redis

# Deploy application
railway up
```

### Step 4: Set Environment Variables

```bash
railway variables set DATABASE_URL="postgresql://..."
railway variables set REDIS_URL="redis://..."
railway variables set NEXTAUTH_SECRET="your-secret"
# ... add all other variables
```

### Step 5: Configure Domain

```bash
railway domain
```

## Option 3: Deploy with Docker

### Step 1: Build Docker Image

```bash
docker build -t creatorops-ai .
```

### Step 2: Run Container

```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e REDIS_URL="redis://..." \
  -e NEXTAUTH_SECRET="your-secret" \
  # ... add all environment variables
  creatorops-ai
```

### Step 3: Deploy to Cloud

Push to:
- **AWS ECS/Fargate**
- **Google Cloud Run**
- **Azure Container Instances**
- **DigitalOcean App Platform**

## Post-Deployment Checklist

### 1. Database Setup

```bash
# Run migrations
npx prisma migrate deploy

# Verify connection
npx prisma studio
```

### 2. Test Authentication

- [ ] Email/password signup works
- [ ] Email/password login works
- [ ] Google OAuth works
- [ ] Password reset works

### 3. Test Core Features

- [ ] Create workspace
- [ ] Create content item
- [ ] AI repurposing works
- [ ] Create sponsor
- [ ] Create deal
- [ ] Generate follow-up

### 4. Configure Stripe

- [ ] Webhook endpoint configured
- [ ] Test subscription flow
- [ ] Verify webhook events received
- [ ] Test plan upgrades/downgrades

### 5. Monitoring Setup

- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] Uptime monitoring
- [ ] Log aggregation

### 6. Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] CORS configured
- [ ] Rate limiting enabled
- [ ] Database backups configured
- [ ] Secrets rotated

## Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `REDIS_URL` | Redis connection string | `redis://host:6379` |
| `NEXTAUTH_URL` | Application URL | `https://app.creatorops.ai` |
| `NEXTAUTH_SECRET` | Random secret (32+ chars) | Generate with `openssl rand -base64 32` |
| `AI_PROVIDER_API_KEY` | OpenAI or compatible API key | `sk-...` |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | `whsec_...` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `AI_PROVIDER_BASE_URL` | AI API base URL | `https://api.openai.com/v1` |
| `AI_MODEL` | AI model to use | `gpt-4-turbo-preview` |
| `SMTP_HOST` | Email SMTP host | `smtp.gmail.com` |
| `SMTP_PORT` | Email SMTP port | `587` |

## Scaling Considerations

### Database

- Use connection pooling (PgBouncer)
- Enable read replicas for heavy read workloads
- Set up automated backups
- Monitor query performance

### Redis

- Use Redis Cluster for high availability
- Configure persistence (AOF + RDB)
- Set up monitoring and alerts

### Application

- Enable horizontal scaling (multiple instances)
- Use CDN for static assets
- Implement caching strategies
- Set up load balancing

### Background Jobs

- Deploy separate worker instances for BullMQ
- Scale workers based on queue depth
- Implement job retry logic
- Monitor job failures

## Monitoring & Alerts

### Key Metrics to Track

1. **Application**
   - Response time (p50, p95, p99)
   - Error rate
   - Request throughput
   - Active users

2. **Database**
   - Connection pool usage
   - Query latency
   - Slow queries
   - Disk usage

3. **AI Service**
   - API call success rate
   - Token usage
   - Cost per request
   - Rate limit hits

4. **Business Metrics**
   - New signups
   - Active subscriptions
   - AI calls per user
   - Content items created

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
psql $DATABASE_URL

# Check connection pool
# Increase pool size in Prisma schema if needed
```

### Redis Connection Issues

```bash
# Test connection
redis-cli -u $REDIS_URL ping
```

### Build Failures

```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Migration Issues

```bash
# Reset database (CAUTION: destroys data)
npx prisma migrate reset

# Apply migrations
npx prisma migrate deploy
```

## Support

For deployment issues:
- Check logs in your platform dashboard
- Review error tracking (Sentry)
- Contact support@creatorops.ai

## Security Notes

- Never commit `.env` files
- Rotate secrets regularly
- Use least-privilege database users
- Enable 2FA on all service accounts
- Keep dependencies updated
- Monitor security advisories

---

**Last Updated**: December 2024