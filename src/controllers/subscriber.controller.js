/**
 * This controller should be used in another app or service and not here
 * This is just for testing purposes
 */
import debug from 'debug';

/**
 * Load PubSub Library
 */
import { PubSub } from '@google-cloud/pubsub';

import { ApplicationError } from '../helpers/errors.helper';

/**
 * Load PubSub Custom Service
 */
import pubSubService from '../services/pubsub/pub-sub.service';

const pubSubClient = new PubSub();

/**
 * Describe subscription name defined in gcs
 * and timeout
 * @type {string}
 */
const subscriptionName = 'test_subscription';
const timeout = 60;
const { listenForPullMessages, listenForPushMessages } = pubSubService;

const DEBUG = debug('dev');

export default {
  /**
   * Test subscriber route API
   * @param req
   * @param res
   * @return {Promise<void>}
   */
  testSubscriberRoute: async (req, res) => {
    try {
      res.status(200).json({
        status: 'success',
        message: 'Subscriber route is ready!',
      });
    } catch (error) {
      DEBUG(error);
      throw new ApplicationError(500, error);
    }
  },
  /**
   * Controller for listen to message published message that pass
   * the arguments to the webhook pullTestMessage. This route
   * is always on listening
   * @param req
   * @param res
   */
  // eslint-disable-next-line no-unused-vars
  pullTestMessage: (req, res) => {
    try {
      listenForPullMessages(pubSubClient, subscriptionName, timeout);
    } catch (error) {
      DEBUG(error);
      throw new ApplicationError(
        500,
        "Couldn't receive publisher data object :(",
        error,
      );
    }
  },
  /**
   * As soon as Google receives a message it send back since
   * subscription is of a PUSH type. This controller take the
   * message and display it
   * @param req
   * @param res
   * @return {Promise<*>}
   */
  pushTestMessage: async (req, res) => {
    try {
      const messageResponse = await listenForPushMessages(
        req.body.message.data,
      );
      return res.status(200).json({
        success: true,
        message: 'Message received successfully :)',
        data: messageResponse,
      });
    } catch (error) {
      DEBUG(error);
      throw new ApplicationError(
        500,
        "Couldn't receive orders object :(",
        error,
      );
    }
  },
};
