import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreatePostDto } from './dtos/create-post.dto';
import { PostsService } from './posts.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdatePostDto } from './dtos/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('/:userId')
  public getUserPosts(@Param('userId') userId: string) {
    return this.postsService.findUserPosts(userId);
  }

  @ApiOperation({ summary: 'creates a new post' })
  @ApiResponse({ status: 201, description: 'post created successfully' })
  @Post()
  public createPost(@Body() createPostDto: CreatePostDto) {
    return this.postsService.createPost(createPostDto);
  }

  @Patch()
  public updatePost(@Body() updatePostDto: UpdatePostDto) {
    return updatePostDto;
  }
}
