import { NextResponse } from "next/server";
import { Environment, Paddle } from "@paddle/paddle-node-sdk";

const paddle = new Paddle(process.env.PADDLE_ADMIN_TOKEN as string,{
    environment:Environment.production,
});

export async function POST(req: Request) {
  try {
    const { subscriptionId, newPriceId } = await req.json();
    
    
    if (!subscriptionId || !newPriceId) {
      return NextResponse.json(
        { error: "subscriptionId and newPriceId are required" },
        { status: 400 }
      );
    }

    const updatedSubscription = await paddle.subscriptions.update(
      subscriptionId,
      {
        items: [
          {
            priceId: newPriceId,
            quantity: 1,
          },
        ],
        prorationBillingMode: "prorated_immediately",
        
      }
    );

    return NextResponse.json({
      success: true,
      data: updatedSubscription,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "Failed to switch subscription",
      },
      { status: 500 }
    );
  }
}
