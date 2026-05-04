/// <reference types="node" />
import { defineConfig } from "drizzle-kit";
import "dotenv/config";

const dbUrl = process.env.DATABASE_URL || '';
const hasSSLMode = dbUrl.includes('sslmode');
const finalUrl = hasSSLMode ? dbUrl : dbUrl + (dbUrl.includes('?') ? '&sslmode=require' : '?sslmode=require');
const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: isProduction ? finalUrl : dbUrl,
    ssl: isProduction ? true : false
  },
});
