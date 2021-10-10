import express from 'express';
import subscriberController from '../../../controllers/events/subscriber.controller';
import authentication from '../../../middlewares/authenticate.middleware';

import catchAsync from '../../../middlewares/catchAsync.middleware';

const {
  testSubscriberRoute,
  subscribeToPullEventExample,
  subscribeToPushEventExample,
} = subscriberController;
const { authenticate } = authentication;

const router = express.Router();

router.get('/', authenticate, catchAsync(testSubscriberRoute));

/**
 * PULL ROUTES
 */
router.post('/pull', catchAsync(subscribeToPullEventExample));

/**
 * PUSH ROUTES
 */
router.post('/push', catchAsync(subscribeToPushEventExample));

export default router;
