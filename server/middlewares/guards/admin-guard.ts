import { NextFunction, Request, Response } from 'express';
import * as status from 'http-status';

export const AdminGuard = (req: Request, res: Response, next: NextFunction): void => {
  console.log((req as any).admin, 'req.admin')
    console.log((req as any).admin.id, 'req.admin.id')
    console.log(req.method, 'req.method')
  if (req.method === 'OPTIONS') {
    next();
  } else if ((req as any).admin !== undefined && (req as any).admin.id !== undefined) {
    
    // also validate admin headers is set
    if (req.headers['x-requested-with'] !== undefined && req.headers['x-requested-with'] === 'admin') {
      next();
    } else {
      res.status(status.UNAUTHORIZED).json({
        error: 1,
        message: 'Only an authorized admin can perform the requested action',
      });
    }
  } else {
    res.status(status.UNAUTHORIZED).json({
      error: 1,
      message: 'Only an authorized admin can perform the requested action',
    });
  }
};
