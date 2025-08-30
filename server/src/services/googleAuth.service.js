import User from '../model/User.model.js';

export const handleGoogleAuth = async profile => {
  try {
    // Check if user exists by email OR googleId
    let user = await User.findOne({
      $or: [{ email: profile.emails[0].value.toLowerCase() }, { googleId: profile.id }],
    });

    // If user doesn't exist create a new user
    if (!user) {
      user = new User({
        name: profile.displayName,
        email: profile.emails[0].value.toLowerCase(),
        googleId: profile.id,
        password: Math.random().toString(36).slice(-8), // Random password
        isVerified: true, // Google verified users are automatically verified
      });
      await user.save();
    } else if (!user.googleId) {
      // If user exists but doesn't have googleId (Link existing account with Google)
      user.googleId = profile.id;
      user.isVerified = true;
      await user.save();
    }
    // Generate JWT token
    const token = jwt.sign({ id: user._id }, ENV.JWT_SECRET, { expiresIn: '7d' });

    return { user, token };
  } catch (error) {
    throw new Error('Google authentication failed');
  }
};
