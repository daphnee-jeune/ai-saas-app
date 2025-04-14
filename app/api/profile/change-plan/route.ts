import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { getPriceIDFromType } from "@/lib/plans";

export async function POST(request: NextRequest) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { newPlan } = await request.json();

    if (!newPlan) {
      return NextResponse.json({ error: "New plan is required" });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: clerkUser.id },
    });
    if (!profile) {
      return NextResponse.json({ error: "No profile found" });
    }

    if (!profile.stripeSubscriptionId) {
      return NextResponse.json({ error: "No active subscription found" });
    }

    const subscriptionId = profile.stripeSubscriptionId;

    // retrieve sub using stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const subscriptionItemId = subscription.items.data[0]?.id;

    if (!subscriptionItemId) {
      return NextResponse.json({ error: "No active subscription found" });
    }
    const updatedSubscription = await stripe.subscriptions.update(
      subscriptionId,
      {
        cancel_at_period_end: false,
        items: [
          {
            id: subscriptionId,
            price: getPriceIDFromType(newPlan),
          },
        ],
        proration_behavior: "create_prorations",
      }
    );

    await prisma.profile.update({
      where: { userId: clerkUser.id },
      data: {
        subscriptionTier: newPlan,
        stripeSubscriptionId: updatedSubscription.id,
        subscriptionActive: true,
      },
    });

    return NextResponse.json({ subscription: updatedSubscription });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch subscription details." },
      { status: 500 }
    );
  }
}
