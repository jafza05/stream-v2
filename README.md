## AWS Amplify Next.js (App Router) Starter Template

This repository provides a starter template for creating applications using Next.js (App Router) and AWS Amplify, emphasizing easy setup for authentication, API, and database capabilities.

## Overview

This template equips you with a foundational Next.js application integrated with AWS Amplify, streamlined for scalability and performance. It is ideal for developers looking to jumpstart their project with pre-configured AWS services like Cognito, AppSync, and DynamoDB.

## Features

- **Authentication**: Setup with Amazon Cognito for secure user authentication.
- **API**: Ready-to-use GraphQL endpoint with AWS AppSync.
- **Database**: Real-time database powered by Amazon DynamoDB.

## Deploying to AWS

For detailed instructions on deploying your application, refer to the [deployment section](https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/#deploy-a-fullstack-app-to-aws) of our documentation.

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.

## Social Authentication Setup Guide

### Google Authentication Setup

1. Go to [Google Developer Console](https://console.developers.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "CREATE CREDENTIALS" and select "OAuth client ID"
5. Select "Web application" as application type
6. Set a name for your OAuth client
7. Add the following URLs to Authorized JavaScript Origins:
   - `http://localhost:3000` (for local development)
   - Your production domain (if applicable)
8. Add the following URLs to Authorized Redirect URIs:
   - Your Cognito User Pool domain with the `/oauth2/idpresponse` endpoint:
   - `https://your-domain.auth.us-east-1.amazoncognito.com/oauth2/idpresponse`
   - (Replace with your actual Cognito domain)
9. Click "CREATE"
10. Note your Client ID and Client Secret for the next steps

### Facebook Authentication Setup

1. Go to [Facebook Developer Portal](https://developers.facebook.com/)
2. Create a new app or select an existing one (select "Consumer" as app type)
3. From the dashboard, navigate to "Settings" > "Basic"
4. Note your App ID and App Secret
5. Go to "Products" in the left menu and add "Facebook Login"
6. In Facebook Login settings under "Settings", add your Cognito User Pool domain with the `/oauth2/idpresponse` endpoint to Valid OAuth Redirect URIs:
   - `https://your-domain.auth.us-east-1.amazoncognito.com/oauth2/idpresponse`
   - (Replace with your actual Cognito domain)
7. Save changes

### AWS Amplify Configuration

After setting up your social providers, update your Amplify auth configuration:

```bash
# If auth is not already added to your project:
amplify add auth

# If auth is already configured:
amplify update auth
```

Choose the following options:
- Select "Default configuration with Social Provider (Federation)"
- Choose authentication flow type (typically "Username")
- When prompted, select the social providers you set up (Google, Facebook or both)
- Enter the Client IDs and Client Secrets from the steps above
- Specify your redirect URLs (typically your app URL)
- Push the changes with `amplify push`

### Testing Social Login

After configuration:
1. In your app, users will see social login buttons on the login screen
2. When they click a social button, they will be redirected to the provider's login page
3. After successful login, they will be redirected back to your app and authenticated

### Troubleshooting

- If redirects aren't working, verify that your redirect URIs are correctly configured on both provider sides and in Amplify
- Make sure your app domain is allowed in the provider's settings
- Check that you're using the correct Client IDs and Secrets
- Verify that your Cognito User Pool is properly configured with the social identity providers