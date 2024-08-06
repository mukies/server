import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = req.cookies.jwt;

    if (!token) throw new UnauthorizedException('Token is not found');

    const decode = jwt.verify(token, process.env.JWT_KEY) as { userID: string };

    if (!decode) throw new UnauthorizedException('Invalid Token');
    req.user = decode.userID;

    return true;
  }
}
