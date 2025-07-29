import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  private supabase: SupabaseClient;

  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private userService: UserService,
  ) {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );
  }

  async signUp(dto: CreateUserDto) {
    const existing = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new BadRequestException('User with this email already exists in local database');
    }
    // 1. Create user in Supabase Auth
    const { data, error } = await this.supabase.auth.signUp({
      email: dto.email,
      password: dto.password,
      options: { data: { name: dto.name } }
    });
    if (error) throw new BadRequestException(error.message);
    const supabaseUser = data.user;
    if (!supabaseUser) throw new BadRequestException('Supabase user not returned');

    // 2. Create user in local DB with Supabase Auth user ID
    const user = this.userRepo.create({
      id: supabaseUser.id,
      name: dto.name,
      email: dto.email,
    });
    await this.userRepo.save(user);
    return { message: 'User registered successfully', user };
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new BadRequestException(error.message);

    // Get user info from Supabase
    const supabaseUser = data.user;
    if (!supabaseUser) throw new BadRequestException('Supabase user not returned');
    if (!supabaseUser.email) throw new BadRequestException('Supabase user email not returned');

    // Ensure user exists in local DB
    const user = await this.userService.findOrCreateFromSupabase(supabaseUser.id, supabaseUser.email);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      token: data.session?.access_token,
    };
  }
}