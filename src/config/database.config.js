import mongoose from 'mongoose';

import debug from 'debug';

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
