/**
 * This controller should be used in another app or service and not here
 * This is just for testing purposes
 */
import debug from 'debug';

/**
 * Load PubSub Library
 */
import { PubSub } from '@google-cloud/pubsub';

import { ApplicationError } from '../../helpers/errors.helper';

const pubSubClient = new PubSub();

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
   * Controller for listen to message published from a publisher
   * This controller receive type "pull" subscription messages
   * @param req
   * @param res
   */
  // eslint-disable-next-line no-unused-vars
  subscribeToPullEventExample: async (req, res) => {
    try {
      // Define some options for subscription
      const subscriberOptions = {
        flowControl: {
          maxMessages: 10,
        },
      };

      // References an existing subscription
      const subscription = await pubSubClient.subscription(
        'subscription-name',
        subscriberOptions,
      );

      // Instantiate the message counter
      let messageCount = 0;

      // Create an event handler to handle messages
      const messageHandler = async (message) => {
        // Buffering the message data
        const data = Buffer.from(message.data, 'base64').toString('utf-8');

        // Parse message in a JSON Object
        const result = JSON.parse(data);

        // Do something with the result
        console.log(result);

        // Increase message counter
        messageCount += 1;

        // "Ack" (acknowledge receipt of) the message
        message.ack();
      };

      // Create an event handler to handle errors
      const errorHandler = function (error) {
        throw new Error(error);
      };

      // Listen for new messages until timeout is hit
      subscription.on('message', messageHandler);

      // Listen for errors
      subscription.on('error', errorHandler);

      // Set the timeout to 60 seconds
      setTimeout(() => {
        subscription.removeListener('message', messageHandler);
        subscription.removeListener('error', errorHandler);
        console.log(`${messageCount} message(s) received.`);
      }, 60 * 1000);

      // Send a 200 status code
      res.status(200).send();
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
  subscribeToPushEventExample: async (req, res) => {
    try {
      // Await for message coming from Pub/Sub in a push notification.
      const data = Buffer.from(req.body.message.data, 'base64').toString(
        'utf-8',
      );

      const result = await JSON.parse(data);

      console.log('Push event contains this object: ', result);

      res.status(200).send();
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
