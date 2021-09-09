import debug from 'debug';
import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy } from 'passport-google-oauth20';
import User from '../../models/user.model';

const DEBUG = debug('dev');

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

dotenv.config();

passport.use(
  'google',
  new Strategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/v1/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const username = profile.emails[0].value;
        const email = profile.emails[0].value;

        // 1. Check if user has already a google profile and return it
        const googleUser = await User.findOne({ 'google.id': profile.id });

        if (googleUser) {
          return done(null, googleUser, { statusCode: 200 });
        }

        // 2. If user email is in the db and tries to google auth
        // update only with google id and token
        const checkEmail = await User.checkExistingField('email', email);

        const fieldsToUpdate = {
          'google.id': profile.id,
          'google.sync': true,
          'google.tokens.accessToken': accessToken,
        };

        if (checkEmail) {
          const user = await User.findByIdAndUpdate(
            checkEmail._id,
            fieldsToUpdate,
            { new: true },
          );
          return done(null, user, { statusCode: 200 });
        }

        // 3. If nothing before is verified create a new User
        const userObj = new User({
          username, // the same as the email
          email,
          password: accessToken,
          role: 'admin',
          'google.id': profile.id,
          'google.sync': true,
          'google.tokens.accessToken': accessToken,
        });

        const user = await userObj.save({ validateBeforeSave: false });

        return done(null, user, { statusCode: 201 });
      } catch (err) {
        DEBUG(err);
        done(err, false);
      }
    },
  ),
);

export default passport;
