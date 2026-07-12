import Stripe from "stripe";

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || /your-|placeholder/i.test(key)) return null;
  return new Stripe(key);
}

export function isStripeReady() {
  return !!getStripe();
}
