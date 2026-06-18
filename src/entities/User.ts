import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Role } from './Role';
import { Post } from './Post';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  matricula!: string;

  @Column()
  nome!: string;

  @Column()
  senha!: string;

  @ManyToOne(() => Role, role => role.users, { nullable: false })
  @JoinColumn({ name: 'role_id' })
  role!: Role;

  @OneToMany(() => Post, post => post.user)
  posts!: Post[];
}
