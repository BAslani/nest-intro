import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Patch,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { MetaOption } from 'src/meta-options/entities/meta-option.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { TagsService } from 'src/tags/tags.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dtos/create-post.dto';
import { GetPostsDto } from './dtos/get-posts.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tagsService: TagsService,
    private readonly paginationProvider: PaginationProvider,

    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
  ) {}
  public async findAll(
    postQuery: GetPostsDto,
    // userId: number
  ): Promise<Paginated<Post>> {
    return await this.paginationProvider.paginateQuery(
      {
        limit: postQuery.limit,
        page: postQuery.page,
      },
      this.postsRepository,
    );
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
    try {
      let tags: Tag[] = [];

      if (updatePostDto.tags) {
        try {
          tags = await this.tagsService.findTags(updatePostDto.tags);
        } catch (error) {
          console.log(error);
          throw new BadRequestException(
            'Invalid tags provided',
            'One or more tags could not be resolved',
          );
        }
      }

      const post = await this.postsRepository.findOneBy({
        id: updatePostDto.id,
      });

      if (!post) {
        throw new NotFoundException(
          `Post with id ${updatePostDto.id} not found`,
        );
      }

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
    } catch (error) {
      // Allow known HTTP exceptions to pass through
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      console.error(error);

      throw new RequestTimeoutException(
        'Failed to update post, try again later',
        {
          description: 'Database or service communication error',
        },
      );
    }
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
