import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "@/components/layout";
import { FloatingButtons } from "@/components/widgets/FloatingButtons";
import AuthProvider from "@/components/providers/AuthProvider";
import { DataProvider } from "@/components/providers/DataProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Road Romeo - Premium Bike Services",
  description: "Expert bike servicing at your doorstep.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
          <DataProvider>
            <Header />
            <main className="flex-1 pt-24 lg:pt-32">
              {children}
            </main>
            <Footer />
            <FloatingButtons />
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
