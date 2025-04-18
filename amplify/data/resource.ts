import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  // User Profile model linked to auth users
  UserProfile: a
    .model({
      // Fields for user profile
      userId: a.string().required(),
      username: a.string().required(),
      email: a.string().required(),
      firstName: a.string(),
      lastName: a.string(),
      timezone: a.string(),
      // Relationships
      visualizationSettings: a.hasMany("VisualizationSetting"),
    })
    .authorization((allow) => [
      // Owner can do anything with their own profile
      allow.owner(),
      // Public read for minimal profile data if needed
      allow.public().to(['read']).on(['userId', 'username']),
    ]),

  // Visualization types (sports, financial, etc.)
  VisualizationType: a
    .model({
      name: a.string().required(),
      description: a.string(),
      dataSourceType: a.enum(['API', 'DYNAMODB', 'WEBSOCKET']),
      dataSourceConfig: a.string(), // JSON config for the data source
      defaultConfig: a.string(), // Default configuration as JSON
      // Relationships
      settings: a.hasMany("VisualizationSetting"),
    })
    .authorization((allow) => [
      // Anyone can read visualization types
      allow.public().to(['read']),
      // Only admins can create/update/delete
      allow.groups(['Admin']).to(['create', 'update', 'delete']),
    ]),

  // User-specific settings for visualizations
  VisualizationSetting: a
    .model({
      // Configuration stored as JSON string
      config: a.string().required(),
      name: a.string().required(),
      isDefault: a.boolean().default(false),
      // For guest users, we'll store session ID
      sessionId: a.string(),
      // Timestamps for tracking
      lastViewed: a.datetime(),
      // Relationships
      userProfileID: a.string(),
      userProfile: a.belongsTo("UserProfile"),
      visualizationTypeID: a.string().required(),
      visualizationType: a.belongsTo("VisualizationType"),
    })
    .authorization((allow) => [
      // Owner can do anything with their settings
      allow.owner(),
      // Allow public access for guest settings (identified by sessionId)
      allow.public().to(['create', 'read', 'update', 'delete']).when(ctx => !!ctx.args.sessionId),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    // Keep API key for public access
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
    // Enable IAM authorization for admin access
    iamAuthorizationMode: {
      role: {
        name: "streamVisualizationAdminRole",
      },
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
