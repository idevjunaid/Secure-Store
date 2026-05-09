import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature");
  
  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe-Signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook verification failed:", error);
    return NextResponse.json({ error }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const fileName = session.metadata?.fileName;
    const fileKey = session.metadata?.fileKey;
    
    if (fileName && fileKey) {
      console.log("💰 Payment Successful!");
      console.log(`   File: ${fileName}`);
      console.log(`   S3 Key: ${fileKey}`);
      
      // TODO: Store purchase record in database here if needed
    }
  }

  return NextResponse.json({ received: true });
}