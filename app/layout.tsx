import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Amplify } from "aws-amplify";
import amplifyconfig from "@/amplify_outputs.json";

// Initialize Amplify when running in browser
const configureAmplify = () => {
  if (typeof window !== "undefined") {
    Amplify.configure(amplifyconfig);
  }
};

// Define font
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stream Visualizations",
  description: "Real-time data visualizations for sports, financial, and more",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize Amplify
  configureAmplify();
  
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* In Next.js 14, we need to use a client component wrapper for the AuthProvider */}
        <AuthProviderWrapper>{children}</AuthProviderWrapper>
      </body>
    </html>
  );
}

// Client component wrapper for AuthProvider
"use client";
import { AuthProvider } from "@/app/components/AuthProvider";

function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
