import express from 'express';
import userController from '../../controllers/user.controller';
import authentication from '../../middlewares/authenticate.middleware';
import catchAsync from '../../middlewares/catchAsync.middleware';
import { verifyRights } from '../../middlewares/verifyRights.middleware';

const { findAllUsers, findUserById, updateUser, deleteUser } = userController;
const { authenticate } = authentication;

const router = express.Router();

router.get(
  '/',
  authenticate,
  verifyRights('getUsers'),
  catchAsync(findAllUsers),
);
router.get('/:userId', authenticate, catchAsync(findUserById));
router.patch('/:userId', authenticate, catchAsync(updateUser));
router.delete('/:userId', authenticate, catchAsync(deleteUser));

export default router;
