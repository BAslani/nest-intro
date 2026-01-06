import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  ) {}

  /**
   * method to create a new user
   */
  public async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      console.log('error');
    }

    const user = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(user);
  }

  /**
   * method to fetch all users
   */
  public findAll(
    getUsersParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    console.log(getUsersParamDto);
    console.log(limit);
    console.log(page);

    return [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@gmail.com',
      },
      {
        id: 2,
        name: 'Jane Doe',
        email: 'jane.doe@gmail.com',
      },
    ];
  }

  /**
   * finds a single user by id
   */
  public findOneById(id: number) {
    return this.usersRepository.findOneBy({ id });
  }
}
