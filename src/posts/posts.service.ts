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
  public async findUserPosts(userId: string) {
    const user = this.usersService.findOneById(userId);
    const posts = await this.postsRepository
      .find
      //   {
      //   relations: {
      //     metaOptions: true,
      //   },
      // }
      (); // either set relations or set eager in the entity

    console.log(user);
    return posts;
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

  public async deletePost(id: number) {
    const post = await this.postsRepository.findOneBy({ id });
    if (!post) {
      throw new Error('Post not found');
    }
    await this.postsRepository.delete(id);

    if (!post.metaOptions) return;

    await this.metaOptionsRepository.delete(post.metaOptions.id);

    return { deleted: true, id };
  }
}
