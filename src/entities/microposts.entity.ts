import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class MicroPost {
  @PrimaryGeneratedColumn()
  readonly post_id: number;

  @Column()
  user_id: number;

  @Column()
  login_id: string;

  @Column()
  content: string;

  @CreateDateColumn()
  readonly created_at?: Date;

  @UpdateDateColumn()
  readonly updated_at?: Date;
}
