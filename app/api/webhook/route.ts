import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

// connect with stripe
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  let event: Stripe.Event;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature || "",
      webhookSecret
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  try {
   switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutSessionCompleted(session);
      break;
    }
    case "invoice.payment_failed": {
      const session = event.data.object as Stripe.Invoice;
      await handleInvoicePaymentFailed(session);
      break;
    }
    case "customer.subscription.deleted": {
      const session = event.data.object as Stripe.Subscription;
      await handleCustomerSubscriptionDeleted(session);
      break;
    }
    default:
      console.log("Unhandled event type" + event.type);
  }
  } catch(error: any){
   return NextResponse.json({ error: error.message}, { status: 400})
  }
  return NextResponse.json({})
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  const userId = session.metadata?.clerkUserId;
  if (!userId) {
    console.log("No user id");
    return;
  }
  const subscriptionId = session?.subscription as string;
  if (!subscriptionId) {
    console.log("No subscription id");
    return;
  }
  // Upate fields in the db on success
  try {
    await prisma.profile.update({
      where: { userId },
      data: {
        stripeSubscriptionId: subscriptionId,
        subscriptionActive: true,
        subscriptionTier: session.metadata?.planType || null,
      },
    });
  } catch (error: any) {
    console.log(error.message);
  }
}
async function handleInvoicePaymentFailed(session: Stripe.Invoice) {}
async function handleCustomerSubscriptionDeleted(
  session: Stripe.Subscription
) {}
