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

  async createUser(name: string, email: string, password: string) {
    const now = new Date();
    const isExistName = await this.userRepository.findOne({
      where: {
        name: Equal(name),
      },
    });
    if (isExistName) {
      throw new HttpException(
        'ユーザー名は既に使われています',
        HttpStatus.BAD_REQUEST,
      );
    }
    const isExistEmail = await this.userRepository.findOne({
      where: {
        email: Equal(email),
      },
    });
    if (isExistEmail) {
      throw new HttpException(
        'メールアドレスは既に使われています',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hash = createHash('md5').update(password).digest('hex');
    const record = {
      name: name,
      email: email,
      hash: hash,
      created_at: now,
    };
    await this.userRepository.save(record);
    return { message: '登録完了', user_id: record.name };
  }
}
