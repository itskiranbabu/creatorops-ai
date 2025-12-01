# CreatorOps AI - System Architecture

## Overview

CreatorOps AI is a multi-tenant SaaS platform built with Next.js 14, featuring a modern full-stack architecture optimized for scalability, security, and developer experience.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Browser    │  │    Mobile    │  │   Desktop    │      │
│  │   (React)    │  │   (Future)   │  │   (Future)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Next.js App Layer                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              App Router (React Server)               │   │
│  │  • Server Components  • Client Components            │   │
│  │  • Streaming          • Suspense Boundaries          │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                   API Routes Layer                   │   │
│  │  • REST Endpoints     • Webhooks                     │   │
│  │  • Authentication     • Business Logic               │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│    Service Layer         │  │   External Services      │
│  ┌────────────────────┐  │  │  ┌────────────────────┐  │
│  │   AI Service       │  │  │  │   Stripe API       │  │
│  │   (OpenAI)         │  │  │  │   (Payments)       │  │
│  └────────────────────┘  │  │  └────────────────────┘  │
│  ┌────────────────────┐  │  │  ┌────────────────────┐  │
│  │   Email Service    │  │  │  │   Google OAuth     │  │
│  │   (Nodemailer)     │  │  │  │   (Auth)           │  │
│  └────────────────────┘  │  │  └────────────────────┘  │
└──────────────────────────┘  └──────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
│  ┌──────────────────┐  ┌──────────────────┐                 │
│  │   PostgreSQL     │  │      Redis       │                 │
│  │   (Prisma ORM)   │  │   (Cache/Queue)  │                 │
│  │                  │  │                  │                 │
│  │  • Users         │  │  • Sessions      │                 │
│  │  • Workspaces    │  │  • Job Queue     │                 │
│  │  • Content       │  │  • Rate Limits   │                 │
│  │  • Deals         │  │  • Cache         │                 │
│  └──────────────────┘  └──────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: React 18
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Form Handling**: React Hook Form + Zod
- **Charts**: Recharts

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Next.js API Routes
- **Language**: TypeScript
- **ORM**: Prisma
- **Validation**: Zod
- **Authentication**: NextAuth.js

### Database & Cache
- **Primary Database**: PostgreSQL 15+
- **ORM**: Prisma
- **Cache**: Redis 7+
- **Job Queue**: BullMQ

### External Services
- **AI**: OpenAI API (configurable)
- **Payments**: Stripe
- **Email**: SMTP (Nodemailer)
- **OAuth**: Google

## Data Model

### Core Entities

#### User
- Authentication credentials
- Profile information
- Relationships to workspaces

#### Workspace
- Multi-tenant container
- Subscription management
- Team collaboration

#### ContentItem
- Content planning
- Platform targeting
- Scheduling
- Status tracking

#### Deal
- Sponsorship pipeline
- CRM functionality
- Activity tracking

### Relationships

```
User ──< WorkspaceMember >── Workspace
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
                    ▼             ▼             ▼
              ContentItem      Deal        Subscription
                    │             │
                    ▼             ▼
            ContentVariant   DealActivity
                             Followup
```

## Security Architecture

### Authentication Flow

```
1. User submits credentials
2. NextAuth validates against database
3. JWT token generated with user ID
4. Token stored in HTTP-only cookie
5. Middleware validates token on protected routes
6. Session refreshed automatically
```

### Multi-Tenancy

- **Workspace Isolation**: All queries filtered by `workspaceId`
- **Row-Level Security**: Prisma middleware enforces workspace boundaries
- **Role-Based Access**: Owner, Admin, Member roles
- **API Authorization**: Middleware checks workspace membership

### Data Protection

- **Encryption at Rest**: Database-level encryption
- **Encryption in Transit**: TLS/HTTPS only
- **Password Hashing**: bcrypt with salt rounds
- **Secret Management**: Environment variables
- **Input Validation**: Zod schemas on all inputs
- **SQL Injection Prevention**: Prisma parameterized queries
- **XSS Prevention**: React automatic escaping

## API Architecture

### RESTful Endpoints

```
Authentication
POST   /api/auth/signup          - User registration
POST   /api/auth/signin          - User login
POST   /api/auth/signout         - User logout

Content Management
GET    /api/content              - List content items
POST   /api/content              - Create content item
GET    /api/content/[id]         - Get content item
PUT    /api/content/[id]         - Update content item
DELETE /api/content/[id]         - Delete content item
POST   /api/content/[id]/repurpose - AI repurposing

Sponsorship CRM
GET    /api/sponsors             - List sponsors
POST   /api/sponsors             - Create sponsor
GET    /api/deals                - List deals
POST   /api/deals                - Create deal
POST   /api/deals/[id]/followup  - Generate follow-up

Webhooks
POST   /api/webhooks/stripe      - Stripe events
```

### Response Format

