import express from 'express';
import { passportCreator } from './passportCreator';
export const router = express.Router();
const passport = passportCreator();
import { UserType, ErrorType } from '../types/types';

router.get('/user', (req, res, next) => {
  try {
    // req.user is the parsed jwt containing user information
    // It will either be an object of shape UserType (valid jwt) or undefined
    let userData: UserType;
    if (req.user === undefined)
      userData = {
        _id: null,
        sub: '',
        picture: '',
        email: '',
        email_verified: false,
      };
    else userData = req.user as UserType;
    return res.status(200).json(userData);
  } catch (err) {
    const errObj: ErrorType = {
      message: err,
      status: 500,
      location: '/auth/user',
    };
    return next(errObj);
  }
});

// TODO: consider renaming route to "login"
// Client access this route when the user clicks the "log in" button
// When client accesses endpoint /google, backend will do request to google
// authentication server. You need to enable google oauth authentication and
// set up client ID /secret. In addition, you must set callback url to
// /google/callback
router.get('/google', passport.authenticate('google', { scope: ['email'] }));

// Callback url. While setting up oauth authentication, you must set callback
// url to /google/callback in developer console. When google server access callback url,
// passport.authenticate middleware updates passport. If an error occurs in passport.authenticate
// middleware, /auth/google/failure route is accessed. Otherwise, we redirect to '/' with google
// jwt set
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/google/failure',
  }),
  (req, res) => {
    return res.redirect('/');
  }
);

// If there is a problem with the google/callback route (ie, issue in the passport.authenticate middleware)
// then redirected to failure route
router.get('/google/failure', (req, res, next) => {
  const errObj: ErrorType = {
    message:
      'google oauthentication failed (most likely issue with passport.authenticate)',
    status: 500,
    location: 'auth/google/failure',
  };
  return next(errObj);
});

// https://www.passportjs.org/concepts/authentication/login/
router.get('/logout', (req, res, next) => {
  try {
    req.logout(() => {
      // https://stackoverflow.com/questions/72336177/error-reqlogout-requires-a-callback-function
      req.session.destroy(() => {}); // remove jwt
      res.redirect('/');
    });
  } catch (err) {
    const errObj: ErrorType = {
      message: err,
      status: 500,
      location: '/auth/logout',
    };
    return next(errObj);
  }
});
