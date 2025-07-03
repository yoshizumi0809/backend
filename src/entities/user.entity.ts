import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number; // ← 自動連番（主キー）

  @Column('varchar', { unique: true, name: 'login_id' })
  login_id: string; // ← 公開ID（@happycat123 など）

  @Column('varchar')
  name: string; // ← 表示名（重複可・変更可）

  @Column('varchar')
  hash: string;

  @Column('varchar')
  email: string;

  @Column('varchar')
  icon_url: string; //画像のurl

  @CreateDateColumn()
  readonly created_at?: Date;

  @UpdateDateColumn()
  readonly updated_at?: Date;
}
