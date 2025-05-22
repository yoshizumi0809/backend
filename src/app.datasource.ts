import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

//TypeORMがデータベースと接続するための「設定オブジェクト」
const AppDataSource = new DataSource({
  type: 'mysql', // データベースの種別を MySQL に変更
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '3306'), // MySQLのポート番号。デフォルトは3306
  ssl: {
    rejectUnauthorized: false, //← 自己署名 CA なので検証 OFF
  },
  extra: {
    //← mysql2 ドライバ用
    ssl: { rejectUnauthorized: false },
  },
  entities: ['src/entities/*.ts'], // エンティティファイルのパス
  migrations: ['src/migrations/*.ts'], // マイグレーションファイルのパス
  charset: 'utf8mb4', // MySQLの文字コード設定（任意）
  logging: true, // ログを有効にする（任意）
});

console.log('DB_PASS:', process.env.DB_PASS);
export default AppDataSource;
