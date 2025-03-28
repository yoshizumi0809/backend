import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
//import { Auth } from 'src/entities/auth.entity';
import { User } from 'src/entities/user.entity';
import { Auth } from 'src/entities/auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Auth])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
