import { defineAuth } from "@aws-amplify/backend";

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
    phone: false,
    username: false,
  },
  userAttributes: {
    // Add custom attributes for user profiles
    preferredName: {
      required: false,
      mutable: true,
    },
    timezone: {
      required: false,
      mutable: true,
    },
  },
  multifactor: {
    mode: "optional",
    sms: true,
  },
  passwordPolicy: {
    minLength: 8,
    requireLowercase: true,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialCharacters: true,
  },
});
