export default {
  /**
   * Publish a message to Pub/Sub Cloud to a specified topic
   * created in GCP
   * @param pubSubClient
   * @param topicName
   * @param payload
   * @return {Promise<*>}
   */
  publishMessage: async (pubSubClient, topicName, payload) => {
    const dataBuffer = Buffer.from(JSON.stringify(payload));

    const messageId = await pubSubClient.topic(topicName).publish(dataBuffer);
    console.log(`Message ${messageId} published.`);
    return messageId;
  },
  /**
   * Listen for the message published by
   * Pub/Sub Cloud with a subscription
   * that is configured to listen on that
   * specified topic
   * @param pubSubClient
   * @param subscriptionName
   * @param timeout
   */
  listenForPullMessages: (pubSubClient, subscriptionName, timeout) => {
    const subscription = pubSubClient.subscription(subscriptionName);

    let messageCount = 0;
    const messageHandler = (message) => {
      console.log(`Received message ${message.id}:`);
      console.log(`\tData: ${message.data}`);
      console.log(`\tAttributes: ${message.attributes}`);
      messageCount += 1;

      message.ack();
    };

    subscription.on('message', messageHandler);

    setTimeout(() => {
      subscription.removeListener('message', messageHandler);
      console.log(`${messageCount} message(s) received.`);
    }, timeout * 1000);
  },
  /**
   * Since the subscription is a Push subscription,
   * Google Pub/Sub send back the message as soon
   * as possible and this controller receive the message
   * @param payload
   * @return {any}
   */
  listenForPushMessages: (payload) => {
    const message = Buffer.from(payload, 'base64').toString('utf-8');
    let parsedMessage = JSON.parse(message);
    console.log('Hey publisher message received:', parsedMessage);
    return parsedMessage;
  },
};
