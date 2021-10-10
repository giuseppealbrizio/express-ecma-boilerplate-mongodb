import express from 'express';
import appController from '../../controllers/app.controller';

import authentication from '../../middlewares/authenticate.middleware';
import catchAsync from '../../middlewares/catchAsync.middleware';

const { apiEntryPoint, checkUserLogged } = appController;

const { authenticate } = authentication;

const router = express.Router();

router.get('/', catchAsync(apiEntryPoint));
router.get('/check-user-logged', authenticate, catchAsync(checkUserLogged));

export default router;
