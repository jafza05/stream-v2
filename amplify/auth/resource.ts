import { defineAuth } from "@aws-amplify/backend";

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true
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
