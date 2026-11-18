import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "../components/providers";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SalonBook — Luxury Salon Appointment Booking Platform",
  description:
    "Explore bespoke salon services, book master stylist appointments, and pay securely online.",
  keywords: [
    "Salon appointment booking",
    "Luxury hair salon",
    "Skincare and facial treatment",
    "Spa massage",
    "Better Auth",
    "Stripe checkout",
  ],
  authors: [{ name: "SalonBook Team" }],
  openGraph: {
    title: "SalonBook — Salon Appointment Booking Platform",
    description:
      "Explore premier salon services, schedule appointments, and manage payments effortlessly.",
    url: "https://salonbook.app",
    siteName: "SalonBook",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fdfbf7] text-stone-900 selection:bg-amber-100 selection:text-amber-900">
        <Providers>
          <Suspense fallback={<div className="h-20 bg-white border-b border-stone-200" />}>
            <Navbar />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
