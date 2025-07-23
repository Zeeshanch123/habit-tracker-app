import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: 'User name', example: 'John Doe', minLength: 1, maxLength: 100, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiProperty({ description: 'User email', example: 'john@example.com', format: 'email', maxLength: 100, required: false })
  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;

  @ApiProperty({ description: 'User password', example: 'StrongPassword123!', minLength: 8, maxLength: 16, required: false })
  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(16)
  password?: string;
}