import { MetaOption } from 'src/meta-options/entities/meta-option.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { postType } from '../enums/postType.enum';
import { postStatus } from '../enums/statusType.enum';
import { User } from 'src/users/entities/user.entity';
import { Tag } from 'src/tags/entities/tag.entity';
@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 512,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'enum',
    enum: postType,
    nullable: false,
    default: postType.post,
  })
  postType: postType;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
    unique: true,
  })
  slug: string;

  @Column({
    type: 'enum',
    enum: postStatus,
    nullable: false,
    default: postStatus.draft,
  })
  status: postStatus;

  @Column({
    type: 'text',
    nullable: true,
  })
  content: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  schema: string;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: true,
  })
  featuredImageUrl: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  publishedOn: Date;

  @OneToOne(() => MetaOption, (metaOption) => metaOption.post, {
    // cascade: ['insert', 'update'],
    cascade: true,
    // eager: true, // either set eager or set relations in the service
  })
  @JoinColumn()
  metaOptions?: MetaOption;

  @ManyToMany(() => Tag, (tag) => tag.posts, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  tags?: Tag[];

  @ManyToOne(() => User, (user) => user.posts)
  author: User;
}
