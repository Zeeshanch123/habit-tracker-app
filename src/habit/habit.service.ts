import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Habit } from './entity/habit.entity';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { NormalResponse } from '../common/normal-response';
import { User } from '../user/entity/user.entity';

@Injectable()
export class HabitService {
  constructor(
    @InjectRepository(Habit)
    private habitRepo: Repository<Habit>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) { }

  async create(dto: CreateHabitDto, userId: string): Promise<NormalResponse<Habit>> {
    try {
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) throw new BadRequestException('User not found');
      const habit = this.habitRepo.create({ ...dto, user });
      const saved = await this.habitRepo.save(habit);
      return new NormalResponse(saved, 'Habit created successfully');
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async findAll(userId: string): Promise<NormalResponse<Habit[]>> {
    try {
      const habits = await this.habitRepo.find({ where: { user: { id: userId } }, relations: ['user'] });
      return new NormalResponse(habits, 'Fetched habits successfully');
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async findOne(id: string, userId: string): Promise<NormalResponse<Habit>> {
    try {
      const habit = await this.habitRepo.findOne({ where: { id, user: { id: userId } }, relations: ['user'] });
      if (!habit) throw new NotFoundException('Habit not found');
      return new NormalResponse(habit, 'Fetched habit successfully');
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async update(id: string, userId: string, dto: UpdateHabitDto): Promise<NormalResponse<Habit | null>> {
    try {
      const updateResult = await this.habitRepo.update({ id, user: { id: userId } }, dto);
      if (updateResult.affected === 0) {
        throw new NotFoundException('Habit not found');
      }
      const habit = await this.habitRepo.findOne({ where: { id, user: { id: userId } }, relations: ['user'] });
      return new NormalResponse(habit, 'Habit updated successfully');
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async remove(id: string, userId: string): Promise<NormalResponse<null>> {
    try {
      const habit = await this.habitRepo.findOne({ where: { id, user: { id: userId } } });
      if (!habit) throw new NotFoundException('Habit not found');
      await this.habitRepo.remove(habit);
      return new NormalResponse(null, 'Habit removed successfully');
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
