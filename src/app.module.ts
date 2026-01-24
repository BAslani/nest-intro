import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MetaOptionsModule } from './meta-options/meta-options.module';
import { PostsModule } from './posts/posts.module';
import { TagsModule } from './tags/tags.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    PostsModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [],
      useFactory: () => ({
        type: 'postgres',
        username: 'postgres',
        autoLoadEntities: true,
        synchronize: true, // use only in development
        port: 5432,
        password: 'behzad@postgres',
        host: 'localhost',
        database: 'nest-blog',
      }),
    }),
    TagsModule,
    MetaOptionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
