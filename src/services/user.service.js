import { User } from '../models/user.model';

export default {
  find: async () => {
    return User.find();
  },
  findById: async (id) => {
    const user = await User.findById(id).exec();

    if (user !== null) {
      return user;
    } else {
      throw new Error('User not found');
    }
  },
  update: async (id, data) => {
    const updatedUser = await User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (updatedUser !== null) {
      return updatedUser;
    } else {
      throw new Error('User not found');
    }
  },
  delete: async (id) => {
    const deletedUser = await User.findByIdAndDelete(id);

    if (deletedUser !== null) {
      return deletedUser;
    } else {
      throw new Error('User not found');
    }
  },
};
