"use client";

import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import { confirmSignUp, resetPassword, signUp } from 'aws-amplify/auth';
import Link from 'next/link';

// Authentication UI component
export function AuthUI() {
  const { user, signIn, continueAsGuest, socialSignIn } = useAuth();
  const [activeView, setActiveView] = useState<'signin' | 'signup' | 'confirm' | 'reset'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      setError('');
      // Show success message instead of error
      setActiveView('signin');
      // Set a temporary success message in signin form
      setTimeout(() => {
        setError('Password reset instructions sent to your email');
      }, 100);
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
            <p className="auth-subtitle">Welcome back! Sign in to your account</p>
            
            <form onSubmit={handleSignIn}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-with-icon">
                  <i className="fa fa-envelope"></i>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="input-field"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-with-icon">
                  <i className="fa fa-lock"></i>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                    required
                    className="input-field"
                  />
                  <button 
                    type="button" 
                    className="password-toggle" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              
              {error && (
                <div className="auth-message error">
                  <i className="fa fa-exclamation-circle"></i>
                  {error}
                </div>
              )}
              
              <div className="forgot-password">
                <button
                  type="button"
                  onClick={() => setActiveView('reset')}
                  disabled={loading}
                  className="text-button"
                >
                  Forgot Password?
                </button>
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="auth-button primary-button"
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Signing in...
                  </>
                ) : 'Sign In'}
              </button>
            </form>
            
            <div className="auth-separator">
              <span>OR</span>
            </div>
            
            <div className="social-buttons">
              <button
                type="button"
                onClick={() => socialSignIn('Google')}
                className="social-button google-button"
                disabled={loading}
              >
                <i className="fa fa-google"></i> Continue with Google
              </button>
              
              <button
                type="button"
                onClick={() => socialSignIn('Facebook')}
                className="social-button facebook-button"
                disabled={loading}
              >
                <i className="fa fa-facebook"></i> Continue with Facebook
              </button>
            </div>
            
            <div className="auth-footer">
              <p>Don't have an account?</p>
              <button
                type="button"
                onClick={() => setActiveView('signup')}
                disabled={loading}
                className="text-button highlighted"
              >
                Create account
              </button>
            </div>
            
            <div className="guest-login">
              <button
                type="button"
                onClick={continueAsGuest}
                disabled={loading}
                className="text-button muted"
              >
                Continue as Guest
              </button>
            </div>
          </div>
        );
      
      case 'signup':
        return (
          <div className="auth-form">
            <h2>Create Account</h2>
            <p className="auth-subtitle">Join Stream to create and save your visualizations</p>
            
            <form onSubmit={handleSignUp}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-with-icon">
                  <i className="fa fa-envelope"></i>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="input-field"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-with-icon">
                  <i className="fa fa-lock"></i>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    required
                    className="input-field"
                  />
                  <button 
                    type="button" 
                    className="password-toggle" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <div className="password-requirements">
                  Password must be at least 8 characters.
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-with-icon">
                  <i className="fa fa-lock"></i>
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    className="input-field"
                  />
                </div>
              </div>
              
              {error && (
                <div className="auth-message error">
                  <i className="fa fa-exclamation-circle"></i>
                  {error}
                </div>
              )}
              
              <button 
                type="submit" 
                disabled={loading}
                className="auth-button primary-button"
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Creating Account...
                  </>
                ) : 'Create Account'}
              </button>
            </form>
            
            <div className="auth-separator">
              <span>OR</span>
            </div>
            
            <div className="social-buttons">
              <button
                type="button"
                onClick={() => socialSignIn('Google')}
                className="social-button google-button"
                disabled={loading}
              >
                <i className="fa fa-google"></i> Sign up with Google
              </button>
              
              <button
                type="button"
                onClick={() => socialSignIn('Facebook')}
                className="social-button facebook-button"
                disabled={loading}
              >
                <i className="fa fa-facebook"></i> Sign up with Facebook
              </button>
            </div>
            
            <div className="auth-footer">
              <p>Already have an account?</p>
              <button
                type="button"
                onClick={() => setActiveView('signin')}
                disabled={loading}
                className="text-button highlighted"
              >
                Sign in
              </button>
            </div>
            
            <div className="terms-privacy">
              <p>
                By creating an account, you agree to our{' '}
                <Link href="/terms">Terms of Service</Link> and{' '}
                <Link href="/privacy">Privacy Policy</Link>.
              </p>
            </div>
          </div>
        );
      
      case 'confirm':
        return (
          <div className="auth-form">
            <h2>Verify Your Email</h2>
            <p className="auth-subtitle">We've sent a confirmation code to {email}</p>
            
            <form onSubmit={handleConfirmSignUp}>
              <div className="form-group">
                <label htmlFor="confirmationCode">Confirmation Code</label>
                <div className="input-with-icon">
                  <i className="fa fa-key"></i>
                  <input
                    id="confirmationCode"
                    type="text"
                    value={confirmationCode}
                    onChange={(e) => setConfirmationCode(e.target.value)}
                    placeholder="Enter confirmation code"
                    required
                    className="input-field"
                  />
                </div>
                <div className="code-hint">
                  Please check your email and spam folder for the confirmation code.
                </div>
              </div>
              
              {error && (
                <div className="auth-message error">
                  <i className="fa fa-exclamation-circle"></i>
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="auth-button primary-button"
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Verifying...
                  </>
                ) : 'Verify Email'}
              </button>
              
              <div className="resend-code">
                <p>Didn't receive the code?</p>
                <button
                  type="button"
                  onClick={() => handleSignUp}
                  disabled={loading}
                  className="text-button"
                >
                  Resend code
                </button>
              </div>
              
              <div className="auth-footer">
                <button
                  type="button"
                  onClick={() => setActiveView('signup')}
                  disabled={loading}
                  className="text-button"
                >
                  <i className="fa fa-arrow-left"></i> Back to sign up
                </button>
              </div>
            </form>
          </div>
        );
      
      case 'reset':
        return (
          <div className="auth-form">
            <h2>Reset Password</h2>
            <p className="auth-subtitle">Enter your email to receive password reset instructions</p>
            
            <form onSubmit={handleResetPassword}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-with-icon">
                  <i className="fa fa-envelope"></i>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="input-field"
                  />
                </div>
              </div>
              
              {error && (
                <div className="auth-message error">
                  <i className="fa fa-exclamation-circle"></i>
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="auth-button primary-button"
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Sending Instructions...
                  </>
                ) : 'Send Reset Instructions'}
              </button>
              
              <div className="auth-footer">
                <button
                  type="button"
                  onClick={() => setActiveView('signin')}
                  disabled={loading}
                  className="text-button"
                >
                  <i className="fa fa-arrow-left"></i> Back to sign in
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