"use client";

import React, { useState } from 'react';
import { Navigation } from '@/app/components/Navigation';
import { useAuth } from '@/app/components/AuthProvider';
import Link from 'next/link';

export default function DataDeletionPage() {
  const { user, signOut } = useAuth();
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // In a real app, you would send this request to your backend
      // Here we're just simulating the request
      console.log('Deletion request submitted for:', email, 'Reason:', reason);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitted(true);
      setError('');
      
      // If the user is signed in, sign them out after deletion request
      if (user && !user.isGuest) {
        setTimeout(() => {
          signOut();
        }, 3000);
      }
    } catch (err) {
      setError('Failed to submit deletion request. Please try again or contact support.');
    }
  };

  return (
    <div>
      <Navigation />
      
      <div className="container data-deletion-page">
        <h1>Data Deletion Request</h1>
        
        {submitted ? (
          <div className="success-message">
            <h2>Request Submitted</h2>
            <p>
              Thank you for your request. We will process your data deletion within 30 days as per our privacy policy.
              You will receive a confirmation email once the process is complete.
            </p>
            <p>
              {user && !user.isGuest ? (
                "You will be signed out shortly for security reasons."
              ) : (
                <Link href="/" className="home-link">Return to Home</Link>
              )}
            </p>
          </div>
        ) : (
          <>
            <p className="instructions">
              Fill out the form below to request deletion of your personal data from our systems.
              Please note that this action cannot be undone and will permanently remove all your data including:
            </p>
            
            <ul className="deletion-details">
              <li>Your account information and profile</li>
              <li>Your saved visualization configurations</li>
              <li>Your usage history and preferences</li>
              <li>Any other personal information associated with your account</li>
            </ul>
            
            <form onSubmit={handleSubmit} className="deletion-form">
              <div className="form-group">
                <label htmlFor="email">Your Email Address</label>
                <input 
                  id="email"
                  type="email"
                  value={user?.email || email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!!user?.email}
                  required
                  placeholder="Enter your email address"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="reason">Reason for Deletion (Optional)</label>
                <textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please tell us why you're requesting data deletion"
                  rows={4}
                />
              </div>
              
              {error && <div className="error-message">{error}</div>}
              
              <div className="confirmation-checkbox">
                <input 
                  type="checkbox" 
                  id="confirm" 
                  required 
                />
                <label htmlFor="confirm">
                  I understand this action is permanent and cannot be undone
                </label>
              </div>
              
              <div className="button-group">
                <button type="submit" className="delete-button">Submit Deletion Request</button>
                <Link href="/">
                  <button type="button" className="cancel-button">Cancel</button>
                </Link>
              </div>
            </form>
          </>
        )}
        
        <div className="privacy-link">
          <p>For more information about how we handle your data, please see our <Link href="/privacy">Privacy Policy</Link>.</p>
        </div>
      </div>
    </div>
  );
} 