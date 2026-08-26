import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Role } from './Role';
import { Post } from './Post';
import { Comment } from './Comment';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  matricula!: string;

  @Column()
  nome!: string;

  @Column({ type: 'date', name: 'birth_date', nullable: true })
  birthDate!: Date | null;

  @Column()
  senha!: string;

  @Column({ type: 'bytea', name: 'image', nullable: true })
  image!: Buffer | null;

  @ManyToOne(() => Role, role => role.users, { nullable: false })
  @JoinColumn({ name: 'role_id' })
  role!: Role;

  @OneToMany(() => Post, post => post.user)
  posts!: Post[];

  @OneToMany(() => Comment, comment => comment.user)
  comments!: Comment[];
}
