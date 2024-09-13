import 'reflect-metadata';
import { Container } from 'typedi';

import { NextFunction, Request, Response, Router } from 'express';
import { AdminGuard, AuthGuard } from '../middlewares';
import { adminRoutes } from './admin';
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
      .use('/admins', AuthGuard, AdminGuard, adminRoutes)
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
