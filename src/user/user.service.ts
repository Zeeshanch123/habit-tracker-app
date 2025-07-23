import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) { }

  async findOrCreateFromSupabase(user_id: string, email: string): Promise<User> {
    let user = await this.userRepo.findOne({ where: { id: user_id } });
    if (!user) {
      user = this.userRepo.create({ id: user_id, email, name: email.split('@')[0] });
      await this.userRepo.save(user);
    }
    return user;
  }
}