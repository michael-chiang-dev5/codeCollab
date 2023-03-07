import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
import { db } from './db/dbPostgreSQL';
import { passportCreator } from './passportCreator';
import session from 'express-session';
import { router as authRouter } from './authRouter';
import { router as apiRouter } from './apiRouter';

import cors from 'cors';

export const appCreator = function () {
  const app = express();

  // TODO: read up on this
  app.use(
    cors({
      credentials: true,
      origin: true,
    })
  );

  // passport is used for authentication
  const passport = passportCreator();
  // session middleware parses the oauth jwt.
  app.use(
    session({
      secret: 'asdf', // TODO: change this to something more secure
      resave: true,
      saveUninitialized: true,
    })
  );
  app.use(passport.authenticate('session'));

  // required to parse post data
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // routers
  app.use('/auth', authRouter);
  app.use('/api', apiRouter);

  /*
   * Serves production build on route: localhost:8080
   * You must first build production files via: npm run build
   */
  // serves static files bundle.css, bundle.js
  app.use(express.static('dist'));
  // serves index.html
  app.get('/', (req: Request, res: Response) => {
    return res
      .status(200)
      .sendFile(path.resolve(__dirname, '../../dist/index.html'));
  });

  // app.get('/api', async (req: Request, res: Response) => {
  //   return res.status(200).json({ a: 'b' });
  // });

  // TODO: I don't think I need this anymore, webpack takes care of it
  // all unrecognized paths get redirected to '/'
  // This is so that users who enter the app through route that is not '/' will still receive bundle
  // and React Router (on the frontend) will take care of the rest
  // Also note we cannot use res.redirect, or else the url itself will be redirected to '/'
  // See: https://ui.dev/react-router-cannot-get-url-refresh for alternative strategies
  app.get('/*', function (req, res) {
    console.log(
      'user tried to access unknown path, sending bundle and allowing react router to try to resolve path'
    );
    return res
      .status(200)
      .sendFile(path.resolve(__dirname, '../../dist/index.html'));
  });

  return app;
};
