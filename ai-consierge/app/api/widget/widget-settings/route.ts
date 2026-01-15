import { db } from "@/firebase/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";

export async function OPTIONS() {
  // Respond to preflight requests
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}


export async function GET(req:NextRequest){
    const url = new URL(req.url)
    const siteId = url.searchParams.get('siteId') as string
   
    
    if (!siteId) {
        
      return NextResponse.json({error:'No site id supplied'})
    }
    try {
        const userDoc = await db.collection('users').doc(siteId).get()  
        if (!userDoc.exists) {
          
          return NextResponse.json({error:'User does not exist'})
        }
        return NextResponse.json(userDoc?.data()?.widgetSettings,{headers: {'Access-Control-Allow-Origin': '*'},status:201})
        
    } catch (error) {
      return NextResponse.json({error:error?.message || 'User does not exist'})
    }
    
}
