import { db } from "@/firebase/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

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
        
        return NextResponse.json(userDoc?.data()?.users,{headers: {'Access-Control-Allow-Origin': '*'},status:201})
        
    } catch (error) {
      return NextResponse.json({error:error?.message || 'User does not exist'})
    }
    
}

export async function POST(req:NextRequest){
   const {userId,siteId,email,userName} = await req.json()
   
    try {
        const userDoc = await db.collection('users').doc(siteId).get()  
        if (!userDoc.exists) {
          
          return NextResponse.json({error:'User does not exist'})
        }
        const userArray = userDoc?.data()?.users;

        if (Array.isArray(userArray)) {
          const updatedArray = userArray.map((item) => {
            if (item['userId'] === userId) {
              return { ...item, ['isEscalated']: true,['isResolved']: false };
            }
            return item;
          });  
          await db.collection("users").doc(siteId).update({users:updatedArray})
          

          if (email) {
            const transporter = nodemailer.createTransport({
              service:"gmail",
              auth:{
                user:process.env.EMAIL_NAME,
                pass:process.env.EMAIL_PASSWORD
              }
            })
            
            await transporter.sendMail({
              from:'Ai Concierge',
              to:email, // widget owner email
              subject:'Escalation Alert',
              text:`Escalation Alert! ${userName} with ID: ${userId} is requesting human assistance`
            }).catch((err:any)=>console.log('emailing error',err))
          }
          return NextResponse.json(updatedArray,{headers: {'Access-Control-Allow-Origin': '*'},status:201})  
        } 
        else {
          return NextResponse.json({error:'Field  is not an array or does not exist',})
        }   
    } 
    catch (error) {
      return NextResponse.json({error:error?.message || 'User does not exist'})
    }

        
      
}