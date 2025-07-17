import { Controller, Get, Post, Param, Query, Body, Put } from '@nestjs/common';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(
    @Body('name') name: string,
    @Body('login_id') login_id: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.userService.createUser(name, login_id, email, password);
  }

  @Get(':id')
  async getUser(@Param('id') id: number, @Query('token') token: string) {
    return await this.userService.getUser(token, id);
  }

  // user.controller.ts
  @Get('info/:user_id')
  getUserInfo(@Param('user_id') user_id: number) {
    return this.userService.getUserInfo(user_id);
  }

  @Get('idTologin/:login_id')
  getUserIdByLoginId(@Param('login_id') login_id: string) {
    return this.userService.getUserIdByLoginId(login_id);
  }

  @Put(':user_id')
  async editUser(
    @Param('user_id') user_id: number,
    @Body() body: { login_id?: string; name?: string; icon_url?: string },
  ) {
    return await this.userService.editUser(user_id, body);
  }
}
