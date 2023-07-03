import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import type { User } from '@prisma/client';
import { CreateUserInputDto, UpdateUserInputDto } from 'src/topics/user/dto/user.dto';
import { UserService } from 'src/topics/user/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  public async getUsers(): Promise<User[]> {
    return this.userService.fetchUsers();
  }

  @Post('')
  public async createUser(@Body() requestBody: CreateUserInputDto): Promise<User> {
    // Validate first
    // Validate roles
    return this.userService.createUser(requestBody);
  }

  @Get(':id')
  public async getUserById(@Param('id') id: string): Promise<User> {
    return this.userService.fetchUsersByPk(Number(id));
  }

  @Put(':id')
  public async updateUser(@Param('id') id: string, @Body() requestBody: UpdateUserInputDto): Promise<User> {
    // Validate requestBody
    // Validate roles
    return this.userService.updateUser(Number(id), requestBody);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<User> {
    // Validate rights
    return this.userService.deleteUser(Number(id));
  }
}
