import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { File } from 'buffer';

export class CreateResourceDto {
  @ApiProperty({ description: 'Habit ID', example: 'uuid', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  habit_id: string;

  // @ApiProperty({ description: 'Type of resource', example: 'image', minLength: 1, maxLength: 100 })
  // @IsNotEmpty()
  // @IsString()
  // @MaxLength(100)
  // type: string;

  // @ApiProperty({
  //   description: 'Uploaded file',
  //   type: 'string',
  //   format: 'binary',
  //   required: false,
  // })
  // @IsOptional()
  // media: File;

  @ApiProperty({
    description: 'Uploaded files',
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: false,
  })
  @IsOptional()
  media: Express.Multer.File[];


  @ApiProperty({ description: 'Title of the resource', example: 'Motivational Video', minLength: 1, maxLength: 100 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  title: string;
}