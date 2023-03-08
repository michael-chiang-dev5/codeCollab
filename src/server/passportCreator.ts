import passport from 'passport';
import { db } from './db/dbPostgreSQL';
import dotenv from 'dotenv';
dotenv.config();
import oauth from 'passport-google-oauth2';
import { Request } from 'express';
import { UserType } from '../types/types';

export const passportCreator = function () {
  // this function takes an OAuth profile and searches the database for
  // a matching user. If found, the function returns the user info. If
  // not found, the function adds user to the database and returns user
  // info.
  // TODO: maybe I should store accessToken? It's used to access
  // google API on behalf of the user but at the moment I cannot thnk
  // of a use case
  // See: https://www.passportjs.org/packages/passport-google-oauth2/
  // More about the verify function here: https://www.passportjs.org/concepts/authentication/strategies/
  const verify = async (
    request: Request,
    accessToken: string,
    refreshToken: undefined, // refreshTokens are not implemented in passport.js; you implement them yourself if you want, see https://stackoverflow.com/questions/15593446/refresh-token-in-passport-js
    profile: { [key: string]: any },
    // next is for express, done is for passport. They do differ slightly. A good writeup on the differences between next() and done(): https://stackoverflow.com/questions/26164837/difference-between-done-and-next-in-node-js-callbacks
    done: Function // there should be a type for this, but passport doesn't seem to have a type for done
  ) => {
    const userData: UserType = { _id: null, ...profile._json };
    const users = await db.getUsersBySub(userData.sub);
    if (users.length === 0) {
      // user not found so add user to db
      const user = await db.createUser(profile._json);
      return done(null, user);
    } else {
      // user found
      // the first  argument of done is err. You must set err to null or else
      // user will not be authenticated
      return done(null, users[0]);
    }
    // TODO: consider error checking for >1 user found for a given sub
  };

  const GoogleStrategy = oauth.Strategy;
  const strategy = new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.WEBSITE_URL}auth/google/callback`,
      passReqToCallback: true,
    },
    // This is a "verify" callback accepts credentials and calls `done`
    // https://www.passportjs.org/packages/passport-google-oauth2/
    verify
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
