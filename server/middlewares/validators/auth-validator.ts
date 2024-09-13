import { Request, Response, NextFunction } from 'express';
import * as status from 'http-status';
import * as Joi from 'joi';

export const AuthValidator = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });

  const data = req.body;

  const { error } = schema.validate(data);

  if (error) {
    res.status(status.UNPROCESSABLE_ENTITY).json({
      error: 1,
      message: error.message,
    });
  } else {
    next();
  }
};
