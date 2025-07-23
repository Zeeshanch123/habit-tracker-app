import { IsNotEmpty, IsString, IsUUID, IsBoolean, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHabitDto {
  @ApiProperty({ description: 'Title of the habit', example: 'Morning Run', minLength: 1, maxLength: 100 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  title: string;

  @ApiProperty({ description: 'Description of the habit', example: 'Run 5km every morning', minLength: 1, maxLength: 1000 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  description: string;

  @ApiProperty({ description: 'Frequency of the habit', example: 'Daily', minLength: 1, maxLength: 100 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  frequency: string;
} 