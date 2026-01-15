export const runtime = "nodejs";
import { db } from "@/firebase/firebaseAdmin";
import { Environment, EventName, Paddle } from "@paddle/paddle-node-sdk";
import axios from "axios";
import { NextResponse } from "next/server";


const paddle = new Paddle(process.env.PADDLE_ADMIN_TOKEN as string,{
    environment:Environment.production,
});

export async function POST(req: Request) {
  try {
    
    const rawBody = await req.text();
    const signature = req.headers.get("paddle-signature");
    const webhookSecret = process.env.WEBHOOK_SECRET_KEY as string;

    if (!signature) {
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 400 }
      );
    }

    const eventData = await paddle.webhooks.unmarshal(
      rawBody,
      webhookSecret,
      signature,
    );
    switch (eventData.eventType) {
        case EventName.SubscriptionActivated:
            console.log(`subscription ${eventData?.data?.id} is activated for user ${eventData?.data?.customData?.userId}`);
           
            
            await db.collection('users').doc(eventData?.data?.customData?.userId).update({
                subscriptionStatus: 'active',
                subscriptionId: eventData?.data?.id,
                plan: eventData?.data?.customData?.plan,
                customerId:eventData?.data?.customerId
            });
            break;
        case EventName.SubscriptionCanceled:
            console.log(`Subscription ${eventData?.data?.id} is canceled`);
            await db.collection('users').doc(eventData?.data?.customData?.userId).update({
                subscriptionStatus: 'inactive',
                subscriptionId: null,
                plan: null
            });
            break;
        case EventName.SubscriptionPastDue:
            console.log(`Subscription ${eventData?.data?.id} is past due`);
            break;
        case EventName.SubscriptionPaused:
            console.log(`Subscription ${eventData?.data?.id} is paused`);
            await db.collection('users').doc(eventData?.data?.customData?.userId).update({
                subscriptionStatus: 'paused',
            });
            break;
        case EventName.SubscriptionCreated:
            console.log(`Subscription ${eventData?.data?.id} created`);
            break;
        case EventName.SubscriptionResumed:
            console.log(`Subscription ${eventData?.data?.id} resumed`);
            await db.collection('users').doc(eventData?.data?.customData?.userId).update({
                subscriptionStatus: 'active',
            });
            break;
        case EventName.SubscriptionUpdated:
            console.log(`Subscription ${eventData?.data?.id} updated`);
            const newPlanName = eventData.data.items?.[0]?.price?.name;
            eventData.data.status ==='active' && await db.collection('users').doc(eventData?.data?.customData?.userId).update({
                plan:newPlanName
            });
            break;
        case EventName.PaymentMethodSaved:
            console.log(`Payment method ${eventData?.data?.id} saved`);
            break;
        case EventName.PaymentMethodDeleted:
            console.log(`Payment method ${eventData?.data?.id} deleted`);
            break;
        case EventName.TransactionPaid:
            console.log(`transaction ${eventData?.data?.id} paid`);
            break;
        case EventName.TransactionPaymentFailed:
            console.log(`transaction ${eventData?.data?.id} failed`);
            break;
            
        default:
            console.log(eventData.eventType);
        }
    return NextResponse.json({ received: true });
  }
  catch (err) {

    console.log(err);
    return NextResponse.json(
      { error: err },
      { status: 500 }
    );
  }
  
   
}




