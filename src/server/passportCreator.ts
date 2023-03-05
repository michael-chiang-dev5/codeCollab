import passport from 'passport';
import { db } from './db/dbPostgreSQL';
import dotenv from 'dotenv';
dotenv.config();

export const passportCreator = function () {
  // this function takes an OAuth profile and searches the database for
  // a matching user. If found, the function returns the user info. If
  // not found, the function adds user to the database and returns user
  // info.
  // TODO: maybe I should store accessToken? It's used to access
  // google API on behalf of the user but at the moment I cannot thnk
  // of a use case
  const cb = async (request, accessToken, refreshToken, profile, done) => {
    console.log('getting user');
    const userInfo = await db.getUser(profile.sub);
    // check if user is found
    if (userInfo) {
      // the first  argument of done is err. You must set err to null or else
      // user will not be authenticated
      return done(null, userInfo);
    } else if (userInfo === null) {
      // user not found so add user to db
      // profile._json contains the following fields:
      //   sub, picture, email, email_verified
      const _id = await db.createUser(profile._json);
      return done(null, { ...profile._json, _id });
    } else if (userInfo === undefined) {
      // this means there was an error with db.getUser. TODO: test for error object
      return done(null, { ...profile._json, _id: null });
    }
  };

  const GoogleStrategy = require('passport-google-oauth2').Strategy;
  const strategy = new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:8080/auth/google/callback',
      // http://codecollab-env.eba-mxadhirz.us-west-1.elasticbeanstalk.com/
      passReqToCallback: true,
    },
    cb
  );

  passport.use(strategy);

  // these functions are used to to generate jwt token containing
  // user data
  passport.serializeUser(function (user, done) {
    done(null, user);
  });
  passport.deserializeUser(function (user: Express.User, done) {
    done(null, user);
  });

  return passport;
};
