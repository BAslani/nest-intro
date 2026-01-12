import { Injectable, Patch } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/entities/meta-option.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { TagsService } from 'src/tags/tags.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dtos/create-post.dto';
import { Post } from './entities/post.entity';
import { UpdatePostDto } from './dtos/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tagsService: TagsService,

    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
  ) {}
  public async findUserPosts(userId: number) {
    const user = this.usersService.findOneById(userId);
    const posts = await this.postsRepository.find({
      relations: {
        metaOptions: true,
        author: true,
        tags: true,
      },
    }); // either set relations or set eager in the entity

    console.log(user);
    return posts;
  }

  public async createPost(createPostDto: CreatePostDto) {
    const author = await this.usersService.findOneById(createPostDto.authorId);
    if (!author) throw new Error('User not found');

    const { metaOptions, ...postData } = createPostDto;
    let tags: Tag[] = [];
    if (createPostDto.tags) {
      tags = await this.tagsService.findTags(createPostDto.tags);
    }

    const post = this.postsRepository.create({
      ...postData,
      author,
      metaOptions: metaOptions
        ? this.metaOptionsRepository.create(metaOptions)
        : undefined,
      tags: tags,
    });

    return await this.postsRepository.save(post);
  }

  @Patch()
  public async updatePost(updatePostDto: UpdatePostDto) {
    let tags: Tag[] = [];
    if (updatePostDto.tags) {
      tags = await this.tagsService.findTags(updatePostDto.tags);
    }

    const post = await this.postsRepository.findOneBy({
      id: updatePostDto.id,
    });

    if (!post) return;

    post.title = updatePostDto.title ?? post.title;
    post.content = updatePostDto.content ?? post.content;
    post.status = updatePostDto.status ?? post.status;
    post.postType = updatePostDto.postType ?? post.postType;
    post.slug = updatePostDto.slug ?? post.slug;
    post.featuredImageUrl =
      updatePostDto.featuredImageUrl ?? post.featuredImageUrl;
    post.publishedOn = updatePostDto.publishedOn ?? post.publishedOn;

    post.tags = tags;

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
