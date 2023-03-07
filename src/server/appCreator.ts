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
import { router } from './authRouter';
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
  app.use('/auth', router);

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

  app.get('/api', async (req: Request, res: Response) => {
    const asdf = await db.getTables();
    return res.status(200).json({ a: asdf });
  });

  // all unrecognized paths get redirected to '/'
  // This is so that users who enter the app through route that is not '/' will still receive bundle
  // and React Router (on the frontend) will take care of the rest
  // Also note we cannot use res.redirect, or else the url itself will be redirected to '/'
  // See: https://ui.dev/react-router-cannot-get-url-refresh for alternative strategies
  app.get('/*', function (req, res) {
    return res
      .status(200)
      .sendFile(path.resolve(__dirname, '../../dist/index.html'));
  });

  return app;
};
