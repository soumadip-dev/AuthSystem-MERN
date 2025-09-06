import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  BASE_URL: process.env.BASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV,
  BREVO_HOST: process.env.BREVO_HOST,
  BREVO_PORT: process.env.BREVO_PORT,
  BREVO_USERNAME: process.env.BREVO_USERNAME,
  BREVO_PASSWORD: process.env.BREVO_PASSWORD,
  BREVO_SENDEREMAIL: process.env.BREVO_SENDEREMAIL,
  FRONTEND_URL: process.env.FRONTEND_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
};
