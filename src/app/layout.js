import { AuthProvider } from "@/utility/AuthProvider";
import ClientLayout from "@/features/ClientLayout";
import ReactQueryProvider from "@/utility/QueryProvider";
import { Inter } from "next/font/google";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import { CookiesProvider } from "next-client-cookies/server";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Radiant Glow Dental Clinic",
  description: "Generated by create next app",
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";
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
        <CookiesProvider>
          <AuthProvider>
            <ReactQueryProvider>
              <SidebarProvider defaultOpen={defaultOpen}>
                <ClientLayout>
                  {children}
                </ClientLayout>
              </SidebarProvider>
            </ReactQueryProvider>
          </AuthProvider>
        </CookiesProvider>
      </body>
    </html>
  );
}
