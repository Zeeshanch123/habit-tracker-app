import { IsOptional, IsString, IsNumber, Min, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePaymentDto {
  @ApiProperty({ description: 'Payment status', example: 'paid', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  status?: string;

  @ApiProperty({ description: 'Paid at timestamp (optional)', example: '2024-06-01T12:00:00Z', required: false })
  @IsOptional()
  @IsString()
  paidAt?: string;
} 