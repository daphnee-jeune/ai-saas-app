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

    const canceledSubscription = await stripe.subscriptions.update(
     subscriptionId,
     {
       cancel_at_period_end: true,
     }
   );

   await prisma.profile.update({
    where: { userId: clerkUser.id },
    data: {
      subscriptionTier: null,
      stripeSubscriptionId: null,
      subscriptionActive: false,
    },
  });

    return NextResponse.json({ subscription: canceledSubscription });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch subscription details." },
      { status: 500 }
    );
  }
}
