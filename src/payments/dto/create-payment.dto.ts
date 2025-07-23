import { IsNotEmpty, IsUUID, IsString, IsNumber, Min, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({ description: 'Plan ID', example: 'uuid', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  plan_id: string;

  @ApiProperty({ description: 'Stripe session ID', example: 'cs_test_123', minLength: 1, maxLength: 255 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  stripe_session_id: string;

  @ApiProperty({ description: 'Payment amount', example: 19.99, minimum: 0.01 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ description: 'Payment status', example: 'pending', required: false, default: 'pending' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  status?: string;

  @ApiProperty({ description: 'Paid at timestamp (optional)', example: '2024-06-01T12:00:00Z', required: false })
  @IsOptional()
  @IsString()
  paid_at?: string;
} 