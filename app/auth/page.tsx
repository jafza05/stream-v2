"use client";

import React from 'react';
import { AuthUI } from '@/app/components/AuthUI';
import { useAuth } from '@/app/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function AuthPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Redirect authenticated users to home page if they're already logged in
  // (but allow guests to see the auth page to sign in)
  useEffect(() => {
    if (user && !user.isGuest) {
      router.push('/');
    }
  }, [user, router]);

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Welcome to Stream Visualizations</h1>
        <p>Sign in to save your custom visualizations and settings</p>
        <AuthUI />
        <div className="signup-link">
          <p>Don't have an account? <Link href="/auth/signup">Sign up</Link></p>
        </div>
        <div className="auth-page-footer">
          <Link href="/privacy">Privacy Policy</Link>
          <span className="separator">•</span>
          <Link href="/data-deletion">Data Deletion</Link>
        </div>
      </div>
    </div>
  );
} 