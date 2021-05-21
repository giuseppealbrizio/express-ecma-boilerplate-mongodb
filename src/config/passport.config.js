/**
 * Passport configuration file
 */
import passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import dotenv from 'dotenv';
import { User } from '../models/user.model';

dotenv.config();

// const jwtPublicSecret = process.env.JWT_PUBLIC_SECRET.replace(/\\n/g, '\n');

/**
 * Extract the jwt token from a custom Cookie Extractor function which
 * extracts the token from a named token and from a Bearer Token
 * @param req
 * @return {null}
 */
const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  return token;
};

const options = {
  secretOrKey: 'JWT_SECRET',
  // algorithms: ['RS256'],
  passReqToCallback: true,
};

options.jwtFromRequest = ExtractJwt.fromExtractors([
  ExtractJwt.fromAuthHeaderAsBearerToken(),
  (req) => cookieExtractor(req),
]);

passport.use(
  new Strategy(options, (req, jwtPayload, done) => {
    User.findOne({ _id: jwtPayload.id })
      .then((user) => {
        if (user) {
          delete user._doc.password;
          done(null, user);
        } else {
          done(null, false);
        }
      })
      .catch((err) => {
        if (err) {
          return done(err, false);
        }
      });
  }),
);

export default passport;
