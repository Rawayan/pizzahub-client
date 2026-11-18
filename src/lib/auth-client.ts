import { createAuthClient } from "better-auth/react";
import {
  inferAdditionalFields,
  jwtClient,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL:
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    "http://localhost:3000",

  plugins: [
    inferAdditionalFields({
      user: {
        role: {
          type: "string",
          required: false,
        },
        isBlocked: {
          type: "boolean",
          required: false,
        },
        businessName: {
          type: "string",
          required: false,
        },
        subscriptionPlan: {
          type: "string",
          required: false,
        },
        subscriptionExpiresAt: {
          type: "date",
          required: false,
        },
      },
    }),

    jwtClient(),
  ],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;
