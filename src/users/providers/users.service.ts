import { GetUsersParamDto } from './../dtos/get-users-param.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
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

  public findOneById(id: number) {
    console.log(id);

    return {
      id: 2,
      name: 'Jane Doe',
      email: 'jane.doe@gmail.com',
    };
  }
}
