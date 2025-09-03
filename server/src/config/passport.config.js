import passport from 'passport';
import googleStrategy from '../strategies/google.strategy.js';
import githubStrategy from '../strategies/github.strategy.js';

// Use the Google strategy
passport.use(googleStrategy);
passport.use(githubStrategy);

// Serialize/Deserialize (optional for JWT, but good to have)
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;
