import { IsOptional, IsString, IsBoolean, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateHabitDto {
  @ApiProperty({ description: 'Title of the habit', example: 'Morning Run', minLength: 1, maxLength: 100, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @ApiProperty({ description: 'Description of the habit', example: 'Run 5km every morning', minLength: 1, maxLength: 1000, required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Frequency of the habit', example: 'Daily', minLength: 1, maxLength: 100, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  frequency?: string;
} 