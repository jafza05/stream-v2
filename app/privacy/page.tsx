import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="privacy-policy">
      <div className="container">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last updated: {new Date().toLocaleDateString()}</p>

        <section>
          <h2>1. Introduction</h2>
          <p>Welcome to Stream ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we handle your personal data when you use our service and tell you about your privacy rights.</p>
        </section>

        <section>
          <h2>2. Data We Collect</h2>
          <p>When you use our service, we may collect the following types of information:</p>
          <ul>
            <li>Account information (email address, name, profile picture)</li>
            <li>Authentication data from social login providers (Google, Facebook)</li>
            <li>Usage data and analytics</li>
            <li>Device and browser information</li>
          </ul>
        </section>

        <section>
          <h2>3. How We Use Your Data</h2>
          <p>We use your personal data for the following purposes:</p>
          <ul>
            <li>To provide and maintain our service</li>
            <li>To authenticate your identity</li>
            <li>To communicate with you</li>
            <li>To improve our service</li>
            <li>To protect against fraud and abuse</li>
          </ul>
        </section>

        <section>
          <h2>4. Data Sharing and Third Parties</h2>
          <p>We may share your information with:</p>
          <ul>
            <li>Authentication providers (Google, Facebook) for login purposes</li>
            <li>Service providers who assist in operating our service</li>
            <li>Law enforcement when required by law</li>
          </ul>
        </section>

        <section>
          <h2>5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Withdraw consent at any time</li>
            <li>Object to processing of your data</li>
          </ul>
        </section>

        <section>
          <h2>6. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy or our practices, please contact us at:</p>
          <p>Email: privacy@spookfishbeta.com</p>
        </section>
      </div>
    </div>
  );
} 