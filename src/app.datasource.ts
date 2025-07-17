// src/app.datasource.ts
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

// ───────────────────────────────────────────────
// ビルド後(dist)かソース(ts)かを自動判定
const isProd = process.env.NODE_ENV === 'production';

/**
 * Render など本番は:
 *   NODE_ENV=production （Render が自動で設定）
 *   process.env.DATABASE_URL は Environment タブで設定
 *
 * ローカル開発は:
 *   .env に DATABASE_URL=... を書き、
 *   npm run start:dev などで実行
 */

export const AppDataSource = new DataSource({
  type: 'postgres',

  // URL 方式で接続情報を一括指定
  url: process.env.DATABASE_URL, // ← Render・ローカル共通

  // Render Free/Postgres で必須 (自己署名 CA)
  ssl: { rejectUnauthorized: false },

  // エンティティ / マイグレーションのパスを実行環境で切替
  entities: [isProd ? 'dist/**/*.entity.js' : 'src/**/*.entity.ts'],
  migrations: [isProd ? 'dist/migrations/*.js' : 'src/migrations/*.ts'],

  // synchronize は開発だけ true、本番は必ず false
  synchronize: !isProd,

  // 開発時は SQL を出力、本番は抑制
  logging: !isProd,
});
