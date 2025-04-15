import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal, MoreThan } from 'typeorm';
import { MicroPost } from '../entities/microposts.entity';
import { Auth } from '../entities/auth.entity';

@Injectable() //このクラスがDIコンテナに登録される。
export class PostService {
  constructor(
    //MicroPostレポジトリを今から使いますよという宣言(注入)
    @InjectRepository(MicroPost)
    private microPostsRepository: Repository<MicroPost>,
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
  ) {}

  async createPost(message: string, token: string) {
    //現在の日時を取得
    const now = new Date();
    //条件に一致する1件のレコードを取得(tokenのおかげで一意に定まる)
    const auth = await this.authRepository.findOne({
      where: {
        //tokenはログイン時にユーザーが保持する文字列
        //expire_atは、ログイン状態の有効期限
        token: Equal(token),
        expire_at: MoreThan(now),
      },
    });
    if (!auth) {
      throw new ForbiddenException();
    }

    const record = {
      user_id: auth.user_id,
      content: message,
    };
    await this.microPostsRepository.save(record);
  }
  //ポストを削除する関数
  async deletePost(postId: number, token: string) {
    //現在の日時を取得
    const now = new Date();
    //条件に一致する1件の「auth」レコードを取得(tokenのおかげで一意に定まる)
    const auth = await this.authRepository.findOne({
      where: {
        //tokenはログイン時にユーザーが保持する文字列
        //expire_atは、ログイン状態の有効期限
        token: Equal(token),
        expire_at: MoreThan(now),
      },
    });
    if (!auth) {
      throw new ForbiddenException();
    }

    const post = await this.microPostsRepository.findOne({
      where: {
        id: Equal(postId),
        user_id: Equal(auth.user_id), // ← 他人の投稿を消せないようにチェック
      },
    });

    if (!post) {
      throw new ForbiddenException('この投稿は削除できません');
    }
    //post.idとidが一致するポストを削除する
    await this.microPostsRepository.delete(post.id);
  }

  //nr_recordsは表示できるレコード数
  async getList(token: string, start: number = 0, nr_records: number = 1) {
    const now = new Date();
    const auth = await this.authRepository.findOne({
      where: {
        token: Equal(token),
        expire_at: MoreThan(now),
      },
    });
    if (!auth) {
      throw new ForbiddenException();
    }
    const qb = this.microPostsRepository
      .createQueryBuilder('micro_post')
      .leftJoinAndSelect('user', 'user', 'user.id = micro_post.user_id')
      .select([
        'micro_post.id as id',
        'user.name as user_name',
        'micro_post.content as content',
        'micro_post.created_at as created_at',
      ])
      .orderBy('micro_post.created_at', 'DESC') //投稿日時の新しい順に並べる
      .offset(start) //何件目から取得するか
      .limit(nr_records); //最大何件取得するか
    type ResultType = {
      id: number;
      content: string;
      user_name: string;
      created_at: Date;
    };
    const records = await qb.getRawMany<ResultType>();
    console.log(records);
    return records;
  }
}
