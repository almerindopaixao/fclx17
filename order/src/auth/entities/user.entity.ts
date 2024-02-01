import { createHash } from 'crypto';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type CreateUserCommand = {
  username: string;
  password: string;
};

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  static create(input: CreateUserCommand) {
    const user = new User();
    user.username = input.username;
    user.password = createHash('md5').update(input.password).digest('hex');

    return user;
  }

  static verify(password: string, passwordHash: string) {
    return passwordHash === createHash('md5').update(password).digest('hex');
  }
}
