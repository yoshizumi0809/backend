import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { MicroPost } from '../entities/microposts.entity';
//import { AuthModule } from 'src/auth/auth.module';
import { Auth } from '../entities/auth.entity';
import { User } from 'src/entities/user.entity';

@Module({
  /* 
  ・TypeOrmModule.forFeature() は、指定したエンティティのRepositoryをDIコンテナに登録 
  →もっと厳密にいえば、@InjectRepository(MicroPost)など、@InjectRepository()
  を使用できるようにする役割。
  ・Repositoryとは？
  →DBのレコード追加、検索など、レコード操作を簡単なコードでできるデータ型
  */
  imports: [TypeOrmModule.forFeature([MicroPost, Auth, User])],
  controllers: [PostController],
  providers: [PostService], //providersに登録されたクラスはNestJSが自動的にインスタンス化
})
export class PostModule {}