```typescript
// Success
{
  "success": true,
  "data": { ... }
}

// Error
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

## AI Service Architecture

### AI Request Flow

```
1. User triggers AI feature
2. Check subscription quota
3. Validate input
4. Call AI provider API
5. Log request metadata
6. Update usage counter
7. Return generated content
8. Save to database
```

### AI Service Features

- **Provider Abstraction**: Swappable AI providers
- **Rate Limiting**: Per-workspace quotas
- **Cost Tracking**: Token usage and estimates
- **Error Handling**: Retries and fallbacks
- **Logging**: All requests logged for audit

### Prompt Engineering

```typescript
// Structured prompts for consistency
{
  system: "Role and context",
  user: "Specific task with data",
  format: "Expected output structure"
}
```

## Caching Strategy

### Redis Usage

1. **Session Storage**: NextAuth sessions
2. **Rate Limiting**: API request tracking
3. **Job Queue**: Background tasks (BullMQ)
4. **Cache**: Frequently accessed data

### Cache Invalidation

- **Time-based**: TTL on cached items
- **Event-based**: Invalidate on updates
- **Manual**: Admin cache clear

## Background Jobs

### Job Types

1. **Scheduled Content Publishing**
   - Check scheduled items
   - Mark as published
   - Send notifications

2. **Follow-up Reminders**
   - Check due follow-ups
   - Send email notifications
   - Update deal activities

3. **Usage Analytics**
   - Aggregate daily stats
   - Generate reports
   - Send summaries

4. **Subscription Management**
   - Check expiring trials
   - Process renewals
   - Handle downgrades

### Job Queue Architecture

```
BullMQ Queue → Redis → Worker Processes
                │
                ├─ Retry Logic
                ├─ Dead Letter Queue
                └─ Monitoring
```

## Deployment Architecture

### Production Setup

```
┌─────────────────────────────────────────┐
│           Load Balancer / CDN           │
└─────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
┌──────────────┐        ┌──────────────┐
│  App Server  │        │  App Server  │
│   (Next.js)  │        │   (Next.js)  │
└──────────────┘        └──────────────┘
        │                       │
        └───────────┬───────────┘
                    ▼
        ┌───────────────────────┐
        │   PostgreSQL Primary  │
        │   (with replicas)     │
        └───────────────────────┘
                    │
        ┌───────────────────────┐
        │    Redis Cluster      │
        └───────────────────────┘
```

### Scaling Strategy

**Horizontal Scaling**
- Multiple Next.js instances
- Load balancer distribution
- Stateless application design

**Database Scaling**
- Read replicas for queries
- Connection pooling (PgBouncer)
- Query optimization

**Cache Scaling**
- Redis Cluster mode
- Separate cache per region
- Cache warming strategies

## Monitoring & Observability

### Metrics Collection

1. **Application Metrics**
   - Request latency
   - Error rates
   - Throughput

2. **Business Metrics**
   - User signups
   - Content created
   - AI calls made
   - Revenue (MRR/ARR)

3. **Infrastructure Metrics**
   - CPU/Memory usage
   - Database connections
   - Cache hit rates

### Logging Strategy

```typescript
// Structured logging
{
  timestamp: "2024-12-01T10:00:00Z",
  level: "info",
  service: "api",
  userId: "user_123",
  workspaceId: "ws_456",
  action: "content.create",
  duration: 150,
  metadata: { ... }
}
```

### Alerting

- **Critical**: Database down, API errors >5%
- **Warning**: High latency, quota approaching
- **Info**: Deployment completed, backup finished

## Performance Optimization

### Frontend

- **Code Splitting**: Dynamic imports
- **Image Optimization**: Next.js Image component
- **Lazy Loading**: React.lazy for components
- **Caching**: SWR/React Query
- **Bundle Size**: Tree shaking, minification

### Backend

- **Database Queries**: Indexed columns, query optimization
- **N+1 Prevention**: Prisma includes
- **Connection Pooling**: Reuse connections
- **Response Compression**: Gzip/Brotli
- **CDN**: Static assets on CDN

### Database

- **Indexes**: On frequently queried columns
- **Materialized Views**: For complex aggregations
- **Partitioning**: For large tables
- **Vacuum**: Regular maintenance

## Disaster Recovery

### Backup Strategy

- **Database**: Daily automated backups
- **Retention**: 30 days
- **Testing**: Monthly restore tests
- **Replication**: Multi-region for critical data

### Recovery Procedures

1. **Database Failure**: Promote replica
2. **Application Failure**: Auto-restart, rollback
3. **Data Corruption**: Restore from backup
4. **Security Breach**: Incident response plan

## Future Enhancements

### Planned Features

1. **Real-time Collaboration**: WebSocket support
2. **Mobile Apps**: React Native
3. **Advanced Analytics**: Custom dashboards
4. **API Access**: Public API for integrations
5. **Marketplace**: Third-party integrations

### Technical Debt

- Add comprehensive test coverage (target: 80%)
- Implement end-to-end testing
- Add performance benchmarks
- Improve error handling
- Add request tracing

---

**Document Version**: 1.0  
**Last Updated**: December 2024  
**Maintained By**: CreatorOps AI Engineering Team