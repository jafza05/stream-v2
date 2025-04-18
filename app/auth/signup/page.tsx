"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/components/AuthProvider';
import { signUp, confirmSignUp } from 'aws-amplify/auth';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const { socialSignIn } = useAuth();
  const [formState, setFormState] = useState<'signup' | 'confirm'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      setFormState('confirm');
    } catch (error: any) {
      setError(error.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await confirmSignUp({
        username: email,
        confirmationCode,
      });
      router.push('/auth');
    } catch (error: any) {
      setError(error.message || 'Failed to confirm sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Create your account</h1>
        
        {formState === 'signup' ? (
          <>
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
                <Link href="/auth">
                  <button type="button">
                    Back to Sign In
                  </button>
                </Link>
              </div>
            </form>
            
            <div className="social-login">
              <hr />
              <p>Or sign up with:</p>
              <div className="social-buttons">
                <button
                  type="button"
                  onClick={() => socialSignIn('Google')}
                  className="social-button google-button"
                  disabled={loading}
                >
                  <i className="fa fa-google"></i> Google
                </button>
                <button
                  type="button"
                  onClick={() => socialSignIn('Facebook')}
                  className="social-button facebook-button"
                  disabled={loading}
                >
                  <i className="fa fa-facebook"></i> Facebook
                </button>
              </div>
            </div>
          </>
        ) : (
          <form onSubmit={handleConfirmSignUp}>
            <div className="form-group">
              <label htmlFor="confirmationCode">Confirmation Code</label>
              <p className="hint">Please check your email for the confirmation code.</p>
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
                {loading ? 'Confirming...' : 'Confirm Signup'}
              </button>
              <button
                type="button"
                onClick={() => setFormState('signup')}
                disabled={loading}
              >
                Back
              </button>
            </div>
          </form>
        )}
        
        <div className="auth-page-footer">
          <Link href="/privacy">Privacy Policy</Link>
          <span className="separator">•</span>
          <Link href="/data-deletion">Data Deletion</Link>
        </div>
      </div>
    </div>
  );
} 