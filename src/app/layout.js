import {Toaster} from "@/components/ui/sonner"
import ReactQueryProvider from "@/utility/QueryProvider";
import "./globals.css";
import {Inter} from "next/font/google";
import React from "react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta
          name="format-detection"
          content="telephone=no, date=no, email=no, address=no"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${inter.variable} antialiased prose underline-offset-8`}
      >
      <ReactQueryProvider>
          {children}
          <Toaster position="top-center" pauseWhenPageIsHidden={true} richColors
                   toastOptions={{
                       style: {textAlign: "center", padding: "10px",},
                   }}/>
      </ReactQueryProvider>
      </body>
    </html>
  );
}
