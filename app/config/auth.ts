// Auth configuration for social providers
import { Amplify } from 'aws-amplify';

export const configureSocialAuth = () => {
  // This is an example configuration - you'll need to replace with your own values
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: 'us-east-1_example', // replace with your User Pool ID
        userPoolClientId: 'example', // replace with your User Pool Client ID
        identityPoolId: 'us-east-1:example', // replace with your Identity Pool ID
        
        // OAuth configuration
        loginWith: {
          oauth: {
            domain: 'your-domain.auth.us-east-1.amazoncognito.com', // replace with your domain
            scopes: ['email', 'profile', 'openid'],
            redirectSignIn: ['http://localhost:3000/'],
            redirectSignOut: ['http://localhost:3000/'],
            responseType: 'code'
          }
        }
      }
    }
  });
};

/*
 * Setup Guide for Google OAuth:
 * 
 * 1. Go to Google Developer Console (https://console.developers.google.com/)
 * 2. Create a new project or select an existing one
 * 3. Navigate to "APIs & Services" > "Credentials"
 * 4. Click "CREATE CREDENTIALS" and select "OAuth client ID"
 * 5. Select "Web application" as application type
 * 6. Set a name for your OAuth client
 * 7. Add your Cognito User Pool domain with the /oauth2/idpresponse endpoint to Authorized redirect URIs:
 *    https://your-domain.auth.us-east-1.amazoncognito.com/oauth2/idpresponse
 * 8. Click "CREATE"
 * 9. Note your Client ID and Client Secret
 * 10. In AWS Amplify CLI, run 'amplify update auth' and select "Default configuration with Social Provider"
 * 11. When prompted, select "Google" as a social provider and enter your Client ID and Client Secret
 * 12. Run 'amplify push' to deploy your changes
 */

/*
 * Setup Guide for Facebook OAuth:
 * 
 * 1. Go to Facebook Developer Portal (https://developers.facebook.com/)
 * 2. Create a new app or select an existing one
 * 3. From the dashboard, navigate to "Settings" > "Basic"
 * 4. Note your App ID and App Secret
 * 5. Go to "Products" in the left menu and add "Facebook Login"
 * 6. In Facebook Login settings, add your Cognito User Pool domain with the /oauth2/idpresponse endpoint to Valid OAuth Redirect URIs:
 *    https://your-domain.auth.us-east-1.amazoncognito.com/oauth2/idpresponse
 * 7. Save changes
 * 8. In AWS Amplify CLI, run 'amplify update auth' and select "Default configuration with Social Provider"
 * 9. When prompted, select "Facebook" as a social provider and enter your App ID and App Secret
 * 10. Run 'amplify push' to deploy your changes
 */ 