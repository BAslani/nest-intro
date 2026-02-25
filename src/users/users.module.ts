import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import jwtConfig from 'src/auth/config/jwt.config';
import profileConfig from './config/profile.config';
import { User } from './entities/user.entity';
import { CreateUserProvider } from './providers/create-user.provider';
import { UsersCreateManyProvider } from './providers/users-create-many.provider';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(profileConfig),
    forwardRef(() => AuthModule),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersCreateManyProvider, CreateUserProvider],
  exports: [UsersService],
})
export class UsersModule {}
