import 'reflect-metadata';
import { Inject, Service } from 'typedi';
import { IAdmin, IUser } from '../models';
import { AdminService } from './AdminService';
import { JWTService } from './JWTService';
import { UserService } from './UserService';

@Service()
export class AuthService {
  @Inject()
  private readonly jwt: JWTService;

  @Inject()
  public readonly userService: UserService;

  @Inject()
  public readonly adminService: AdminService;

  async signin_user({ email, password }): Promise<{ auth_token: string; user: IUser; admin?: boolean }> {
    const user = await this.authenticateUser({ email, password });
    const auth_token = this.jwt.sign({ user: user._id }, '7 days');
    return { auth_token, user };
  }

  async signin_admin({ email, password }): Promise<{ auth_token: string; user: IAdmin; admin?: boolean }> {
    const user = await this.authenticateAdmin({ email, password });
    const auth_token = this.jwt.sign({ admin: user._id }, '6 hours');
    return { auth_token, user, admin: true };
  }

  async validate(token): Promise<{ user?: IUser; admin?: IAdmin }> {
    const decoded = this.jwt.verify(token);
    console.log(decoded, 'decoded token')
    if (decoded !== null) {
      let user: IUser;
      let admin: IAdmin;
      if (decoded.user !== undefined) {
        user = await this.userService.findById(decoded.user, {
          email: 1,
          first_name: 1,
          last_name: 1
        });
        await user.save();
        return { user };
      } else if (decoded.admin !== undefined) {
        console.log(decoded.admin, 'decoded admin')
        admin = await this.adminService.findById(decoded.admin, {
          email: 1,
          first_name: 1,
          last_name: 1,
          level: 1
        });
        console.log(admin, 'admin find by id')
        await admin.save();
        return { admin };
      }
    }
    throw new Error('Invalid client authorization, login required');
  }

  private async authenticateUser({ email, password }): Promise<any> {
    const user = await this.userService.findOne({ email });
    if (user !== null) {
      const valid = await user.comparePassword(password);
      if (valid === true) {
        await user.save();
        return user;
      }
    }
    throw new Error('Email or password is wrong');
  }

  private async authenticateAdmin({ email, password }): Promise<any> {
    try{
        const admin = await this.adminService.findOne({ email });
        if (admin !== null) {
          const valid = await admin.comparePassword(password);
          if (valid === true) {
            await admin.save();
            return admin;
          }
        }
    }
    catch(err){
      console.log(err)
      throw new Error('Email or password is wrong');
    }
  }
}
