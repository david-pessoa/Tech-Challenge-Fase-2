import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { User } from './User';
import { PostView } from './PostView';

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

  @ManyToOne(() => User, user => user.posts, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_id' })
  user!: User | null;

  @OneToMany(() => PostView, postView => postView.post)
  visualizacoes!: PostView[];
}
