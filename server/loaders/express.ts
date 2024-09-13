import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';
import * as http from 'http';
import * as https from 'https';
import * as morgan from 'morgan';
import { Request, Response, NextFunction } from 'express';
import { config } from '../config';
import { apiRoutes } from '../routers';
import { dbconnect } from './dbconnect';
import { runSeeder } from '../seeds/seed-admin';

export class ExpressApp {
  public server: http.Server | https.Server;

  constructor(public app: express.Application) {
    this.config();
    this.routes();
  }

  private config(): void {
    this.app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
          },
        },
        referrerPolicy: {
          policy: 'strict-origin-when-cross-origin',
        },
        frameguard: { action: "deny" },
      })
    );

    if (config.env.is_production) {
      this.app.set('trust proxy', true);
      this.app.set('trust proxy', 'loopback');
    }

    if (!config.env.is_test) {
      this.app.use(morgan('combined'));
    }

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  private async routes(): Promise<void> {

    const allowedOrigins = [config.apps.website, config.apps.webapp, config.apps.admin];

    this.app.use(
      cors({
        credentials: true,
        methods: 'GET, POST, PUT, DELETE',
        allowedHeaders: 'Origin, Authorization, X-Requested-With, X-Forwarded-Proto, Content-Type, Accept',
        // origin: '*',
        origin: (origin, callback) => {
          if (allowedOrigins.includes(origin) || origin === undefined) {
            return callback(null, true)
          }
          const msg =
            'The CORS policy for this site does not allow access from the specified Origin.'
          return callback(new Error(msg), false)
        }
      }),
    );

    await runSeeder();
    await dbconnect();

    this.app.use('/api/v1', apiRoutes);
    this.app.use('/v1', apiRoutes);

    this.app.get('*', (req: Request, res: Response) => {
      res.json({
        message: 'You need to make a valid API request to this server',
      });
    });

    // catch 404 and forward to error handler
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      const err: any = new Error(`${req.originalUrl} was not found`);
      err.status = 404;
      next(err);
    });

    this.app.get('/health', (req, res) => {
      res.status(200).send('API server is up and running');
    });

    // error handler
    this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = config.env.is_development ? err : {};
      res.status(err.status ? err.status : 500);
      if (req.xhr || req.accepts('application/json') !== false) {
        res.send({
          message: err.message !== '' ? err.message : 'API routing error',
          status: err.status,
        });
      } else {
        // render the error page
        res.render('error.html');
      }
    });
  }

  createServer(port: number): https.Server | http.Server {
    this.app.set('port', port);
    this.server = http.createServer(this.app);
    process.on('SIGTERM', () => process.exit());
    return this.server;
  }
}
