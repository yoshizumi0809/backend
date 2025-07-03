/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal, MoreThan } from 'typeorm';
import { MicroPost } from '../entities/microposts.entity';
import { User } from '../entities/user.entity'; // ← 追加
import { Auth } from '../entities/auth.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(MicroPost)
    private microPostsRepository: Repository<MicroPost>,
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
    @InjectRepository(User) // ★ 追加
    private readonly userRepository: Repository<User>,
  ) {}

  /* ────────────── 投稿作成 ────────────── */
  async createPost(message: string, token: string) {
    const now = new Date();

    // トークンでAuthを取得
    const auth = await this.authRepository.findOne({
      where: { token: Equal(token), expire_at: MoreThan(now) },
    });
    if (!auth) throw new ForbiddenException();

    // user_idからUserエンティティを取得
    const user = await this.userRepository.findOne({
      where: { user_id: auth.user_id },
      select: ['login_id'], // 必要なプロパティだけ取得
    });
    if (!user) throw new NotFoundException('ユーザーが見つかりません');

    // MicroPostを保存
    await this.microPostsRepository.save({
      user_id: auth.user_id,
      login_id: user.login_id,
      content: message,
    });
  }

  /* ────────────── 投稿削除 ────────────── */
  async deletePost(post_id: number, token: string) {
    const now = new Date();
    const auth = await this.authRepository.findOne({
      where: { token: Equal(token), expire_at: MoreThan(now) },
    });
    if (!auth) throw new ForbiddenException();

    const post = await this.microPostsRepository.findOne({
      where: {
        post_id: Equal(post_id), // ← 主キー名を post_id に
        user_id: Equal(auth.user_id), // ← 自分の投稿か確認
      },
    });
    if (!post) throw new ForbiddenException('この投稿は削除できません');

    await this.microPostsRepository.delete(post.post_id);
  }

  /* ────────────── 投稿リスト取得 (ページング) ────────────── */
  async getList(token: string, start = 0, nr_records = 1) {
    const now = new Date();
    const auth = await this.authRepository.findOne({
      where: { token: Equal(token), expire_at: MoreThan(now) },
    });
    if (!auth) throw new ForbiddenException();

    const qb = this.microPostsRepository
      .createQueryBuilder('micro_post')
      .leftJoinAndSelect(
        'user',
        'user',
        'user.user_id = micro_post.user_id', // ← 外部キーが user_id:number
      )
      .select([
        'micro_post.post_id as post_id', // ← 主キー列を post_id に変更
        'user.user_id as user_id',
        'user.name as user_name',
        'user.login_id as login_id', // ← 文字列の公開ID
        'micro_post.content as content',
        'micro_post.created_at as created_at',
      ])
      .orderBy('micro_post.created_at', 'DESC')
      .offset(start)
      .limit(nr_records);

    type ResultType = {
      id: number;
      content: string;
      user_name: string;
      user_id: string; // login_id を alias として user_id へ
      created_at: Date;
    };

    return qb.getRawMany<ResultType>();
  }

  /* ────────────── 全投稿取得 ────────────── */
  async getAllPosts(token: string) {
    const now = new Date();
    const auth = await this.authRepository.findOne({
      where: { token: Equal(token), expire_at: MoreThan(now) },
    });
    if (!auth) throw new ForbiddenException();

    const qb = this.microPostsRepository
      .createQueryBuilder('micro_post')
      .leftJoinAndSelect(
        'user',
        'user',
        'user.user_id = micro_post.user_id', // ← 同上
      )
      .select([
        'micro_post.post_id as id', // ← 主キー名修正
        'user.name as user_name',
        'micro_post.content as content',
        'micro_post.created_at as created_at',
      ])
      .orderBy('micro_post.created_at', 'DESC'); // 全件取得なので offset/limit 不要

    type ResultType = {
      id: number;
      content: string;
      user_name: string;
      created_at: Date;
    };

    return qb.getRawMany<ResultType>();
  }
}
