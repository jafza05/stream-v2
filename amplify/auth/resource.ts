import { defineAuth, secret } from "@aws-amplify/backend";

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
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
  // Remove custom attributes for now as they are causing deployment issues
  multifactor: {
    mode: "OPTIONAL",
    sms: true,
  },
});
