/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from 'src/entities/auth.entity';
import { User } from 'src/entities/user.entity';
import { Equal, Repository } from 'typeorm';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>, //Repository<User>はUserテーブルを扱いやすくした型
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
  ) {}

  async getAuth(login_id: string, password: string) {
    // パスワードが未入力なら即エラー（セキュリティ対策）
    if (!password) {
      throw new UnauthorizedException();
    }
    //受け取ったパスワードをハッシュ化
    const hash = crypto.createHash('md5').update(password).digest('hex');
    //ユーザーのデータベースからnameとhashが一致するレコードを検索し、userに(そのレコードを)代入
    const user = await this.userRepository.findOne({
      where: {
        login_id: Equal(login_id),
        hash: Equal(hash),
      },
    });
    //見つからなければエラーを返す
    if (!user) {
      throw new UnauthorizedException();
    }
    //トークンの返却用変数を準備
    const ret = { token: '', user_id: user.user_id };
    // トークンの有効期限設定
    const expire = new Date(); //現在時刻
    expire.setDate(expire.getDate() + 1); //現在時刻から1日後
    //ログインしようとしているユーザーのトークンが存在するか確認に、そのトークンをauthに代入
    const auth = await this.authRepository.findOne({
      where: { user_id: Equal(user.user_id) },
    });

    if (auth) {
      auth.expire_at = expire; //authの有効期限を設定(延長)
      await this.authRepository.save(auth);
      ret.token = auth.token;
    } else {
      //初ログイン（or以前のtokenが何らかの理由で消えた場合）
      const token = crypto.randomUUID();
      const record = {
        user_id: user.user_id,
        token: token,
        expire_at: expire.toISOString(),
      };
      await this.authRepository.save(record);
      ret.token = token;
    }

    return ret;
  }
}
