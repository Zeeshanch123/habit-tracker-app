import { IsNotEmpty, IsString, IsNumber, Min, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlanDto {
  @ApiProperty({ description: 'Plan name', example: 'Premium', minLength: 1, maxLength: 100 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: 'Plan price', example: 19.99, minimum: 0.01 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  price: number;

  @ApiProperty({ description: 'Plan description', example: 'Access to all features', minLength: 1 })
  @IsNotEmpty()
  @IsString()
  description: string;
}