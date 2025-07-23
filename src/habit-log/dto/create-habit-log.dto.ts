import { IsNotEmpty, IsString, IsUUID, IsDateString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHabitLogDto {
  @ApiProperty({ description: 'Habit ID', example: 'uuid', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  habit_id: string;

  @ApiProperty({ description: 'Date completed (YYYY-MM-DD)', example: '2024-06-01', format: 'date' })
  @IsNotEmpty()
  @IsDateString()
  completed_on: string;

  @ApiProperty({ description: 'Notes about completion', example: 'Felt great today!', minLength: 1 })
  @IsNotEmpty()
  @IsString()
  notes: string;
} 