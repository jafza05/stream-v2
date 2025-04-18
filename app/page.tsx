"use client";

import { useState, useEffect } from "react";
import { Navigation } from "./components/Navigation";
import { useAuth } from "./components/AuthProvider";
import Link from "next/link";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";

// Initialize Amplify
if (typeof window !== "undefined") {
  Amplify.configure(outputs);
}

export default function Home() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <main className="main-container">
      <Navigation />
      
      <div className="hero-section">
        <h1>Real-time Data Visualizations</h1>
        <p className="hero-subtitle">
          Explore sports, financial, and other data through customizable visualizations
        </p>
      </div>

      <div className="features-section">
        <div className="feature-card">
          <h2>Sports Data</h2>
          <p>Real-time statistics, scores, and analytics for various sports competitions</p>
          <Link href="/visualizations?category=sports" className="feature-link">
            Explore Sports Data
          </Link>
        </div>

        <div className="feature-card">
          <h2>Financial Markets</h2>
          <p>Track stocks, cryptocurrencies, and other financial instruments in real-time</p>
          <Link href="/visualizations?category=financial" className="feature-link">
            Explore Financial Data
          </Link>
        </div>

        <div className="feature-card">
          <h2>Custom Dashboards</h2>
          <p>Create your personalized dashboards with the data that matters to you</p>
          <Link href="/visualizations/custom" className="feature-link">
            Create Dashboard
          </Link>
        </div>
      </div>

      {user && (
        <div className="user-dashboard">
          <h2>{user.isGuest ? "Guest Dashboard" : "Your Dashboard"}</h2>
          
          {user.isGuest ? (
            <div className="guest-message">
              <p>
                You're browsing as a guest. Your settings will be saved in this browser only.
                <Link href="/auth" className="auth-link">
                  Sign in or create an account
                </Link>
                to save your settings across devices.
              </p>
            </div>
          ) : (
            <div className="user-visualizations">
              <p>Welcome back, {user.username}!</p>
              <div className="visualization-list">
                <p>Your saved visualizations will appear here.</p>
                <Link href="/visualizations/new" className="create-btn">
                  Create New Visualization
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
