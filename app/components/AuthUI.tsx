"use client";

import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import { confirmSignUp, resetPassword, signUp } from 'aws-amplify/auth';

// Authentication UI component
export function AuthUI() {
  const { user, signIn, continueAsGuest } = useAuth();
  const [activeView, setActiveView] = useState<'signin' | 'signup' | 'confirm' | 'reset'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle sign in
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await signIn(email, password);
    } catch (error: any) {
      setError(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  // Handle sign up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    try {
      await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
          },
          autoSignIn: true,
        },
      });
      setActiveView('confirm');
    } catch (error: any) {
      setError(error.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  // Handle confirmation code submission
  const handleConfirmSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await confirmSignUp({
        username: email,
        confirmationCode,
      });
      setActiveView('signin');
    } catch (error: any) {
      setError(error.message || 'Failed to confirm sign up');
    } finally {
      setLoading(false);
    }
  };

  // Handle password reset request
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await resetPassword({ username: email });
      setError('Password reset instructions sent to your email');
    } catch (error: any) {
      setError(error.message || 'Failed to request password reset');
    } finally {
      setLoading(false);
    }
  };

  // Render appropriate view based on state
  const renderView = () => {
    switch (activeView) {
      case 'signin':
        return (
          <div className="auth-form">
            <h2>Sign In</h2>
            <form onSubmit={handleSignIn}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <div className="error">{error}</div>}
              <div className="auth-actions">
                <button type="submit" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('signup')}
                  disabled={loading}
                >
                  Create Account
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('reset')}
                  disabled={loading}
                >
                  Forgot Password
                </button>
                <button
                  type="button"
                  onClick={continueAsGuest}
                  disabled={loading}
                >
                  Continue as Guest
                </button>
              </div>
            </form>
          </div>
        );
      
      case 'signup':
        return (
          <div className="auth-form">
            <h2>Create Account</h2>
            <form onSubmit={handleSignUp}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              {error && <div className="error">{error}</div>}
              <div className="auth-actions">
                <button type="submit" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('signin')}
                  disabled={loading}
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          </div>
        );
      
      case 'confirm':
        return (
          <div className="auth-form">
            <h2>Confirm Sign Up</h2>
            <form onSubmit={handleConfirmSignUp}>
              <div className="form-group">
                <label htmlFor="confirmationCode">Confirmation Code</label>
                <input
                  id="confirmationCode"
                  type="text"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  required
                />
              </div>
              {error && <div className="error">{error}</div>}
              <div className="auth-actions">
                <button type="submit" disabled={loading}>
                  {loading ? 'Confirming...' : 'Confirm'}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('signin')}
                  disabled={loading}
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          </div>
        );
      
      case 'reset':
        return (
          <div className="auth-form">
            <h2>Reset Password</h2>
            <form onSubmit={handleResetPassword}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {error && <div className="error">{error}</div>}
              <div className="auth-actions">
                <button type="submit" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset Instructions'}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('signin')}
                  disabled={loading}
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          </div>
        );
      
      default:
        return null;
    }
  };

  // If user is already authenticated or a guest, don't show auth UI
  if (user) {
    return (
      <div className="user-status">
        <p>
          {user.isGuest 
            ? 'You are browsing as a guest. Your preferences will be saved to this device only.'
            : `Welcome, ${user.username}!`}
        </p>
      </div>
    );
  }

  return (
    <div className="auth-container">
      {renderView()}
    </div>
  );
} 