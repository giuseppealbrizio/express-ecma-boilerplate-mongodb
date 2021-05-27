import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import path from 'path';
import { MongoDB } from './config/database.config';

/**
 * Custom error handling
 */
import errorHandler from './middlewares/errorHandler.middleware';
import { NotFoundError } from './helpers/errors.helper';

/**
 * Import passport. Strategies are called in the auth router
 */
import passport from 'passport';

/**
 * import { User } from './models/Users.model';
 * If you import mongoose models in the entry point file then you can use
 * import mongoose from 'mongoose';
 * const User = mongoose.model('User');
 * Otherwise you can import model in the file you need to call it
 */

/**
 * Global env variables definition
 */
dotenv.config();

/**
 * Call the MongoDB connection and return info about db name
 */
MongoDB().then((mongoose) => {
  console.info(`${mongoose.connection.name} is connected`);
});

/**
 * Routes import
 * @type {Router | {readonly default?: Router}}
 */
import indexRouter from './routes/index.route';
import authRouter from './routes/auth.route';
import userRouter from './routes/user.route';
/**
 * Documentation Router
 */
import swaggerRouter from './routes/swagger.route';
/**
 * Pub/Sub Routers
 */
import publisherRouter from './routes/publisher.route';
import subscriberRouter from './routes/subscriber.route';

/**
 * Define Express
 * @type {*|Express}
 */
const app = express();

/**
 * Middleware definition
 */
if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
}

/**
 * Set security HTTP Headers
 */
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

/**
 * Parse json request body
 */
app.use(express.json());

/**
 * Parse urlencoded request body
 */
app.use(express.urlencoded({ extended: true }));

/**
 * Sanitize data
 */
app.use(xss());
app.use(mongoSanitize());

/**
 * GZIP compression
 */
app.use(compression());

/**
 * Parsing cookie
 */
app.use(cookieParser());

/**
 * Cookie policy definition
 * @type {string|number}
 */
const DEFAULT_ENV = process.env.NODE_ENV || 'development';
const COOKIE_MAX_AGE = process.env.COOKIE_MAX_AGE || 1000 * 60 * 60 * 24 * 30;
const SECRET = process.env.SECRET || 'my-super-secret';

app.use(
  session({
    cookie: {
      secure: DEFAULT_ENV === 'production',
      maxAge: COOKIE_MAX_AGE,
      httpOnly: true,
      sameSite: 'lax',
    },
    secret: SECRET,
    resave: false,
    saveUninitialized: true,
    /* Store session in mongodb */
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    // unset: 'destroy',
  }),
);

/**
 * Initialize Passport and pass the session to session storage of express
 */
app.use(passport.initialize());
app.use(passport.session());

/**
 * Define static routes for express
 */
app.use(express.static(path.join(__dirname, 'public')));

/**
 * CORS policy configuration
 */
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*', // allow CORS
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // allow session cookie from browser to pass through
  }),
);

/**
 * Headers configuration
 */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL); // Update to match the domain you will make the request from
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

/**
 * Routes definitions
 */
app.use('/api/v1/', indexRouter);
app.use('/api/v1/auth/', authRouter);
app.use('/api/v1/users/', userRouter);

/**
 * Swagger Documentation endpoint
 */
app.use('/api/v1/docs/', swaggerRouter);

/**
 * Publisher endpoint
 */
app.use('/api/v1/publisher/', publisherRouter);
app.use('/api/v1/subscriber/', subscriberRouter);

/**
 * This helper function is useful if we use express as a pure API endpoint
 * Everytime you hit a route that doesn't exist it returns a json error 404
 */
app.all('*', (_, res) => {
  throw new NotFoundError('Resource not found on this server');
});

/**
 * Catchall middleware. Activate to serve every route in
 * the public directory i.e. if we have a build of React
 */
app.use((req, res) =>
  res.sendFile(path.resolve(path.join(__dirname, '../public/index.html'))),
);

app.use(errorHandler);

export default app;
