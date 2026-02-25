import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import jwtConfig from 'src/auth/config/jwt.config';
import { REQUEST_USER_KEY } from 'src/auth/constants/auth.constants';

interface JwtPayload {
  sub: number;
  email: string;
}

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException('token is not provided');

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        token,
        this.jwtConfiguration,
      );

      request[REQUEST_USER_KEY] = payload;
      console.log(payload);
    } catch {
      throw new UnauthorizedException('invalid token');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const token = request.headers.authorization?.split(' ')[1];

    return token;
  }
}
