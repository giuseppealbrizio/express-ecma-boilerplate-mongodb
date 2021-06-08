import debug from 'debug';
import mongoose from 'mongoose';

mongoose.connection.on('connected', () => {
  console.log('MongoDB Connection Established');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB Connection Reestablished');
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB Connection Disconnected');
});

mongoose.connection.on('close', () => {
  console.log('MongoDB Connection Closed');
});

mongoose.connection.on('error', (error) => {
  console.log(`MongoDB ERROR: ${error}`);

  process.exit(1);
});

const DEBUG = debug('dev');

export default {
  MongoDB: async () => {
    try {
      return await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      });
    } catch (error) {
      DEBUG(error);
      throw new Error(error.message);
    }
  },
  MongoDBTest: async () => {
    try {
      return await mongoose.connect(process.env.MONGO_URI_TEST, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      });
    } catch (error) {
      DEBUG(error);
      throw new Error(error.message);
    }
  },
};
