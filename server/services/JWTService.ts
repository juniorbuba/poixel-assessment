import 'reflect-metadata';
import { Service } from 'typedi';
import { sign, verify } from 'jsonwebtoken';
import { config } from '../config';

@Service()
export class JWTService {
  sign(data: any, expiration: string): string {
    return sign(data, config.session.secret, { expiresIn: expiration });
  }

  verify(token: string): any {
    return verify(token, config.session.secret);
  }
}
