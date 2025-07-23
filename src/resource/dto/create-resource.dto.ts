import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateResourceDto {
  @ApiProperty({ description: 'Habit ID', example: 'uuid', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  habit_id: string;

  @ApiProperty({ description: 'Type of resource', example: 'video', minLength: 1, maxLength: 100 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  type: string;

  @ApiProperty({ description: 'Resource URL', example: 'https://example.com/resource.mp4' })
  @IsNotEmpty()
  @IsString()
  url: string;

  @ApiProperty({ description: 'Title of the resource', example: 'Motivational Video', minLength: 1, maxLength: 100 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  title: string;
}