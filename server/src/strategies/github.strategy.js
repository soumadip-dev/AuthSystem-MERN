import { Strategy as GitHubStrategy } from 'passport-github2';
import { ENV } from '../config/env.config.js';
import { handleGitHubAuth } from '../services/githubAuth.service.js';

const githubStrategy = new GitHubStrategy(
  {
    clientID: ENV.GITHUB_CLIENT_ID,
    clientSecret: ENV.GITHUB_CLIENT_SECRET,
    callbackURL: `${ENV.BASE_URL}/api/v1/users/auth/github/callback`,
    scope: ['user:email'], // Request email access
  },
  async function (accessToken, refreshToken, profile, done) {
    try {
      const result = await handleGitHubAuth(profile);
      return done(null, result);
    } catch (error) {
      return done(error, null);
    }
  }
);

export default githubStrategy;
