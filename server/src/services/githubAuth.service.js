import User from '../model/User.model.js';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.config.js';

export const handleGitHubAuth = async profile => {
  try {
    // gethub may not provide email all the time so we need to handle that case
    const email =
      profile.emails && profile.emails[0]
        ? profile.emails[0].value.toLowerCase()
        : `${profile.username}@github.com`; // Fallback email

    // Check if user exists by email OR githubId
    let user = await User.findOne({
      $or: [{ email }, { githubId: profile.id }],
    });

    // If user doesn't exist create a new user
    if (!user) {
      user = new User({
        name: profile.displayName || profile.username,
        email: email,
        githubId: profile.id,
        password: Math.random().toString(36).slice(-8), // Random password
        isVerified: true, // GitHub authenticated users are automatically verified
      });
      await user.save();
    } else if (!user.githubId) {
      // If user exists but doesn't have githubId (Link existing account with GitHub)
      user.githubId = profile.id;
      user.isVerified = true;
      await user.save();
    }
    // Generate JWT token
    const token = jwt.sign({ id: user._id }, ENV.JWT_SECRET, { expiresIn: '7d' });

    return { user, token };
  } catch (error) {
    throw new Error('GitHub authentication failed: ' + error.message);
  }
};
