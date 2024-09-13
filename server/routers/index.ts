import 'reflect-metadata';
import { Container } from 'typedi';
import { NextFunction, Request, Response, Router } from 'express';
import { authRoutes } from './auth';
import { userRoutes } from './user';

class ApiRoutes {
  router: Router;

  constructor() {
    this.router = Router();
    this.init();
  }

  private init(): void {
    this.router
      .get('/', this.index)
      .use('/auth', authRoutes)
      .use('/user', userRoutes)
  }

  private index(req: Request, res: Response, next: NextFunction): void {
    res.json({
      success: false,
      message: 'Sorry, you may not access this server like this.',
    });
  }
}

export const apiRoutes = Container.get(ApiRoutes).router;
