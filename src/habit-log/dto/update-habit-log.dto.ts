import { IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateHabitLogDto {
  @ApiProperty({ description: 'Date completed (YYYY-MM-DD)', example: '2024-06-01', format: 'date', required: false })
  @IsOptional()
  @IsDateString()
  completed_on?: string;

  @ApiProperty({ description: 'Notes about completion', example: 'Felt great today!', minLength: 1, required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}