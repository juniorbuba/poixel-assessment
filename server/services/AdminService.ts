import 'reflect-metadata';
import { Service } from 'typedi';
import { Admin } from '../models';
import { UserService } from './UserService';

@Service()
export class AdminService extends UserService {
  protected whitelist = 'id first_name last_name password email createdAt';

  constructor() {
    super(Admin);
  }

  async addPassword({ id, password }): Promise<any> {
    const user = await this.findOne({
      _id: id,
      password_set: { $exists: false },
    });
    await user.resetPassword(password);
    return user;
  }
}
