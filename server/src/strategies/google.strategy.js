import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { ENV } from '../config/env.config.js';
import { handleGoogleAuth } from '../services/googleAuth.service.js';

const googleStrategy = new GoogleStrategy(
  {
    clientID: ENV.GOOGLE_CLIENT_ID,
    clientSecret: ENV.GOOGLE_CLIENT_SECRET,
    callbackURL: `${ENV.BASE_URL}/api/v1/users/auth/google/callback`,
    scope: ['profile', 'email'],
  },
  async function (accessToken, refreshToken, profile, done) {
    try {
      const result = await handleGoogleAuth(profile);

      return done(null, result);
    } catch (error) {
      return done(error, null);
    }
  }
);

export default googleStrategy;
