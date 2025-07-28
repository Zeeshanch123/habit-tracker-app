import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HabitLog } from './entity/habit-log.entity';
import { CreateHabitLogDto } from './dto/create-habit-log.dto';
import { UpdateHabitLogDto } from './dto/update-habit-log.dto';
import { User } from '../user/entity/user.entity';
import { Habit } from '../habit/entity/habit.entity';
import { NormalResponse } from '../common/normal-response';

@Injectable()
export class HabitLogService {
    constructor(
        @InjectRepository(HabitLog)
        private habitLogRepo: Repository<HabitLog>,
        @InjectRepository(User)
        private userRepo: Repository<User>,
        @InjectRepository(Habit)
        private habitRepo: Repository<Habit>,
    ) { }

    async create(dto: CreateHabitLogDto, userId: string): Promise<NormalResponse<HabitLog>> {
        try {
            // Ensure user exists
            const user = await this.userRepo.findOne({ where: { id: userId } });
            if (!user) throw new BadRequestException('User not found');

            // Ensure habit exists and belongs to this user
            const habit = await this.habitRepo.findOne({ where: { id: dto.habit_id, user: { id: userId } } });
            if (!habit) throw new BadRequestException('Habit not found or not owned by user');

            const habitLog = this.habitLogRepo.create({
                completed_on: dto.completed_on,
                notes: dto.notes,
                user,
                habit,
            });

            const saved = await this.habitLogRepo.save(habitLog);
            return new NormalResponse(saved, 'Habit log created successfully');
        } catch (err) {
            throw new BadRequestException(err.message);
        }
    }

    async findAll(userId: string): Promise<NormalResponse<HabitLog[]>> {
        try {
            const logs = await this.habitLogRepo.find({
                where: { user: { id: userId } },
                relations: ['habit'],
                order: { completed_on: 'DESC' },
            });
            return new NormalResponse(logs, 'Habit logs fetched successfully');
        } catch (err) {
            throw new BadRequestException(err.message);
        }
    }

    async findOne(id: string, userId: string): Promise<NormalResponse<HabitLog>> {
        try {
            const log = await this.habitLogRepo.findOne({
                where: { id, user: { id: userId } },
                relations: ['habit'],
            });
            if (!log) throw new NotFoundException('Habit log not found');
            return new NormalResponse(log, 'Habit log fetched successfully');
        } catch (err) {
            throw new BadRequestException(err.message);
        }
    }

    async update(id: string, userId: string, dto: UpdateHabitLogDto): Promise<NormalResponse<HabitLog | null>> {
        try {
            const habitLog = await this.habitLogRepo.findOne({ where: { id, user: { id: userId } } });
            if (!habitLog) throw new NotFoundException('Habit log not found');

            if (dto.completed_on !== undefined) habitLog.completed_on = dto.completed_on;
            if (dto.notes !== undefined) habitLog.notes = dto.notes;

            const saved = await this.habitLogRepo.save(habitLog);
            return new NormalResponse(saved, 'Habit log updated successfully');
        } catch (err) {
            throw new BadRequestException(err.message);
        }
    }

    async remove(id: string, userId: string): Promise<NormalResponse<null>> {
        try {
            const habitLog = await this.habitLogRepo.findOne({ where: { id, user: { id: userId } } });
            if (!habitLog) throw new NotFoundException('Habit log not found');

            await this.habitLogRepo.remove(habitLog);
            return new NormalResponse(null, 'Habit log deleted successfully');
        } catch (err) {
            throw new BadRequestException(err.message);
        }
    }
}