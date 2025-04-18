// AuthProvider.tsx - Handles user authentication and guest sessions
"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, signIn, signOut, signInWithRedirect } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { generateClient } from 'aws-amplify/data';
import { v4 as uuidv4 } from 'uuid';
import type { Schema } from '@/amplify/data/resource';

// Create a data client
const dataClient = generateClient<Schema>();

// Types
type UserType = {
  userId: string;
  username: string;
  email?: string;
  isAuthenticated: boolean;
  isGuest: boolean;
  sessionId?: string;
  profile?: Schema['UserProfile']['type'] | null;
};

type AuthContextType = {
  user: UserType | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  continueAsGuest: () => void;
  refreshUserProfile: () => Promise<void>;
  socialSignIn: (provider: 'Google' | 'Facebook' | 'Amazon' | 'Apple') => Promise<void>;
};

// Create context
const AuthContext = createContext<AuthContextType | null>(null);

// Helper function to get guest session ID from localStorage
const getGuestSessionId = (): string => {
  const storedId = localStorage.getItem('guestSessionId');
  if (storedId) return storedId;
  
  // Create new session ID if none exists
  const newId = uuidv4();
  localStorage.setItem('guestSessionId', newId);
  return newId;
};

// Provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from DB
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data } = await dataClient.models.UserProfile.list({
        filter: { userId: { eq: userId } }
      });
      return data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Create user profile if it doesn't exist
  const createUserProfile = async (userData: any) => {
    try {
      const { data: profile } = await dataClient.models.UserProfile.create({
        userId: userData.userId,
        username: userData.username,
        email: userData.email || '',
      });
      return profile;
    } catch (error) {
      console.error('Error creating user profile:', error);
      return null;
    }
  };

  // Refresh user profile
  const refreshUserProfile = async () => {
    if (!user || user.isGuest) return;
    
    const profile = await fetchUserProfile(user.userId);
    setUser(prev => prev ? { ...prev, profile } : null);
  };

  // Listen for auth events
  useEffect(() => {
    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signInWithRedirect":
          checkUser();
          break;
        case "signInWithRedirect_failure":
          console.error("An error occurred during the OAuth flow.");
          break;
      }
    });

    const checkUser = async () => {
      try {
        // Try to get authenticated user
        const userData = await getCurrentUser();
        
        // Get or create user profile
        let profile = await fetchUserProfile(userData.userId);
        if (!profile) {
          profile = await createUserProfile(userData);
        }

        setUser({
          userId: userData.userId,
          username: userData.username,
          email: userData.signInDetails?.loginId,
          isAuthenticated: true,
          isGuest: false,
          profile,
        });
      } catch (error) {
        // Set up guest user if not authenticated
        const sessionId = getGuestSessionId();
        setUser({
          userId: `guest-${sessionId}`,
          username: 'Guest',
          isAuthenticated: false,
          isGuest: true,
          sessionId,
        });
      } finally {
        setLoading(false);
      }
    };

    checkUser();
    
    return unsubscribe;
  }, []);

  // Handle sign in
  const handleSignIn = async (username: string, password: string) => {
    try {
      const signInResponse = await signIn({ username, password });
      if (signInResponse.isSignedIn) {
        const userData = await getCurrentUser();
        let profile = await fetchUserProfile(userData.userId);
        if (!profile) {
          profile = await createUserProfile(userData);
        }

        setUser({
          userId: userData.userId,
          username: userData.username,
          email: username, // Assuming email is used as username
          isAuthenticated: true,
          isGuest: false,
          profile,
        });
      }
      return signInResponse;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  // Handle social sign in
  const handleSocialSignIn = async (provider: 'Google' | 'Facebook' | 'Amazon' | 'Apple') => {
    try {
      await signInWithRedirect({ provider });
      // The user will be redirected to the OAuth provider
      // After successful authentication, they'll be redirected back to the app
      // The Hub listener above will handle setting the user state
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error);
      throw error;
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      const sessionId = getGuestSessionId();
      setUser({
        userId: `guest-${sessionId}`,
        username: 'Guest',
        isAuthenticated: false,
        isGuest: true,
        sessionId,
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Continue as guest
  const continueAsGuest = () => {
    if (user?.isGuest) return; // Already a guest
    
    const sessionId = getGuestSessionId();
    setUser({
      userId: `guest-${sessionId}`,
      username: 'Guest',
      isAuthenticated: false,
      isGuest: true,
      sessionId,
    });
  };

  const value = {
    user,
    loading,
    signIn: handleSignIn,
    signOut: handleSignOut,
    continueAsGuest,
    refreshUserProfile,
    socialSignIn: handleSocialSignIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 