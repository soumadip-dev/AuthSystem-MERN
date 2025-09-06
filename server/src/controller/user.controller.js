import {
  registerService,
  loginService,
  sendVerificationEmailService,
  verifyUserService,
  sendPasswordResetEmailService,
  resetPasswordService,
  getUserDetailsService,
} from '../services/user.service.js';
import { ENV } from '../config/env.config.js';
import generateMailOptions from '../utils/mailTemplates.utils.js';
import transporter from '../config/nodemailer.config.js';
import passport from '../config/passport.config.js';

//* Controller for registering a user
const registerUser = async (req, res) => {
  // Get fields from request body
  const { name, email, password } = req.body;

  try {
    // Get the user and token from registerService
    const { newUser, token } = await registerService(name, email, password);

    // Store JWT token in cookie
    const cookieOptions = {
      httpOnly: true,
      sameSite: ENV.NODE_ENV === 'production' ? 'none' : 'strict',
      secure: ENV.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };
    res.cookie('authToken', token, cookieOptions);

    // Send welcome email to user
    const mailOptions = generateMailOptions({
      user: newUser,
      type: 'welcome',
      companyName: 'Auth System',
    });

    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      return res.status(500).json({ message: 'Email sending failed', success: false });
    }

    // Send success response
    res.status(201).json({
      message: 'User registered successfully',
      success: true,
    });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Something went wrong', success: false });
  }
};

//* Controller for logging in a user
const loginUser = async (req, res) => {
  // Get fields from request body
  const { email, password } = req.body;

  try {
    // Get the user and token from loginService
    const { user, token } = await loginService(email, password);

    // Store JWT token in cookie
    const cookieOptions = {
      httpOnly: true,
      sameSite: ENV.NODE_ENV === 'production' ? 'none' : 'strict',
      secure: ENV.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };
    res.cookie('authToken', token, cookieOptions);

    // Send success response
    return res.status(200).json({
      message: 'User logged in successfully',
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Something went wrong', success: false });
  }
};

//* Controller for logout
const logoutUser = async (req, res) => {
  try {
    // Clear the cookie
    res.clearCookie('authToken', {
      httpOnly: true,
      sameSite: ENV.NODE_ENV === 'production' ? 'none' : 'strict',
      secure: ENV.NODE_ENV === 'production',
    });

    // return success message
    return res.status(200).json({ message: 'User logged out successfully', success: true });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Something went wrong when logging out',
      success: false,
    });
  }
};

//* Controller to send verification OTP to the user's email
const sendVerificationEmail = async (req, res) => {
  // Get fields from request body
  const { userId } = req.user;

  try {
    const { user, otp } = await sendVerificationEmailService(userId);

    // Send verification email to user
    const mailOptions = generateMailOptions({
      user,
      otp,
      type: 'verifyUser',
      companyName: 'Auth System',
    });

    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      return res
        .status(500)
        .json({ message: emailError.message || 'Email sending failed', success: false });
    }

    // Send success response
    return res.status(200).json({
      message: 'Verification email sent successfully',
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Something went wrong when logging out',
      success: false,
    });
  }
};

//* Controller to verify user with the OTP
const verifyUser = async (req, res) => {
  // Get otp from request body
  const { otp } = req.body;

  // Get userId from request.user attached by userAuth middleware
  const { userId } = req.user;

  try {
    await verifyUserService(userId, otp);
    // Send success response
    return res.status(200).json({
      message: 'User verified successfully',
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Something went wrong when logging out',
      success: false,
    });
  }
};

//* Controller to check if user is authenticated
const isAuthenticated = (req, res) => {
  try {
    // Send success response
    return res.status(200).json({
      message: 'User is authenticated',
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Something went wrong when logging out',
      success: false,
    });
  }
};

