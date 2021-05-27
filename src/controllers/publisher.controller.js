import debug from 'debug';
import { ApplicationError } from '../helpers/errors.helper';

/**
 * Load PubSub Library
 */
import { PubSub } from '@google-cloud/pubsub';
const pubSubClient = new PubSub();

/**
 * Load PubSub Custom Service
 */
import pubSubService from './../services/pubsub/pub-sub.service.js';
const { publishMessage } = pubSubService;

/**
 * Describe the topicName
 * @type {string}
 */
const topicName = 'test_topic';

const DEBUG = debug('dev');

export default {
  /**
   * Test Publisher route api
   * @param req
   * @param res
   * @return {Promise<void>}
   */
  testPublisherRoute: async (req, res) => {
    try {
      res.status(200).json({
        status: 'success',
        message: 'Publisher route is ready!',
      });
    } catch (error) {
      DEBUG(error);
      throw new ApplicationError(500, error);
    }
  },
  /**
   * Controller for publishing a message to a specific topic
   * @param req
   * @param res
   * @return {Promise<void>}
   */
  publishTestMessage: async (req, res) => {
    try {
      let body = await req.body;
      let messageId = await publishMessage(pubSubClient, topicName, body);
      res.status(200).json({
        status: 'success',
        message: `Test message ${messageId} published`,
      });
    } catch (error) {
      DEBUG(error);
      throw new ApplicationError(500, error);
    }
  },
};
