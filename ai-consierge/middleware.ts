export const runtime = "nodejs";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authAdmin } from "./firebase/firebaseAdmin";

export async function middleware(request:NextRequest){

   const token = request.cookies.get("auth")?.value;
   const path = request.nextUrl.pathname;
   const isProtected = path.startsWith("/dashboard");
   const isAuthPage = path.startsWith("/auth");
   let isAuthenticated = false;



   if(request.nextUrl.pathname === '/dashboard'){
    
    return NextResponse.redirect(new URL("/dashboard/analytics",request.nextUrl))


   }
   if (token) {
    
    try {
      await authAdmin.verifyIdToken(token);
      isAuthenticated = true;
      
    } catch {
    
      isAuthenticated = false;
    }
  }

  // ----- 2. BLOCK UNAUTHENTICATED USERS FROM DASHBOARD -----
  if (isProtected && !isAuthenticated) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // ----- 3. BLOCK AUTHENTICATED USERS FROM AUTH PAGE -----
  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
   
}



export const config = {
  matcher: ["/dashboard/:path*", "/dashboard","/auth"]
};



