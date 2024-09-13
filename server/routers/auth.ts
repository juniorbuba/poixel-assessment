import 'reflect-metadata';
import { Container } from 'typedi';
import { NextFunction, Request, Response, Router } from 'express';
import * as status from 'http-status';
import { AuthGuard, AuthValidator } from '../middlewares';
import { AuthService } from '../services/AuthService';

class AuthRoutes {
  router: Router;

  private init(): void {
    this.router
      .get('/', AuthGuard, this.validate)
      .post('/user', AuthValidator, this.authenticateUser)
      .post('/admin', AuthValidator, this.authenticateAdmin)
      .delete('/', AuthGuard, this.destroy)
  }

  constructor() {
    this.router = Router();
    this.init();
  }

  private validate(req: Request, res: Response, next: NextFunction): void {
    // If the request reaches here, token is valid
    res.json({ success: 1, message: 'auth_token is valid' });
  }

  private authenticateUser(req: Request, res: Response, next: NextFunction): void{
    const authService = Container.get(AuthService)

    authService
        .signin_user(req.body)
        .then(async ({ user, auth_token }) => {
            res.json({
              success: 1,
              message: 'Session created',
              data: { auth_token, user }
            });
          })
        .catch((err) => {
          console.log(err)
          res.status(status.UNAUTHORIZED).json({
            error: 1,
            message: err.message,
          });
        });
  }

  private authenticateAdmin(req: Request, res: Response, next: NextFunction): void {
    const authService = Container.get(AuthService);

      authService
        .signin_admin(req.body)
        .then(({ user, auth_token }) => {
          res.json({
            success: 1,
            message: 'Session created',
            data: { auth_token, user, admin: true },
          });
        })
        .catch((err) => {
          res.status(status.UNAUTHORIZED).json({
            error: 1,
            message: err.message,
          });
        });
  }

  private destroy(req: Request, res: Response, next: NextFunction): void {
    res.status(status.NO_CONTENT).json();
  }
}

export const authRoutes = Container.get(AuthRoutes).router;
