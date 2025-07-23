import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HabitLog } from './entity/habit-log.entity';
import { User } from '../user/entity/user.entity';
import { Habit } from '../habit/entity/habit.entity';
import { HabitLogService } from './habit-log.service';
import { HabitLogController } from './habit-log.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HabitLog, User, Habit])],
  providers: [HabitLogService],
  controllers: [HabitLogController],
  exports: [HabitLogService],
})
export class HabitLogModule { }
