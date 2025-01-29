import ReactQueryProvider from "@/utility/QueryProvider";
import "./globals.css";
import {Inter} from "next/font/google";
import React from "react";
import {Toaster} from "react-hot-toast";

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
	      <Toaster/>
      </ReactQueryProvider>
      </body>
    </html>
  );
}
