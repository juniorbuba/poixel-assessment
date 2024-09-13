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

  // Admin-specific function go here
}
