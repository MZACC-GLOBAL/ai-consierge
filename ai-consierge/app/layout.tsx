import type { Metadata } from "next";

import "./globals.scss";

import AuthProvider from "./_components/AuthListener";



export const metadata: Metadata = {
  title: "Makvue Concierge",
  description: "Your AI-powered personal assistant",
  icons:{
    icon: "/plain-logo.jpg",
  },
  other:{
    facebook-domain-verification:"wh4ez6msxuzf7ndaewb1tbc9knbhho"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
