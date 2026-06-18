import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Role } from './Role';

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
}
