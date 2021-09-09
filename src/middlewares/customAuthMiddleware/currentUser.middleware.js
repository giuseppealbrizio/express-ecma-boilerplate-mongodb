/**
 * This middleware differentiate from the authenticate one
 * because is called after the authentication to retrieve
 * the jwt token stored in the cookie. This is useful to be
 * exported in a shared library
 */
import jwt from 'jsonwebtoken';

// eslint-disable-next-line import/prefer-default-export
export const currentUser = (req, res, next) => {
  if (!req.cookies?.jwt && !req.headers?.authorization) {
    return next();
  }
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      const jwtFromBearer = req.headers?.authorization?.split(' ');

      const jwtToken = jwtFromBearer[1];

      const payload = jwt.verify(jwtToken, process.env.JWT_KEY);

      req.currentUser = payload;
    } else if (req.cookies.jwt) {
      const payload = jwt.verify(req.cookies.jwt, process.env.JWT_KEY);

      req.currentUser = payload;
    }
  } catch (error) {
    return next(error);
  }
  return next();
};
