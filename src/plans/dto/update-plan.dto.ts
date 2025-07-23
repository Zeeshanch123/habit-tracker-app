import { IsOptional, IsString, IsNumber, Min, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePlanDto {
  @ApiProperty({ description: 'Plan name', example: 'Premium', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiProperty({ description: 'Plan price', example: 19.99, minimum: 0.01, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  price?: number;

  @ApiProperty({ description: 'Plan description', example: 'Access to all features', required: false })
  @IsOptional()
  @IsString()
  description?: string;
} 