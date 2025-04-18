"use client";

import { Amplify } from "aws-amplify";
import amplifyconfig from "@/amplify_outputs.json";
import { AuthProvider } from "@/app/components/AuthProvider";
import { configureSocialAuth } from "@/app/config/auth";

// Initialize Amplify when running in browser
const configureAmplify = () => {
  if (typeof window !== "undefined") {
    Amplify.configure(amplifyconfig);
    // Also configure social auth
    configureSocialAuth();
  }
};

export function ClientLayout({ children }: { children: React.ReactNode }) {
  // Initialize Amplify
  configureAmplify();
  
  return <AuthProvider>{children}</AuthProvider>;
} 