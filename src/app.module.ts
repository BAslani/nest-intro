import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import jwtConfig from './auth/config/jwt.config';
import { AccessTokenGuard } from './auth/guards/access-token/access-token.guard';
import { PaginationModule } from './common/pagination/pagination.module';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import environmentValidation from './config/environment.valitation';
import { MetaOptionsModule } from './meta-options/meta-options.module';
import { PostsModule } from './posts/posts.module';
import { TagsModule } from './tags/tags.module';
import { UsersModule } from './users/users.module';

const ENV = process.env.NODE_ENV;
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      load: [appConfig, databaseConfig],
      validationSchema: environmentValidation,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        username: configService.get('database.user'),
        autoLoadEntities: configService.get('database.autoloadEntities'),
        synchronize: configService.get('database.synchronize'), // use only in development
        port: +configService.get('database.port'),
        password: configService.get('database.password'),
        host: configService.get('database.host'),
        database: configService.get('database.name'),
      }),
    }),
    UsersModule,
    PostsModule,
    AuthModule,
    TagsModule,
    MetaOptionsModule,
    PaginationModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule {}
