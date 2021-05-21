import mongoose from 'mongoose';

import debug from 'debug';
const DEBUG = debug('dev');

export const MongoDB = async () => {
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
};
