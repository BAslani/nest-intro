import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { postType } from '../enums/postType.enum';
import { postStatus } from '../enums/statusType.enum';
import { CreatePostMetaOptionsDto } from '../../meta-options/dtos/create-post-meta-options.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'post title',
    example: 'nest title',
  })
  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  @MaxLength(512)
  title: string;

  @ApiProperty({
    enum: postType,
    description: 'possible values: post, page, story, series',
    example: 'post',
  })
  @IsEnum(postType)
  @IsNotEmpty()
  postType: postType;

  @ApiProperty({
    description: 'post slug',
    example: 'nest-slug',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'a slug should be lowercase alphanumeric with dashes, e.g. "my-slug"',
  })
  @MaxLength(256)
  slug: string;

  @ApiProperty({
    enum: postStatus,
    description: 'possible values: draft, scheduled, review, published',
    example: 'draft',
  })
  @IsEnum(postStatus)
  @IsNotEmpty()
  status: postStatus;

  @ApiPropertyOptional({
    description: 'post content',
    example: 'nest content',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    description: 'serialized JSON object',
    example:
      '\r\n "@context": "https://schema.org",\r\n "name": "nest",\r\n "description": "nest description",\r\n "image": "https://nestjs.com/img/logo-nest.svg",\r\n "url": "https://nestjs.com"',
  })
  @IsOptional()
  @IsJSON()
  schema?: string;

  @ApiPropertyOptional({
    description: 'post image url',
    example: 'https://nestjs.com/img/logo-nest.svg',
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(1024)
  featuredImageUrl?: string;

  @ApiPropertyOptional({
    description: 'post published date',
    example: '2021-01-01T00:00:00.000Z',
  })
  @IsISO8601()
  @IsOptional()
  publishedOn?: string;

  @ApiPropertyOptional({
    description: 'post tag ids',
    example: [1, 2],
  })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  tags?: number[];

  @ApiPropertyOptional({
    type: 'string',
    required: false,
    items: {
      type: 'object',
      properties: {
        metaValue: {
          type: 'json',
          description: 'the "metaValue" is a JSON string',
          example: '{"sidebarEnabled": true}',
        },
      },
    },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePostMetaOptionsDto)
  metaOptions?: CreatePostMetaOptionsDto | null;

  @IsInt()
  @IsNotEmpty()
  authorId: number;
}
