import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import profileConfig from './config/profile.config';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersParamDto } from './dtos/get-users-param.dto';
import { User } from './entities/user.entity';

/**
 * class to handle user related operations
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>,

    private readonly dataSource: DataSource,
  ) {}

  /**
   * method to create a new user
   */
  public async createUser(createUserDto: CreateUserDto) {
    let existingUser: User | null = null;

    try {
      existingUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException(
        'Failed to fetch user, try again later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const user = this.usersRepository.create(createUserDto);
    try {
      return await this.usersRepository.save(user);
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException(
        'Failed to create user, try again later',
        {
          description: 'Error connecting to the database',
        },
      );
    }
  }

  /**
   * method to fetch all users
   */
  public findAll(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getUsersParamDto: GetUsersParamDto,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    limit: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    page: number,
  ) {
    throw new HttpException(
      {
        status: HttpStatus.MOVED_PERMANENTLY,
        error: 'The API endpoint does not exist',
        fileName: 'users.service.ts',
        lineNumber: 80,
      },
      HttpStatus.MOVED_PERMANENTLY,
      {
        description: 'Occured because the API endpoint was permanently moved',
      },
    );
  }

  /**
   * finds a single user by id
   */
  public async findOneById(id: number) {
    try {
      const user = await this.usersRepository.findOneBy({ id });

      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new RequestTimeoutException(
        'Failed to fetch user, try again later',
        {
          description: 'Error connecting to the database',
        },
      );
    }
  }

  public async createMany(createUsersDto: CreateUserDto[]) {
    const newUsers: User[] = [];
    // create query runner instance
    const queryRunner = this.dataSource.createQueryRunner();

    // connect query runner to database
    await queryRunner.connect();

    // start transaction
    await queryRunner.startTransaction();
    try {
      for (const user of createUsersDto) {
        const newUser = queryRunner.manager.create(User, user);
        const result = await queryRunner.manager.save(newUser);
        newUsers.push(result);
      }
      // commit if successful
      await queryRunner.commitTransaction();
    } catch (error) {
      // rollback if unsuccessful
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // release connection
      await queryRunner.release();
    }
  }
}
