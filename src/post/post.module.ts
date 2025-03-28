import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { MicroPost } from '../entities/microposts.entity';
//import { AuthModule } from 'src/auth/auth.module';
import { Auth } from '../entities/auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MicroPost, Auth])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
