import { Module } from '@nestjs/common';
import { ResourceController } from './resource.controller';
import { ResourceService } from './resource.service';
import { Resource } from './entity/resource.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Habit } from 'src/habit/entity/habit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Resource, Habit])],
  providers: [ResourceService],
  controllers: [ResourceController],
  exports: [ResourceService],
})
export class ResourceModule { }
