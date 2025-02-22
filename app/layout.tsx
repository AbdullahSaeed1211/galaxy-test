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
  title: 'Galaxy AI - Video Transformation',
  description: 'Transform your videos using AI',
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
         <Card className="m-2 w-full">
            <SidebarTrigger className="m-2" />
            {children}
          </Card>
          <Toaster />
        </SidebarProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
