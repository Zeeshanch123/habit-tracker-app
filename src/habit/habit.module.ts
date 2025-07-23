import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Habit } from './entity/habit.entity';
import { User } from '../user/entity/user.entity';
import { HabitService } from './habit.service';
import { HabitController } from './habit.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Habit, User])],
  controllers: [HabitController],
  providers: [HabitService],
  exports: [HabitService],
})
export class HabitModule {}
