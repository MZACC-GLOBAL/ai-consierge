import { NextResponse } from "next/server";


export async function POST() {

   try{

    const res = NextResponse.json({ status: "Logged Out Successfully!" });

    // Set secure HttpOnly cookie
    res.cookies.set("auth", "", {
      path: "/",
      expires: new Date(0),
    });
    
    
    return res;
  } catch {
    return NextResponse.json({ error: "Failed to log user out!" }, { status: 401 });
  }
}
