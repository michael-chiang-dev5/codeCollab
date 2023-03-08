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

// When client accesses endpoint /google, backend will do request to google
// authentication server. You need to enable google oauth authentication and
// set up client ID /secret. In addition, you must set callback url to
// /google/callback
router.get('/google', passport.authenticate('google', { scope: ['email'] }));

// Callback url. While setting up oauth authentication, you must set callback
// url to /google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/failure',
  }),
  (req, res) => {
    return res.redirect('/');
  }
);

router.get('/failure', (request, response) => {
  response.status(500).send('authentication failed...');
});
// TODO: add comments about login, logout being set by passport
// https://www.passportjs.org/concepts/authentication/login/
router.get('/logout', (request, response) => {
  request.logout(() => {
    // https://stackoverflow.com/questions/72336177/error-reqlogout-requires-a-callback-function
    console.log('logging out');
    request.session.destroy(() => {}); // destroy cookie?
    response.redirect('/');
  });
});
