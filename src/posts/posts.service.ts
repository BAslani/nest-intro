import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/entities/meta-option.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dtos/create-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,

    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
  ) {}
  public findUserPosts(userId: string) {
    const user = this.usersService.findOneById(userId);
    return [
      {
        user: user,
        title: 'Post 1',
        content: 'Post 1 content',
      },
      {
        user: user,
        title: 'Post 2',
        content: 'Post 2 content',
      },
    ];
  }

  public async createPost(createPostDto: CreatePostDto) {
    const { metaOptions, ...postData } = createPostDto;

    const post = this.postsRepository.create({
      ...postData,
      metaOptions: metaOptions
        ? this.metaOptionsRepository.create(metaOptions)
        : undefined,
    });

    return await this.postsRepository.save(post);
  }
}
