import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  titulo!: string;

  @Column()
  descricao!: string;

  @Column('text')
  conteudo!: string;

  @CreateDateColumn({ name: 'data_criacao' })
  dataCriacao!: Date;

  @UpdateDateColumn({ name: 'data_modificacao' })
  dataModificacao!: Date;

  @ManyToOne(() => User, user => user.posts, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
