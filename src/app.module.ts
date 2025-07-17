// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    // .env を読むのは開発時だけ。本番(Render)では
    // Environment タブの変数がそのまま注入されます
    ConfigModule.forRoot(),

    /** ────────────★ ここを修正 ★──────────── */
    TypeOrmModule.forRoot({
      type: 'postgres',
      // DATABASE_URL を 1 行で渡す
      url: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }, // Render Free/Postgres で必須

      // 自動で Entity を読み込む
      autoLoadEntities: true,

      // 本番は false。ローカル開発は .env で NODE_ENV=development なら
      // synchronize: true にしても良い
      synchronize: false,
    }),
    /** ───────────────────────────────────── */

    UserModule,
    PostModule,
    AuthModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
