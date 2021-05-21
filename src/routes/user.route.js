import express from 'express';
import userController from '../controllers/user.controller';
import authentication from '../middlewares/authenticate.middleware';
import catchAsync from '../middlewares/catchAsync.middleware';

const { findAllUsers, findUserById, updateUser, deleteUser } = userController;
const { authenticate } = authentication;

const router = express.Router();

router.get('/', authenticate, catchAsync(findAllUsers));
router.get('/:id', authenticate, catchAsync(findUserById));
router.patch('/:id', authenticate, catchAsync(updateUser));
router.delete('/:id', authenticate, catchAsync(deleteUser));

export default router;
