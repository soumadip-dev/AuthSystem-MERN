import passport from 'passport';
import googleStrategy from '../strategies/google.strategy.js';

// Use the Google strategy
passport.use(googleStrategy);

// Serialize/Deserialize (optional for JWT, but good to have)
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;
