import express from 'express';
import passport from 'passport';
import '../config/passport.config';
import '../services/passport/passport-google.service';

import authController from '../controllers/auth.controller';
import authentication from '../middlewares/authenticate.middleware';
import catchAsync from '../middlewares/catchAsync.middleware';

const {
  login,
  signup,
  logout,
  recoverPassword,
  resetPassword,
  socialAuth,
  protectedRoute,
} = authController;

const { authenticate } = authentication;

const router = express.Router();

router.post('/signup', catchAsync(signup));
router.post('/login', catchAsync(login));
router.post('/logout', catchAsync(logout));
router.post('/recover-password', catchAsync(recoverPassword));
router.post('/reset-password', catchAsync(resetPassword));
router.get('/protected-route-test', authenticate, catchAsync(protectedRoute));

/**
 * Social Authentication: Google
 */
router.get(
  '/google',
  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email'],
  }),
);
// callback route for google authentication
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email'],
  }),
  socialAuth,
);

export default router;
