# CreatorOps AI

**The AI Operating System that runs your creator business**

CreatorOps AI is a production-ready, AI-native SaaS platform designed for content creators, agencies, and solo entrepreneurs. Automate content planning, repurposing, scheduling, and sponsorship management while AI handles your operations.

## Features

- **Content Planning & Calendar**: Plan, schedule, and track content across YouTube, Instagram, LinkedIn, and TikTok
- **AI Content Repurposing**: Automatically generate platform-specific variations, hooks, captions, and hashtags
- **Sponsorship CRM**: Track deals, manage sponsors, and visualize your pipeline with Kanban boards
- **Follow-up Agent**: AI-generated follow-up emails and automated reminders
- **Analytics Dashboard**: Track performance, get AI-powered insights and recommendations
- **Multi-tenant SaaS**: Workspace-based architecture with role-based access control

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod

### Backend
- **Runtime**: Node.js
- **Framework**: Next.js API Routes
- **Database**: PostgreSQL (Prisma ORM)
- **Caching**: Redis + BullMQ
- **Authentication**: NextAuth.js (Email/Password + Google OAuth)

### AI & Services
- **AI Provider**: OpenAI-compatible API (configurable)
- **Payments**: Stripe (Subscriptions + Webhooks)
- **Email**: Nodemailer (SMTP)

### Infrastructure
- **Hosting**: Railway / Vercel
- **Database**: Managed PostgreSQL (Supabase / Neon / Railway)
- **Redis**: Managed Redis instance
- **CI/CD**: GitHub Actions

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Redis instance
- Stripe account
- OpenAI API key (or compatible provider)

### Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/creatorops"

# Redis
REDIS_URL="redis://host:6379"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# AI Provider
AI_PROVIDER_API_KEY="your-openai-api-key"
AI_PROVIDER_BASE_URL="https://api.openai.com/v1"
AI_MODEL="gpt-4-turbo-preview"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
EMAIL_FROM="CreatorOps AI <noreply@creatorops.ai>"

# App Config
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the app.

## Database Schema

The application uses a multi-tenant architecture with workspace isolation:

- **User**: Authentication and profile
- **Workspace**: Tenant container
- **WorkspaceMember**: User-workspace relationships with roles
- **Subscription**: Billing and plan management
- **ContentItem**: Content planning and scheduling
- **ContentVariant**: AI-generated content variations
- **Sponsor**: Brand/sponsor information
- **Deal**: Sponsorship pipeline management
- **DealActivity**: Deal history and notes
- **Followup**: Automated follow-up tracking
- **AIRequestLog**: AI usage monitoring

## API Routes

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login (NextAuth)
- `POST /api/auth/signout` - User logout

### Content
- `GET /api/content` - List content items
- `POST /api/content` - Create content item
- `POST /api/content/[id]/repurpose` - AI repurposing

### Webhooks
- `POST /api/webhooks/stripe` - Stripe subscription events

## Deployment

### Railway Deployment

1. **Create Railway Project**:
   ```bash
   railway login
   railway init
   ```

2. **Add Services**:
   - PostgreSQL database
   - Redis instance
   - Web service (Next.js app)

3. **Set Environment Variables** in Railway dashboard

4. **Deploy**:
   ```bash
   railway up
   ```

### CI/CD Pipeline

The project includes GitHub Actions for:
- Linting and type checking
- Running tests
- Building the application
- Automatic deployment on push to `main`

## Subscription Plans

### Free
- 1 workspace
- 50 AI calls/month
- 50 content items
- Basic analytics

### Pro ($29/month)
- 1 workspace
- 500 AI calls/month
- Unlimited content items
- Sponsorship CRM
- Follow-up agent
- Advanced analytics

### Agency ($99/month)
- Multiple workspaces
- 2000 AI calls/month
- Unlimited content items
- Full CRM access
- Priority support
- Team collaboration

## Security

- OWASP Top 10 compliant
- Input validation and sanitization
- CSRF protection
- XSS prevention
- Secure password hashing (bcrypt)
- JWT session management
- Multi-tenant data isolation
- Role-based access control

## Monitoring & Observability

- Centralized logging for all services
- AI request tracking and cost estimation
- Error monitoring and alerting
- Health check endpoints
- Performance metrics

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run linting
npm run lint
```

## Project Structure

```
creatorops-ai/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Landing page
│   │   └── providers.tsx      # React providers
│   ├── components/
│   │   └── ui/                # UI components
│   └── lib/
│       ├── ai-service.ts      # AI integration
│       ├── auth.ts            # NextAuth config
│       ├── prisma.ts          # Prisma client
│       ├── redis.ts           # Redis client
│       ├── stripe.ts          # Stripe config
│       └── utils.ts           # Utility functions
├── .env.example               # Environment template
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
└── tailwind.config.ts         # Tailwind config
```

## Contributing

This is a production application. For contributions:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

Proprietary - All rights reserved

## Support

For support, email support@creatorops.ai or open an issue in the repository.

---

Built with ❤️ by the CreatorOps AI team