import { Router } from 'express';
import {
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
} from '../controller/user.controller.js';
import { userAuth } from '../middleware/user.middleware.js';

//* Create a new Express router
const router = Router();

//* Define routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/send-verification-email', userAuth, sendVerificationEmail);
router.post('/verify-user', userAuth, verifyUser);
router.get('/is-auth', userAuth, isAuthenticated);
router.post('/send-pass-reset-email', sendPasswordResetEmail);
router.post('/reset-password', resetPassword);
router.get('/user-details', userAuth, getUserDetails);
router.get('/auth/google', googleAuth);
router.get('/auth/google/callback', googleAuthCallback);
router.get('/auth/github', githubAuth);
router.get('/auth/github/callback', githubAuthCallback);

//* Export the router
export default router;
