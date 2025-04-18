import { defineAuth, secret } from "@aws-amplify/backend";

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      google: {
        clientId: secret('GOOGLE_CLIENT_ID'),
        clientSecret: secret('GOOGLE_CLIENT_SECRET'),
        scopes: ['profile', 'email', 'openid']
      },
      facebook: {
        clientId: secret('FACEBOOK_CLIENT_ID'),
        clientSecret: secret('FACEBOOK_CLIENT_SECRET'),
        scopes: ['public_profile', 'email']
      },
      callbackUrls: [
        'https://www.spookfishbeta.com/auth',
        'https://www.spookfishbeta.com/login',
        'https://www.spookfishbeta.com/',
        'http://localhost:3000/auth',
        'http://localhost:3000/login',
        'http://localhost:3000/',
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:3003'
      ],
      logoutUrls: [
        'https://www.spookfishbeta.com/',
        'https://www.spookfishbeta.com/auth',
        'http://localhost:3000/',
        'http://localhost:3000/auth'
      ]
    }
    // Social providers removed - add them back when you've set up the secrets
    // To add social providers back:
    // 1. Create secrets with: npx ampx sandbox secret set GOOGLE_CLIENT_ID your-client-id
    // 2. Do the same for GOOGLE_CLIENT_SECRET, FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET
    // 3. Then uncomment the externalProviders configuration
  },
  // Keep multi-factor authentication
  multifactor: {
    mode: "OPTIONAL",
    sms: true,
  },
});
