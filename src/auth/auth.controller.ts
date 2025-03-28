import { Controller, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth') // http://サーバーアドレス/auth へのリクエスト処理
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get() //GETリクエストに対する処理
  async getAuth(
    @Query('user_id') name: string, //user_idのクエリパラメータをname変数に代入
    @Query('password') password: string, //passwordのクエリパラメータの値をpassword変数に代入
  ) {
    return await this.authService.getAuth(name, password);
  }
}
