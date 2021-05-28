import debug from 'debug';
import { Strategy } from 'passport-local';
import passport from 'passport';

import User from '../../models/user.model';

const DEBUG = debug('dev');

const authFields = {
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
};

passport.serializeUser((user, done) => {
  /* Store only the id in passport */
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findOne({ _id: id }, (err, user) => {
    done(null, user);
  });
});

passport.use(
  'login',
  new Strategy(authFields, async (req, email, password, cb) => {
    try {
      const user = await User.findOne({
        $or: [{ email }, { username: email }],
      });

      if (!user || !user.password) {
        return cb(null, false, { message: 'Incorrect email or password.' });
      }

      const checkPassword = await user.comparePassword(password);

      if (!checkPassword) {
        return cb(null, false, { message: 'Incorrect email or password.' });
      }
      return cb(null, user, { message: 'Logged In Successfully' });
    } catch (err) {
      DEBUG(err);
      return cb(null, false, { statusCode: 400, message: err.message });
    }
  }),
);

passport.use(
  'signup',
  new Strategy(authFields, async (req, email, password, cb) => {
    try {
      const checkEmail = await User.checkExistingField('email', email);

      if (checkEmail) {
        return cb(null, false, {
          statusCode: 409,
          message: 'Email already registered, log in instead',
        });
      }

      const checkUserName = await User.checkExistingField(
        'username',
        req.body.username,
      );
      if (checkUserName) {
        return cb(null, false, {
          statusCode: 409,
          message: 'Username exists, please try another',
        });
      }

      const newUser = new User();
      newUser.email = req.body.email;
      newUser.password = req.body.password;
      newUser.username = req.body.username;
      await newUser.save();

      return cb(null, newUser);
    } catch (err) {
      DEBUG(err);
      return cb(null, false, { statusCode: 400, message: err.message });
    }
  }),
);
