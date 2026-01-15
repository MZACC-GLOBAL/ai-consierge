
import axios from "axios";
import { NextResponse } from "next/server";




export async function POST(req: Request) {
    
  try {
    const { subscriptionId} = await req.json();
    
    const response = await axios.get(`https://api.paddle.com/subscriptions/${subscriptionId}/update-payment-method-transaction`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PADDLE_ADMIN_TOKEN}`,
          "Content-Type": "application/json",
        },
        
      }
    );
    
    
    return NextResponse.json({
      url: response?.data?.data?.checkout?.url ,
    });

  } catch (error: any) {
    console.error("Paddle checkout error:", error);

    return NextResponse.json(
      { error: error.message || 'just failed' },
      { status: 500 }
    );
  }
}
