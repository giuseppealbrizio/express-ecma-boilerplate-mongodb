import debug from 'debug';
import UserService from '../services/user.service';
import { ApplicationError, NotFoundError } from '../helpers/errors.helper';

const DEBUG = debug('dev');

export default {
  /**
   * Find all user accounts
   * @param req
   * @param res
   * @return {Promise<void>}
   */
  findAllUsers: async (req, res) => {
    try {
      const users = await UserService.find();
      res.status(200).json({
        status: 'success',
        message: 'Users successfully retrieved',
        data: { users },
      });
    } catch (error) {
      DEBUG(error);
      throw new ApplicationError(500, error);
    }
  },
  /**
   * Find User by id
   * @param req
   * @param res
   * @return {Promise<void>}
   */
  findUserById: async (req, res) => {
    try {
      const user = await UserService.findById(req.params.id);
      res.status(200).json({
        status: 'success',
        message: 'User by id successfully retrieved',
        data: { user },
      });
    } catch (error) {
      DEBUG(error);
      throw new NotFoundError(error.message);
    }
  },
  /**
   * Update user by id
   * @param req
   * @param res
   * @return {Promise<void>}
   */
  updateUser: async (req, res) => {
    try {
      const user = await UserService.update(req.params.id, req.body);
      res.status(200).json({
        status: 'success',
        message: 'User updated successfully',
        data: { user },
      });
    } catch (error) {
      DEBUG(error);
      throw new NotFoundError(error.message);
    }
  },
  /**
   * Delete user by id
   * @param req
   * @param res
   * @return {Promise<void>}
   */
  deleteUser: async (req, res) => {
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
