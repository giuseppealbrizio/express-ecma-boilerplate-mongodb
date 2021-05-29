import passport from 'passport';
import debug from 'debug';
import '../services/passport/passport-local.service';
import { ApplicationError } from '../helpers/errors.helper';
import User from '../models/user.model';
import emailService from '../services/email/sendgrid.service';

const DEBUG = debug('dev');

/**
 * This function returns a json with user data,
 * token and the status and set a cookie with
 * the name jwt. We use this in the response
 * of login or signup
 * @param user
 * @param statusCode
 * @param req
 * @param res
 */
const createCookieFromToken = (user, statusCode, req, res) => {
  const token = user.generateVerificationToken();

  const cookieOptions = {
    expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  };

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

export default {
  /**
   *
   * @param req
   * @param res
   * @param next
   * @return {Promise<void>}
   */
  signup: async (req, res, next) => {
    passport.authenticate(
      'signup',
      { session: false },
      async (err, user, info) => {
        try {
          if (err || !user) {
            const { statusCode = 400, message } = info;
            return res.status(statusCode).json({
              status: 'error',
              error: {
                message,
              },
            });
          }
          createCookieFromToken(user, 201, req, res);
        } catch (error) {
          DEBUG(error);
          throw new ApplicationError(500, error);
        }
      },
    )(req, res, next);
  },
  /**
   * Login controller
   * @param req
   * @param res
   * @param next
   */
  login: async (req, res, next) => {
    passport.authenticate(
      'login',
      { session: false },
      async (err, user, info) => {
        try {
          if (err || !user) {
            let message = err;
            if (info) {
              message = info.message;
            }
            return res.status(401).json({
              status: 'error',
              error: {
                message,
              },
            });
          }
          // generate a signed json web token with the contents of user
          // object and return it in the response
          createCookieFromToken(user, 200, req, res);
        } catch (error) {
          DEBUG(error);
          throw new ApplicationError(500, error);
        }
      },
    )(req, res, next);
  },
  /**
   * Logout controller that delete cookie named jwt
   * @param req
   * @param res
   * @return {Promise<*>}
   */
  logout: async (req, res) => {
    try {
      await req.session.destroy();
      await res.clearCookie('jwt');
      return res.status(200).json({
        status: 'success',
        message: 'You have successfully logged out',
      });
    } catch (error) {
      DEBUG(error);
      throw new ApplicationError(500, error);
    }
  },
  /**
   * Request a password recovery and
   * send an email with a token to use in
   * the resetPassword Controller
   * @param req
   * @param res
   * @return {Promise<*>}
   */
  recoverPassword: async (req, res) => {
    try {
      // Destroy session and remove any cookie
      await req.session.destroy();
      await res.clearCookie('jwt');

      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          status: 'error',
          error: {
            status: 'error',
            message: 'User not found',
          },
        });
      }

      // Generate and set password reset token
      await user.generatePasswordResetToken();

      // Save the updated user object with a resetPasswordToken and expire
      await user.save();

      // Send email to the user with the token
      await emailService.sendResetPasswordToken(
        user.email,
        user.resetPasswordToken,
      );

      res.status(200).json({
        status: 'success',
        message: `A reset email has been sent to ${user.email}.`,
      });
    } catch (error) {
      DEBUG(error);
      throw new ApplicationError(500, error, error);
    }
  },
  /**
   * Reset password controller
   * @param req
   * @param res
   * @param next
   * @return {Promise<void>}
   */
  resetPassword: async (req, res, next) => {
    passport.authenticate(
      'reset-password',
      { session: false },
      async (err, user, info) => {
        try {
          if (err || !user) {
            let message = err;
            if (info) {
              message = info.message;
            }
            return res.status(400).json({
              status: 'error',
              error: {
                message,
              },
            });
          }

          res.status(200).json({
            status: 'success',
            message: 'Password successfully updated',
          });
        } catch (error) {
          DEBUG(error);
          throw new ApplicationError(500, error);
        }
      },
    )(req, res, next);
  },
  /**
   * Protected router test
   * @param req
   * @param res
   * @return {Promise<void>}
   */
  protectedRoute: async (req, res) => {
    res.status(200).json({
      status: 'success',
      data: {
        message: 'Yes you are. You are a Thor-n times developer',
      },
    });
  },
};
