/**
 * This middleware is responsible for authenticating routes.
 * If a user doesnt have a cookie named jwt valid or does not
 * send a Bearer token this middleware returns an error.
 */
import debug from 'debug';
import passportJWT from '../config/passport.config';
import { ApplicationError } from '../helpers/errors.helper';

// eslint-disable-next-line no-unused-vars
const DEBUG = debug('dev');
export default {
  authenticate: (req, res, next) => {
    // eslint-disable-next-line no-unused-vars
    passportJWT.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        throw new ApplicationError(
          401,
          'invalid token, please log in or sign up',
        );
      }

      req.user = user;
      // DEBUG(user.username);
      return next();
    })(req, res, next);
  },
};
