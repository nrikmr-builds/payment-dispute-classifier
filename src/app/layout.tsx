import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Payment Dispute Classifier - AI-Powered Dispute Resolution",
  description: "Enterprise-grade AI tool for classifying payment disputes using Google Gemini AI. Built for financial institutions with confidence thresholds and human-in-the-loop workflows.",
  keywords: ["AI", "payment disputes", "classification", "Gemini", "financial services", "banking"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}