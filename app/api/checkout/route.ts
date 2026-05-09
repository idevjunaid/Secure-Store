import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe outside the handler to reuse the connection
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  try {
    // 1. DYNAMIC ORIGIN: Grab the URL from the request itself!
    // If it's a browser request, 'origin' exists. If not, we build it from the 'host' header.
    const origin = req.headers.get("origin") || `https://${req.headers.get("host")}`;

    const { fileName, fileKey } = await req.json();
    
    if (!fileName || !fileKey) {
      return NextResponse.json(
        { error: "fileName and fileKey are required" },
        { status: 400 }
      );
    }

    // 2. Create the Stripe Session using the dynamic origin
    const session = await stripe.checkout.sessions.create({
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: fileName },
          unit_amount: 1000, // $10.00
        },
        quantity: 1,
      }],
      mode: "payment",
      // Stripe will now send the user back to exactly where they came from
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
      metadata: { fileName, fileKey },
    });
    
    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Checkout error:", message);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}