//* Controller to send password reset email to the user's email
const sendPasswordResetEmail = async (req, res) => {
  // Get the email from body
  const { email } = req.body;

  try {
    // Get the user and otp from sendPasswordResetEmailService
    const { user, otp } = await sendPasswordResetEmailService(email);

    // Send password reset email to user
    const mailOptions = generateMailOptions({
      user,
      otp,
      type: 'forgetPassword',
      companyName: 'Auth System',
    });

    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      return res
        .status(500)
        .json({ message: emailError.message || 'Email sending failed', success: false });
    }

    // Send success response
    return res.status(200).json({
      message: 'Password reset email sent successfully',
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Something went wrong when logging out',
      success: false,
    });
  }
};

//* Controller to reset password with the OTP
const resetPassword = async (req, res) => {
  // Get otp from request body
  const { email, otp, newPassword } = req.body;

  try {
    // Call resetPasswordService
    await resetPasswordService(email, otp, newPassword);

    // Send success response
    return res.status(200).json({
      message: 'Password reset successfully',
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Something went wrong when logging out',
      success: false,
    });
  }
};

//* Controller to get user details
const getUserDetails = async (req, res) => {
  try {
    // Get userId from middleware
    const { userId } = req.user;

    const user = await getUserDetailsService(userId);

    // Send success response
    return res.status(200).json({
      message: 'User details fetched successfully',
      success: true,
      userData: { name: user.name, email: user.email, isVerified: user.isVerified },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Something went wrong when logging out',
      success: false,
    });
  }
};

//* Controller for Google authentication
const googleAuth = (req, res, next) => {
  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email'],
  })(req, res, next);
};

//* Controller for Google authentication callback
const googleAuthCallback = (req, res, next) => {
  passport.authenticate(
    'google',
    {
      session: false,
      failureRedirect: `${ENV.FRONTEND_URL}/login`,
    },
    async (err, data) => {
      if (err) {
        console.error('Google auth error:', err);
        return res.redirect(`${ENV.FRONTEND_URL}/login`);
      }

      try {
        const { user, token } = data;

        // Store JWT token in cookie (same as regular login)
        const cookieOptions = {
          httpOnly: true,
          sameSite: ENV.NODE_ENV === 'production' ? 'none' : 'strict',
          secure: ENV.NODE_ENV === 'production',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        };

        // Set the cookie
        res.cookie('authToken', token, cookieOptions);

        // Redirect to home page
        return res.redirect(`${ENV.FRONTEND_URL}/`);
      } catch (error) {
        console.error('Error in google callback:', error);
        return res.redirect(`${ENV.FRONTEND_URL}/login`);
      }
    }
  )(req, res, next);
};

//* Controller for GitHub authentication
const githubAuth = (req, res, next) => {
  passport.authenticate('github', {
    session: false,
    scope: ['user:email'],
  })(req, res, next);
};

//* Controller for GitHub authentication callback
const githubAuthCallback = (req, res, next) => {
  passport.authenticate(
    'github',
    {
      session: false,
      failureRedirect: `${ENV.FRONTEND_URL}/login`,
    },
    async (err, data) => {
      if (err) {
        console.error('GitHub auth error:', err);
        return res.redirect(`${ENV.FRONTEND_URL}/login`);
      }

      try {
        const { user, token } = data;

        // Store JWT token in cookie (same as regular login)
        const cookieOptions = {
          httpOnly: true,
          sameSite: ENV.NODE_ENV === 'production' ? 'none' : 'strict',
          secure: ENV.NODE_ENV === 'production',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        };

        // Set the cookie
        res.cookie('authToken', token, cookieOptions);

        // Redirect to home page
        return res.redirect(`${ENV.FRONTEND_URL}/`);
      } catch (error) {
        console.error('Error in GitHub callback:', error);
        return res.redirect(`${ENV.FRONTEND_URL}/login`);
      }
    }
  )(req, res, next);
};

//* Export controllers
export {
  registerUser,
  loginUser,
  logoutUser,
  sendVerificationEmail,
  verifyUser,
  isAuthenticated,
  sendPasswordResetEmail,
  resetPassword,
  getUserDetails,
  googleAuth,
  googleAuthCallback,
  githubAuth,
  githubAuthCallback,
};
