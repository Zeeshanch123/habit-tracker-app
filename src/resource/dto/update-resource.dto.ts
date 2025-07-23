import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateResourceDto {
  @ApiProperty({ description: 'Type of resource', example: 'video', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  type?: string;

  @ApiProperty({ description: 'Resource URL', example: 'https://example.com/resource.mp4', required: false })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiProperty({ description: 'Title of the resource', example: 'Motivational Video', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;
}