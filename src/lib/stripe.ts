import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});

export const STRIPE_PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    priceId: null,
    aiCallsLimit: 50,
    contentItemsLimit: 50,
    features: [
      '1 workspace',
      '50 AI calls/month',
      '50 content items',
      'Basic analytics',
    ],
  },
  PRO: {
    name: 'Pro',
    price: 29,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    aiCallsLimit: 500,
    contentItemsLimit: -1,
    features: [
      '1 workspace',
      '500 AI calls/month',
      'Unlimited content items',
      'Sponsorship CRM',
      'Follow-up agent',
      'Advanced analytics',
    ],
  },
  AGENCY: {
    name: 'Agency',
    price: 99,
    priceId: process.env.STRIPE_AGENCY_PRICE_ID,
    aiCallsLimit: 2000,
    contentItemsLimit: -1,
    features: [
      'Multiple workspaces',
      '2000 AI calls/month',
      'Unlimited content items',
      'Full CRM access',
      'Priority support',
      'Team collaboration',
    ],
  },
};