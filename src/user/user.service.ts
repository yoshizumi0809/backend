import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { createHash, randomUUID } from 'crypto';
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

  async getUser(token: string, user_id: number) {
    const now = new Date();
    const auth = await this.authRepository.findOne({
      where: { token: Equal(token), expire_at: MoreThan(now) },
    });
    if (!auth) throw new ForbiddenException();

    const user = await this.userRepository.findOne({
      where: { user_id: Equal(user_id) },
    });
    if (!user) throw new NotFoundException();
    return user;
  }

  async getUserInfo(user_id: number) {
    const user = await this.userRepository.findOne({
      where: { user_id },
      select: ['user_id', 'login_id', 'name', 'email', 'icon_url'], // ← select 名称変更
    });
    if (!user)
      throw new NotFoundException(`ユーザーID ${user_id} が見つかりません`);
    return user;
  }

  async getUserIdByLoginId(login_id: string): Promise<number> {
    const user = await this.userRepository.findOne({
      where: { login_id },
      select: ['user_id'],
    });
    if (!user) throw new NotFoundException();
    return user.user_id;
  }

  async createUser(
    name: string, // 表示名
    login_id: string, // 公開ID (@happycat123 等)
    email: string,
    password: string,
  ) {
    if (await this.userRepository.findOne({ where: { login_id } })) {
      throw new HttpException(
        'ログインIDは既に使われています',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (await this.userRepository.findOne({ where: { email } })) {
      throw new HttpException(
        'メールアドレスは既に使われています',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hash = createHash('md5').update(password).digest('hex');
    const InitialIconUrl =
      'https://res.cloudinary.com/dqyq4u6ct/image/upload/v1749706764/initial_icon_yl0ikg.webp';
    const user = this.userRepository.create({
      login_id,
      name,
      email,
      hash,
      icon_url: InitialIconUrl,
      created_at: new Date(),
    });
    await this.userRepository.save(user);

    const token = randomUUID();
    await this.authRepository.save({
      user_id: user.user_id,
      token,
      expire_at: (() => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return d;
      })(),
    });

    return {
      user_id: user.user_id,
      token,
      message: '登録完了',
    };
  }

  async editUser(
    user_id: number,
    updates: { login_id?: string; name?: string; icon_url?: string },
  ) {
    const user = await this.userRepository.findOneBy({ user_id });
    if (!user) throw new NotFoundException('User not found');

    if (updates.login_id !== undefined) user.login_id = updates.login_id;
    if (updates.name !== undefined) user.name = updates.name;
    if (updates.icon_url !== undefined) user.icon_url = updates.icon_url;

    await this.userRepository.save(user);
    return user;
  }
}
