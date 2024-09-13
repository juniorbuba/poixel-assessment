import 'reflect-metadata';
import { Container } from 'typedi';
import { NextFunction, Request, Response, Router } from 'express';
import * as status from 'http-status';
import {
  AdminGuard,
  AuthGuard,
  UpdateUserValidator,
  CreateUserValidator,
} from '../middlewares';
import { UserService } from '../services';

class UserRoutes {
  router: Router;

  private init(): void {
    this.router
      .get('/exists', AuthGuard, AdminGuard, this.searchByEmail)
      .get('/', AuthGuard, AdminGuard, this.getUsers)
      .get('/:id', AuthGuard, AdminGuard, this.getUser)
      .post('/', AuthGuard, AdminGuard, CreateUserValidator, this.createUser)
      .put('/:id', AuthGuard, AdminGuard, UpdateUserValidator, this.updateUser)
      .delete('/:id', AuthGuard, AdminGuard, this.deleteUser)
  }

  constructor() {
    this.router = Router();
    this.init();
  }

  private searchByEmail(req: Request, res: Response, next: NextFunction): void {
    const userService = Container.get(UserService);

    userService
      .findByEmail(req.query.q as string)
      .then((user) => {
        res.json({
          success: 1,
          message: `An account with email ${req.query.q as string} exists`,
          data: user,
        });
      })
      .catch((err) => {
        res.status(status.NOT_FOUND).json({
          error: 1,
          message: err.message,
        });
      });
  }

  private createUser(req: Request, res: Response, next: NextFunction): void {
    const userService = Container.get(UserService);

    userService
      .create(req.body)
      .then((user) => {
        res.status(status.CREATED).json({
          success: 1,
          message: 'User account created successfully',
          data: { user },
        });
      })
      .catch((err) => {
        console.log(err)
        res.status(status.BAD_REQUEST).json({
          error: 1,
          message: err.message !== '' ? err.message : 'User account was not created',
        });
      });
  }

  private getUsers(req: Request, res: Response, next: NextFunction): void {
    const userService = Container.get(UserService);

    const userType = req.query.userType ? { user_type: req.query.userType } : {};
    const page = req.query.page !== '' ? Number(req.query.page) : 1;
    const page_size = req.query.size !== '' ? Number(req.query.size) : 12;
    userService
      .paginate({ ...userType }, page, page_size)
      .then((results) => res.json(results))
      .catch((err) => {
        console.log(err)
        res.status(status.BAD_REQUEST).json({
          error: 1,
          message: 'Failed to get all users'
        });
      });
  }

  private async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userService = Container.get(UserService);

    userService
      .findById(req.params.id)
      .then(async (user) => {
        res.json({
          data: user,
          message: `User with id: ${req.params.id} found`,
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

  private updateUser(req: Request, res: Response, next: NextFunction): void {
    const userService = Container.get(UserService);

    userService
      .update(req.params.id, req.body)
      .then((user) => {
        res.json({
          success: 1,
          message: 'User has been updated successfully',
          data: { user },
        });
      })
      .catch((err) => {
        res.status(status.BAD_REQUEST).json({
          error: 1,
          message: err.message !== '' ? err.message : 'Unable to update user',
        });
      });
  }

  private deleteUser(req: Request, res: Response, next: NextFunction): void {
    const userService = Container.get(UserService);

    userService
      .delete(req.params.id)
      .then(() => {
        res.status(status.OK).json({ success: 1, message: "User successfully deleted" });
      })
      .catch((err) => {
        res.status(status.BAD_REQUEST).json({
          error: 1,
          message: err.message !== '' ? err.message : 'Failed to delete user',
        });
      });
  }
}

export const userRoutes = Container.get(UserRoutes).router;
