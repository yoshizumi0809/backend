import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { createHash } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal, MoreThan } from 'typeorm';
import { User } from '../entities/user.entity';
import { Auth } from '../entities/auth.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
  ) {}

  async getUser(token: string, id: number) {
    // ログイン済みかチェック
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

    const user = await this.userRepository.findOne({
      where: {
        id: Equal(id),
      },
    });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  // user.service.ts
  async getUserInfo(id: number) {
    const user = await this.userRepository.findOne({
      where: { id: id },
      select: ['id', 'name', 'user_id'], // ← 公開してよい情報だけ
    });

    if (!user) {
      throw new NotFoundException(`ユーザーID ${id} が見つかりません`);
    }

    return user;
  }

  async createUser(
    name: string, // ← 表示名
    user_id: string, // ← 公開 ID (@happycat123 など)
    email: string,
    password: string,
  ) {
    // ── 1. 重複チェック ─────────────────────
    const dupId = await this.userRepository.findOne({
      where: { user_id: Equal(user_id) },
    });
    if (dupId) {
      throw new HttpException(
        'ユーザーIDは既に使われています',
        HttpStatus.BAD_REQUEST,
      );
    }

    const dupEmail = await this.userRepository.findOne({
      where: { email: Equal(email) },
    });
    if (dupEmail) {
      throw new HttpException(
        'メールアドレスは既に使われています',
        HttpStatus.BAD_REQUEST,
      );
    }

    // ── 2. ユーザーレコードを作成 ─────────────
    const hash = createHash('md5').update(password).digest('hex');
    const user = this.userRepository.create({
      user_id,
      name,
      email,
      hash,
      created_at: new Date(),
    });
    await this.userRepository.save(user);

    // ── 3. トークン発行 & 保存 ────────────────
    const token = crypto.randomUUID();
    await this.authRepository.save({
      user_id: user.id, // Auth エンティティの外部キー
      token,
      expire_at: (() => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return d;
      })(),
    });

    // ── 4. フロントへ返す ────────────────────
    return {
      id: user.id,
      token,
      message: '登録完了',
    };
  }

  async editUser(id: number, updates: { user_id?: string; name?: string }) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    if (updates.user_id !== undefined) user.user_id = updates.user_id;
    if (updates.name !== undefined) user.name = updates.name;
    await this.userRepository.save(user);
    return user;
  }
}
