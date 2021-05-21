import debug from 'debug';
import UserService from '../services/user.service';
import { ApplicationError, NotFoundError } from '../helpers/errors.helper';

const DEBUG = debug('dev');

export default {
  findAllUsers: async (req, res, next) => {
    try {
      const users = await UserService.find();
      res.status(200).json({
        status: 'success',
        message: 'Users successfully retrieved',
        data: { users: users },
      });
    } catch (error) {
      DEBUG(error);
      throw new ApplicationError(500, error);
    }
  },
  findUserById: async (req, res, next) => {
    try {
      const user = await UserService.findById(req.params.id);
      res.status(200).json({
        status: 'success',
        message: 'User by id successfully retrieved',
        data: { user: user },
      });
    } catch (error) {
      DEBUG(error);
      throw new NotFoundError(error.message);
    }
  },
  updateUser: async (req, res, next) => {
    try {
      const user = await UserService.update(req.params.id, req.body);
      res.status(200).json({
        status: 'success',
        message: 'User updated successfully',
        data: { user: user },
      });
    } catch (error) {
      DEBUG(error);
      throw new NotFoundError(error.message);
    }
  },
  deleteUser: async (req, res, next) => {
    try {
      await UserService.delete(req.params.id);
      res.status(200).json({
        status: 'success',
        message: 'User deleted successfully',
      });
    } catch (error) {
      DEBUG(error);
      throw new NotFoundError(error.message);
    }
  },
};
