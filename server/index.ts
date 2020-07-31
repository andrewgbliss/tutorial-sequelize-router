import express, { Response, Request, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import db from '../db';
import routes from './routes';

const app = express();

/**
 * Environment
 */
const PORT = process.env.PORT;
const NODE_ENV = process.env.NODE_ENV;

/**
 * Express Variables
 */
app.set('port', PORT);
app.set('env', NODE_ENV);
app.set('db', db);

/**
 * Middleware
 */
app.use(logger('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', routes);

app.use((req: Request, res: Response, next: NextFunction) => {
  const err: any = new Error(`${req.method} ${req.url} Not Found`);
  err.status = 404;
  next(err);
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
});

const server = app.listen(PORT, () => {
  console.log(
    `Express Server started on Port ${app.get(
      'port'
    )} | Environment : ${app.get('env')}`
  );
});

export default {
  app,
  server,
};
