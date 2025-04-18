"use client";

import { AuthProvider } from "./AuthProvider";

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
} 