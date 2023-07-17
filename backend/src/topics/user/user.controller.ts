import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Request } from '@nestjs/common';
import type { User } from '@prisma/client';
import { ApiValidationPipe } from 'src/common/pipes/api-validation.pipe';
import { Roles } from 'src/topics/auth/decorators/roles.decorator';
import { CreateUserInputDto, UpdateUserInputDto } from 'src/topics/user/dto/user.dto';
import { UserRoles } from 'src/topics/user/role.enum';
import { UserService } from 'src/topics/user/user.service';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  @Roles(UserRoles.ADMIN)
  public async getUsers(): Promise<User[]> {
    return this.userService.fetchUsers();
  }

  @Post('')
  @Roles(UserRoles.ADMIN)
  public async createUser(@Body(new ApiValidationPipe()) requestBody: CreateUserInputDto): Promise<User> {
    return this.userService.createUser(requestBody);
  }

  @Get(':id')
  @Roles(UserRoles.ADMIN, UserRoles.EMPLOYEE)
  public async getUserById(@Param('id', ParseIntPipe) id: string): Promise<User> {
    const user = await this.userService.fetchUsersByPk(Number(id));
    if (!user) throw new NotFoundException();
    return user;
  }

  @Put(':id')
  @Roles(UserRoles.ADMIN)
  public async updateUser(@Param('id') id: string, @Body(new ApiValidationPipe()) requestBody: UpdateUserInputDto): Promise<User> {
    const user = await this.userService.fetchUsersByPk(Number(id));
    if (!user) throw new NotFoundException();

    return this.userService.updateUser(Number(id), requestBody);
  }

  @Delete(':id')
  @Roles(UserRoles.ADMIN)
  async deleteUser(@Param('id', ParseIntPipe) id: string, @Request() req: Request): Promise<User> {
    const loggedUser = req['user'];
    const isDeletingSelf = +loggedUser.sub === +id;
    if (isDeletingSelf) throw new BadRequestException('Cant delete self');
    return this.userService.deleteUser(Number(id));
  }
}
