import { NextResponse } from "next/server";
import { db } from '@/firebase/firebaseAdmin';
import { FieldValue, Filter } from "firebase-admin/firestore";
import nodemailer from "nodemailer";


export async function POST(req: Request) {
  const { siteId, finalText,userId,userName,isAi,email } = await req.json();

  if (!siteId ) {
    return NextResponse.json({ error: "No site id" }, { status: 400 });
  }
  else if (!userId) {
    return NextResponse.json({ error: "No user id" }, { status: 400 });
  }
  else if (!finalText) {
    return NextResponse.json({ error: "No text supplied" }, { status: 400 });
  }




  // 🔐 Optional domain check (recommended)
  const siteDoc = await db.collection("users").doc(siteId).get();
  
  if (!siteDoc.exists) {
    return NextResponse.json({ error: "You are not registered on the ai concierge platform" }, { status: 403 });
  }
  const usersData = siteDoc?.data()?.users.find((user:any)=>user.userId ===userId)
  const date = new Date().getTime()

  if (!usersData) {

    // save user if unregistered
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
      subject:`new message received from ${userName}`,
      text:`new message received: ${finalText}. from ${userName} with ID: ${userId}`
    }).catch((err:any)=>console.log('error alerting new message',err))

    await db.collection("users").doc(siteId).update({users:FieldValue.arrayUnion({userName:userName,userId:userId,isEscalated:false,mostRecent:finalText,sendTime:date})})
  }
  
   

  // ✅ Store message as its own document
  try {
   
    await db.collection("users").doc(siteId).collection("externalUsers").doc(userId+siteId).collection("messages").add({message: finalText,senderId: userId,customerName:userName,receiverId: siteId,createdAt:date,isAi:isAi})
    .then(async ()=>{
      await db.collection("users").doc(siteId).update({messageCount:FieldValue.increment(1)})
      .catch(err=>console.log('increment failure',err))
    })
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error?.message || 'error saving message' });
  }

}

export async function GET(req:Request){
    const url = new URL(req.url)
    const siteId = url.searchParams.get('siteId') as string;
    const userId = url.searchParams.get('userId') as string;
    const msgDoc = await db.collection("users").doc(siteId).collection("externalUsers").doc(userId+siteId).collection("messages").where(Filter.or(Filter.where('senderId','==',userId),Filter.where('receiverId','==',userId))).get();
    if (msgDoc.empty) {
      return NextResponse.json({ error: "No messages exist" }, { status: 200 });
    }
    try { 
      const siteDoc = await db.collection("users").doc(siteId).collection("externalUsers").doc(userId+siteId).collection("messages").where(Filter.or(Filter.where('senderId','==',userId),Filter.where('receiverId','==',userId))).orderBy('createdAt','asc').get();
      const messages = siteDoc.docs.map(doc=>({...doc.data()}))
      return NextResponse.json({ messages });
    } catch (error) {
      console.log('getting err',error);
      
      return NextResponse.json({ error:error}, {status:400});
    }

}