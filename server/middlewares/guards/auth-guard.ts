import { NextFunction, Request, Response } from 'express';
import * as status from 'http-status';
import { Container } from 'typedi';
import { AuthService } from '../../services';

export const AuthGuard = (req: Request, res: Response, next: NextFunction): void => {
  if (req.method === 'OPTIONS') {
    next();
  } else if (req.headers.authorization !== undefined && (req.headers.authorization as any).split(' ')[0] === 'Bearer') {
    // Handle token presented as a Bearer token in the Authorization header
    const token = (req.headers.authorization as string).split(' ')[1];
    const authService: AuthService = Container.get(AuthService);
    authService
      .validate(token)
      .then(({ user, admin }) => {
        console.log(user, 'user')
        console.log(admin, 'admin')
        if (user !== undefined) {
          (req as any).user = user;
          next();
        } else if (admin !== undefined) {
          (req as any).admin = admin;
          next();
        }
      })
      .catch((err) => {
        res.status(status.UNAUTHORIZED).json({
          error: 1,
          message: err.message,
        });
      });
  } else {
    res.status(status.UNAUTHORIZED).json({
      error: 1,
      message: 'You need to login to continue',
    });
  }
};
