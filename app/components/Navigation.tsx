"use client";

import React from 'react';
import { useAuth } from './AuthProvider';
import Link from 'next/link';

export function Navigation() {
  const { user, signOut } = useAuth();

  return (
    <nav className="main-navigation">
      <div className="nav-brand">
        <Link href="/">Stream Visualizations</Link>
      </div>
      
      <div className="nav-links">
        <Link href="/">Home</Link>
        <Link href="/visualizations">Visualizations</Link>
      </div>
      
      <div className="nav-auth">
        {user ? (
          <div className="user-menu">
            <span className="username">
              {user.isGuest ? 'Guest User' : user.username}
            </span>
            {user.isGuest ? (
              <Link href="/auth" className="auth-btn">
                Sign In
              </Link>
            ) : (
              <button onClick={signOut} className="auth-btn">
                Sign Out
              </button>
            )}
          </div>
        ) : (
          <Link href="/auth" className="auth-btn">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
} 