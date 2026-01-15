//export const runtime = "nodejs";
import { Environment, Paddle } from "@paddle/paddle-node-sdk";
import { NextResponse } from "next/server";


const paddle = new Paddle(process.env.PADDLE_ADMIN_TOKEN as string,{
    environment:Environment.production,
});


export async function POST(req: Request) {
  try {
    
    const {customerId} = await req.json()
    
    if (!customerId) {
      return NextResponse.json(
        { error: "Missing customerId" },
        { status: 400 }
      );
    }

    // Fetch transactions filtered by customer
    const transactions = await paddle.transactions.list({
      customerId: customerId,
      perPage: 20,
    });

    // ✅ Correct way: async iteration
    const transactionsArray: any[] = [];

    for await (const transaction of transactions) {
      transactionsArray.push(transaction);
    }

    
    
    return NextResponse.json({
      transactions: transactionsArray,
    });

  } catch (error: any) {
    console.error("Paddle SDK transaction fetch error:", error);

    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
