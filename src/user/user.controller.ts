import { Controller, Get, Post, Param, Query, Body, Put } from '@nestjs/common';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(
    @Body('name') name: string,
    @Body('user_id') user_id: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.userService.createUser(name, user_id, email, password);
  }

  @Get(':id')
  async getUser(@Param('id') id: number, @Query('token') token: string) {
    return await this.userService.getUser(token, id);
  }

  // user.controller.ts
  @Get('info/:id')
  getUserInfo(@Param('id') id: number) {
    return this.userService.getUserInfo(id);
  }

  @Put(':id')
  async editUser(
    @Param('id') id: number,
    @Body() body: { user_id?: string; name?: string },
  ) {
    return await this.userService.editUser(id, body);
  }
}
