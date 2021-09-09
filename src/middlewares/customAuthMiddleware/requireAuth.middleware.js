import { ApplicationError } from '../../helpers/errors.helper';

// eslint-disable-next-line import/prefer-default-export
export const requireAuth = (req, res, next) => {
  console.log(req.currentUser);
  if (!req.currentUser) {
    throw new ApplicationError(401, 'invalid token, please log in or sign up');
  }
  next();
};
