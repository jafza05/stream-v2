"use client";

import { useState } from "react";
import { useAuth } from "./components/AuthProvider";
import Link from "next/link";
import { Navigation } from "./components/Navigation";
import styles from "./page.module.css";

// Import or create these icons as needed
// They are placeholders and should be replaced with your actual icons
const SportsIcon = () => <span className={styles.iconWrapper}>🏆</span>;
const FinanceIcon = () => <span className={styles.iconWrapper}>📈</span>;
const DashboardIcon = () => <span className={styles.iconWrapper}>📊</span>;
const CustomIcon = () => <span className={styles.iconWrapper}>⚙️</span>;
const RealTimeIcon = () => <span className={styles.iconWrapper}>⚡</span>;
const ApiIcon = () => <span className={styles.iconWrapper}>🔌</span>;

export default function Home() {
  const { user, loading, signIn, signOut } = useAuth();
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  const handleCardSelect = (category: string) => {
    setActiveCard(category);
    setMessage(`Opening ${category} visualizations...`);
    // This would actually navigate in a real implementation
    // setTimeout to simulate navigation delay
    setTimeout(() => {
      setMessage("");
      setActiveCard(null);
    }, 2000);
  };

  const displayOptions = [
    { 
      id: "sports", 
      name: "Sports Data", 
      icon: <SportsIcon />,
      description: "Real-time statistics and scores",
      path: "/visualizations?category=sports"
    },
    { 
      id: "financial", 
      name: "Financial", 
      icon: <FinanceIcon />,
      description: "Market trends and analysis",
      path: "/visualizations?category=financial"  
    },
    { 
      id: "dashboard", 
      name: "Dashboards", 
      icon: <DashboardIcon />,
      description: "Your personalized views",
      path: "/visualizations/custom"  
    },
    { 
      id: "custom", 
      name: "Custom Views", 
      icon: <CustomIcon />,
      description: "Build your own visualizations",
      path: "/visualizations/new"  
    },
    { 
      id: "realtime", 
      name: "Real-time", 
      icon: <RealTimeIcon />,
      description: "Live data streams",
      path: "/visualizations/realtime"  
    },
    { 
      id: "api", 
      name: "API Access", 
      icon: <ApiIcon />,
      description: "Connect to our data",
      path: "/api/docs"  
    }
  ];

  return (
    <main className={styles.mainContainer}>
      <Navigation />
      
      <div className={styles.centeredContent}>
        {/* Logo and Title Section */}
        <div className={styles.logoSection}>
          <div className={styles.logo}>
            {/* Replace with your actual logo */}
            <span className={styles.logoText}>Stream</span>
          </div>
          <h1 className={styles.mainTitle}>
            {user ? "Select Visualization" : "Real-time Data Visualizations"}
          </h1>
          {!user && (
            <p className={styles.subtitle}>
              Explore sports, financial, and other data through customizable dashboards
            </p>
          )}
        </div>

        {user ? (
          <>
            {/* Display Options Grid */}
            <div className={styles.optionsGrid}>
              {displayOptions.map((option) => (
                <Link 
                  href={option.path} 
                  key={option.id}
                  className={`${styles.optionCard} ${activeCard === option.id ? styles.activeCard : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleCardSelect(option.name);
                  }}
                >
                  <div className={styles.cardIcon}>{option.icon}</div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{option.name}</h3>
                    <p className={styles.cardDescription}>{option.description}</p>
                  </div>
                  <div className={styles.cardGlow}></div>
                </Link>
              ))}
            </div>

            {/* Status Message */}
            {message && (
              <div className={styles.statusMessage}>
                {message}
              </div>
            )}
          </>
        ) : (
          /* Login/Guest Buttons */
          <div className={styles.authButtons}>
            <Link href="/auth?mode=signin" className={styles.primaryButton}>
              Sign In
            </Link>
            <Link href="/visualizations?guest=true" className={styles.secondaryButton}>
              Continue as Guest
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
