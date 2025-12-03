import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rhetix | Speak Smarter with AI",
  description:
    "Rhetix helps you speak and write with clarity and confidence using AI-crafted phrases.",
  keywords: [
    "rhetix",
    "speak better",
    "ai communication",
    "ai writing",
    "improve vocabulary",
    "speak smarter",
    "communication app",
    "ai phrases",
  ],
  icons: "/rhetix.ico",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0b0b0c] text-white`}
      >
        {children}
      </body>
    </html>
  );
}
