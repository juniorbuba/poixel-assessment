import 'reflect-metadata';
import { Container } from 'typedi';
import { NextFunction, Request, Response, Router } from 'express';
import * as status from 'http-status';
import { AdminService } from '../services';

class AdminRoutes {
  router: Router;

  constructor() {
    this.router = Router();
    this.init();
  }

  private init(): void {
    this.router
      .post('/', this.createAdmin)
      .get('/', this.getAdmins)
      .get('/:id', this.getAdmin)
      .put('/:id', this.updateAdmin)
      .delete('/:id', this.deleteAdmin)
  }

  private createAdmin(req: Request, res: Response, next: NextFunction): void {
    const adminService = Container.get(AdminService);

    adminService
      .create(req.body)
      .then((admin) => {
        res.status(status.CREATED).json({
          success: 1,
          message: 'Admin added successfully',
          data: { admin },
        });
      })
      .catch((err) => {
        res.status(status.BAD_REQUEST).json({
          error: 1,
          message: err.message,
        });
      });
  }

  private getAdmins(req: Request, res: Response, next: NextFunction): void {
    const adminService = Container.get(AdminService);

    const page = req.query.page !== '' ? Number(req.query.page) : 1;
    const page_size = req.query.size !== '' ? Number(req.query.size) : 12;
    adminService
      .paginate({}, page, page_size)
      .then((results) => res.json(results))
      .catch(() => {});
  }

  private getAdmin(req: Request, res: Response, next: NextFunction): void {
    const adminService = Container.get(AdminService);

    adminService
      .findById(req.params.id)
      .then((admin) => {
        res.json({
          data: { admin },
          message: `Admin with id: ${req.params.id} found`,
          success: 1,
        });
      })
      .catch((err) => {
        res.status(status.NOT_FOUND).json({
          message: err.message,
          error: 1,
        });
      });
  }

  private updateAdmin(req: Request, res: Response, next: NextFunction): void {
    const adminService = Container.get(AdminService);

    adminService
      .update(req.params.id, req.body)
      .then((admin) => {
        res.json({
          success: 1,
          message: 'Admin has been updated successfully',
          data: { admin },
        });
      })
      .catch((err) => {
      });
  }

  private deleteAdmin(req: Request, res: Response, next: NextFunction): void {
    if (req.params.id === (req as any).admin.id) {
      res.status(status.UNAUTHORIZED).json({
        error: 1,
        message: 'You cannot delete your account',
      });
    } else {
      const adminService = Container.get(AdminService);

      adminService
        .removeOne({
          _id: req.params.id,
          level: { $lte: (req as any).admin.level },
        })
        .then((admin) => {
          if (admin !== undefined) {
            res.status(status.OK).json({});
          } else {
            res.status(status.UNAUTHORIZED).json({
              error: 1,
              message: 'Admin account was not deleted',
            });
          }
        })
        .catch(() => {});
    }
  }

}

export const adminRoutes = Container.get(AdminRoutes).router;
