import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Auth } from 'src/entities/auth.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Auth, User])], //authモジュールに使用するテールブルのエンティティを登録
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
