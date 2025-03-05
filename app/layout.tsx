import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Toaster } from 'react-hot-toast' 
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "./components/app-siderbar";
import { SidebarProvider, SidebarTrigger } from "@/app/components/ui/sidebar"
import { Card } from "./components/ui/card";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Galaxy PDF - PDF Processing Tools',
  description: 'Powerful tools to compress, convert, merge, edit, sign, and analyze your PDF documents',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SidebarProvider>
        <AppSidebar />
         <Card className="m-2 w-full min-h-screen overflow-hidden">
            <SidebarTrigger className="m-4" />
            <main className="p-2">
              {children}
            </main>
          </Card>
          <Toaster />
        </SidebarProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
