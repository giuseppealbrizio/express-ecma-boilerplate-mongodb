import mongoose from 'mongoose';

export const MongoDB = async () => {
  try {
    return await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
  } catch (err) {
    throw new Error(err);
  }
};
