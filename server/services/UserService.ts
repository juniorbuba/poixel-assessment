import 'reflect-metadata';

import { Service } from 'typedi';
import { IUser, User } from '../models';
import { ResourceService } from './ResourceService';

@Service()
export class UserService extends ResourceService {
  protected whitelist = 'id first_name last_name email password business_type email_verified createdAt';

  constructor(model) {
    super(model || User);
  }

  // Here's one function in my UserService so it isn't empty

  findByEmail(email: string): Promise<IUser> {
    return this.findOne({ email }, { email: 1 }).then((user) => {
      if (user) {
        return Promise.resolve(user);
      } else {
        return Promise.reject(`An account with email ${email} does not exist`);
      }
    });
  }
}
