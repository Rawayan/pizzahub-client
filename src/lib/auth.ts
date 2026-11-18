
import { setServers } from "node:dns";
import { MongoClient } from "mongodb";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { jwt } from "better-auth/plugins";

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || "pizzahub";
const BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET;
const BETTER_AUTH_URL =
  process.env.BETTER_AUTH_URL || "http://localhost:3000";

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is missing from client/.env.local");
}

if (!BETTER_AUTH_SECRET || BETTER_AUTH_SECRET.length < 32) {
  throw new Error("BETTER_AUTH_SECRET must be at least 32 characters");
}

const DNS_SERVERS = (process.env.DNS_SERVERS || "192.168.0.1")
  .split(",")
  .map((server) => server.trim())
  .filter(Boolean);

setServers(DNS_SERVERS);

const globalForMongo = globalThis as typeof globalThis & {
  pizzaHubMongoClient?: MongoClient;
};

const mongoClient =
  globalForMongo.pizzaHubMongoClient ??
  new MongoClient(MONGODB_URI);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.pizzaHubMongoClient = mongoClient;
}

const database = mongoClient.db(DB_NAME);

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

const socialProviders =
  googleClientId && googleClientSecret
    ? {
        google: {
          clientId: googleClientId,
          clientSecret: googleClientSecret,
          prompt: "select_account" as const,
        },
      }
    : {};

export const auth = betterAuth({
  appName: "PizzaHub",

  baseURL: BETTER_AUTH_URL,
  secret: BETTER_AUTH_SECRET,

  trustedOrigins: [BETTER_AUTH_URL],

  database: mongodbAdapter(database, {
    client: mongoClient,
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    maxPasswordLength: 128,
    autoSignIn: true,
  },

  socialProviders,

  user: {
    modelName: "users",

    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: true,
      },
      isBlocked: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
      businessName: {
        type: "string",
        required: false,
        input: false,
      },
      subscriptionPlan: {
        type: "string",
        required: false,
        defaultValue: "free",
        input: false,
      },
      subscriptionExpiresAt: {
        type: "date",
        required: false,
        input: false,
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const role = user.role === "vendor" ? "vendor" : "customer";

          return {
            data: {
              ...user,
              role,
              isBlocked: false,
              subscriptionPlan: "free",
            },
          };
        },
      },

      update: {
        before: async (userData) => {
          if ("role" in userData) {
            return false;
          }

          return { data: userData };
        },
      },
    },
  },

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-up/email") {
        return;
      }

      const password = ctx.body?.password;
      const requestedRole = ctx.body?.role;

      if (
        typeof password !== "string" ||
        password.length < 6 ||
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password)
      ) {
        throw new APIError("BAD_REQUEST", {
          message:
            "Password must contain at least 6 characters, including uppercase and lowercase letters.",
        });
      }

      if (
        requestedRole !== undefined &&
        requestedRole !== "customer" &&
        requestedRole !== "vendor"
      ) {
        throw new APIError("BAD_REQUEST", {
          message: "Invalid registration role.",
        });
      }
    }),
  },

  plugins: [
    jwt({
      jwt: {
        issuer: BETTER_AUTH_URL,
        audience: BETTER_AUTH_URL,
        expirationTime: "15m",

        definePayload: ({ user }) => ({
          id: user.id,
          email: user.email,
          role: user.role || "customer",
          isBlocked: Boolean(user.isBlocked),
        }),
      },
    }),
  ],

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
});
