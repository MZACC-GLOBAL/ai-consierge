import { Environment, Paddle } from "@paddle/paddle-node-sdk";
import { NextResponse } from "next/server";


const paddle = new Paddle(process.env.PADDLE_ADMIN_TOKEN as string,{
    environment:Environment.production,
});


export async function POST(req: Request) {
  try {
    const { subscriptionId } = await req.json();

    if (!subscriptionId) {
      return NextResponse.json(
        { error: "subscriptionId required" },
        { status: 400 }
      );
    }

    const result = await paddle.subscriptions.cancel(subscriptionId, {
      effectiveFrom: "next_billing_period",
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "Cancellation failed",
      },
      { status: 500 }
    );
  }
}
