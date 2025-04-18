import { defineAuth, secret } from "@aws-amplify/backend";

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
    phone: undefined,
    externalProviders: {
      callbackUrls: ["http://localhost:3000", "https://www.spookfishbeta.com"],
      logoutUrls: ["http://localhost:3000", "https://www.spookfishbeta.com"],
      google: {
        clientId: secret("GOOGLE_CLIENT_ID"),
        clientSecret: secret("GOOGLE_CLIENT_SECRET"),
      },
      facebook: {
        clientId: secret("FACEBOOK_CLIENT_ID"),
        clientSecret: secret("FACEBOOK_CLIENT_SECRET"),
      },
    },
  },
  userAttributes: {
    // Add custom attributes for user profiles
    preferredUsername: {
      required: false,
      mutable: true,
    },
    timezone: {
      required: false,
      mutable: true,
    },
  },
  multifactor: {
    mode: "OPTIONAL",
    sms: true,
  },
});
