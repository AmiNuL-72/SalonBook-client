import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const mongoUri =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/salonbook";

// Cached client for serverless environments
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(mongoUri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(mongoUri);
  clientPromise = client.connect();
}

const mongoClient = new MongoClient(mongoUri);
const db = mongoClient.db("salonbook");

const formatUrl = (url?: string): string | undefined => {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

const getBaseUrl = () => {
  if (process.env.BETTER_AUTH_URL) return formatUrl(process.env.BETTER_AUTH_URL)!;
  if (process.env.NEXT_PUBLIC_APP_URL) return formatUrl(process.env.NEXT_PUBLIC_APP_URL)!;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return formatUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL)!;
  if (process.env.VERCEL_URL) return formatUrl(process.env.VERCEL_URL)!;
  return "http://localhost:3000";
};

export const auth = betterAuth({
  database: mongodbAdapter(db),
  baseURL: getBaseUrl(),
  secret: process.env.BETTER_AUTH_SECRET || "salonbook_super_secret_better_auth_jwt_key_2026",
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      prompt: "select_account",
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "customer",
        input: false, // Prevent client from injecting admin role
      },
      isBlocked: {
        type: "boolean",
        defaultValue: false,
        input: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      address: {
        type: "string",
        required: false,
      },
    },
  },
});
