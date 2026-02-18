import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/entities/meta-option.entity';
import { UsersModule } from 'src/users/users.module';
import { Post } from './entities/post.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TagsModule } from 'src/tags/tags.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, MetaOption]),
    UsersModule,
    TagsModule,
    PaginationModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
