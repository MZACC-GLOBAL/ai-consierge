import { NextResponse } from "next/server";
import { authAdmin } from "@/firebase/firebaseAdmin";
import nodemailer from 'nodemailer'


export async function POST(req: Request) {
  const { token,email } = await req.json();

  try {
    // Verify token using Firebase Admin SDK
    const decoded = await authAdmin.verifyIdToken(token);
    
    const res = NextResponse.json({ status: "User Authenticated Successfully!" });
    
    const transporter = nodemailer.createTransport({
      service:"gmail",
      auth:{
        user:process.env.EMAIL_NAME,
        pass:process.env.EMAIL_PASSWORD
      }
    })
    
    email && await transporter.sendMail({
      from:'Ai Concierge',
      to:'makvueconciergehq@gmail.com', // staff email
      subject:'New registeration',
      text:`A new user: ${email} has just been registered`
    }).catch((err:any)=>console.log('error',err))
    
    // Set secure HttpOnly cookie
    res.cookies.set("auth", token, {
      httpOnly: false,
      secure: true,
      sameSite: "strict",
      path: "/",
      
      maxAge: 60*60 *24 *3 // 7 days
    });
    
    
    return res;
  } catch(error) {
    console.log("Authentication error:", error);
    return NextResponse.json({ error: "Invalid token, failed to authenticate user!" }, { status: 401 });
  }
}
