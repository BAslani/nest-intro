import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { PostsService } from './posts.service';

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

  @Delete()
  public deletePost(@Query('id', ParseIntPipe) id: number) {
    return this.postsService.deletePost(id);
  }
}
