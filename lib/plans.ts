export interface Plan {
  name: string;
  amount: number;
  currency: string;
  interval: string;
  isPopular?: boolean;
  description: string;
  features: string[];
}

export const availablePlans: Plan[] = [
  {
    name: "Weekly plan",
    amount: 9.99,
    currency: "USD",
    interval: "week",
    description: "Great if you want to try it out before committing.",
    features: [
      "Unlimited AI meal plans",
      "AI nutrition insigihts",
      "Cancel anytime",
    ],
  },
  {
    name: "Monthly plan",
    amount: 19.99,
    currency: "USD",
    interval: "month",
    isPopular: true,
    description:
      "Perfect for on-going meal planning suited to your needs to reach your goals.",
    features: [
      "Unlimited AI meal plans",
      "Priority AI support",
      "Cancel anytime",
    ],
  },
  {
    name: "Yearly plan",
    amount: 199.99,
    currency: "USD",
    interval: "year",
    description:
      "Best value for those committed to improving their diet long-term.",
    features: [
      "Unlimited ai meal plans",
      "All premium features",
      "Cancel anytime",
    ],
  },
];

// map plan types to their correct stripe price IDs
const priceIdMap: Record<string, string> = {
  week: process.env.STRIPE_PRICE_WEEKLY!,
  month: process.env.STRIPE_PRICE_MONTHLY!,
  year: process.env.STRIPE_PRICE_YEARLY!,
};
export const getPriceIDFromType = (planType: string) => priceIdMap[planType];
