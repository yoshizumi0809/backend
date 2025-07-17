import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

//TypeORMがデータベースと接続するための「設定オブジェクト」
const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL, // ← これだけで接続情報を渡す
  ssl: { rejectUnauthorized: false }, // Render Free は自己署名 CA
  entities: ['dist/**/*.entity.js'], // build 後のパスに注意
  migrations: ['dist/migrations/*.js'],
  logging: true,
});

console.log('DB_PASS:', process.env.DB_PASS);
export default AppDataSource;
