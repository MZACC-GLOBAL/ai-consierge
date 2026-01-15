export const runtime = "nodejs";
import { Environment, EventName, Paddle } from "@paddle/paddle-node-sdk";
import { NextResponse } from "next/server";


const paddle = new Paddle(process.env.PADDLE_ADMIN_TOKEN as string,{
    environment:Environment.production,
});


export async function POST(req: Request) {
    try {
        //paddle.transactions.
        const { subscriptionId } = await req.json();
        const sub = await paddle.subscriptions.get(subscriptionId); 
        //console.log(sub);
        
        return NextResponse.json({ endDate:sub.currentBillingPeriod?.endsAt, });
    } catch (error: any) {
        return NextResponse.json({error: error?.message || "fetching your subscription failed"},{ status: 500 });
    }
    
}