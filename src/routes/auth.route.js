import express from 'express';
import authController from '../controllers/auth.controller';
import authentication from '../middlewares/authenticate.middleware';
import catchAsync from '../middlewares/catchAsync.middleware';

const { login, signup, logout, protectedRoute } = authController;
const { authenticate } = authentication;

const router = express.Router();

router.post('/signup', catchAsync(signup));
router.post('/login', catchAsync(login));
router.post('/logout', catchAsync(logout));
router.get('/protected-route-test', authenticate, catchAsync(protectedRoute));

export default router;
