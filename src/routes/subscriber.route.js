import express from 'express';
import subscriberController from '../controllers/subscriber.controller';
import authentication from '../middlewares/authenticate.middleware';

import catchAsync from '../middlewares/catchAsync.middleware';

const { testSubscriberRoute, pullTestMessage, pushTestMessage } =
  subscriberController;
const { authenticate } = authentication;

const router = express.Router();

router.get('/', authenticate, catchAsync(testSubscriberRoute));
router.post('/pull', catchAsync(pullTestMessage));
router.post('/push', catchAsync(pushTestMessage));

export default router;
