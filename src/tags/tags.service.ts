import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { CreateTagDto } from './dtos/create-tag.dto';
import { Repository } from 'typeorm';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
  ) {}
  public async createTag(createTagDto: CreateTagDto) {
    const tag = this.tagsRepository.create(createTagDto);
    console.log('created Tag: ', tag);
    return await this.tagsRepository.save(tag);
  }
}
