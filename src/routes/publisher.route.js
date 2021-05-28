import express from 'express';
import publisherController from '../controllers/publisher.controller';
import authentication from '../middlewares/authenticate.middleware';

import catchAsync from '../middlewares/catchAsync.middleware';

const { testPublisherRoute, publishTestMessage } = publisherController;
const { authenticate } = authentication;

const router = express.Router();

router.get('/', authenticate, catchAsync(testPublisherRoute));
router.post('/publish', authenticate, catchAsync(publishTestMessage));

export default router;
