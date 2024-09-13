import { Request, Response, NextFunction } from 'express';
import * as status from 'http-status';
import * as Joi from 'joi';
import { BUSINESS_TYPE } from '../../enums';

export const CreateUserValidator = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object().keys({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    email_verified: Joi.boolean().allow(''),
    business_type: Joi.string().valid(...Object.values(BUSINESS_TYPE))
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

export const UpdateUserValidator = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object().keys({
    first_name: Joi.string().allow(),
    last_name: Joi.string().allow(''),
    email: Joi.string().email().allow(''),
    password: Joi.string().min(8).allow(''),
    email_verified: Joi.boolean().allow(''),
    business_type: Joi.string().valid(...Object.values(BUSINESS_TYPE)).allow()
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
