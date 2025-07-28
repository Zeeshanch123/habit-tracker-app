import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { File } from 'buffer';

export class UpdateResourceDto {

  // @ApiProperty({ description: 'Type of resource', example: 'video', required: false })
  // @IsOptional()
  // @IsString()
  // @MaxLength(100)
  // type?: string;


  // @ApiProperty({
  //   description: 'Uploaded file',
  //   type: 'string',
  //   format: 'binary',
  //   required: false,
  // })
  // @IsOptional()
  // media?: File;


  @ApiProperty({
    description: 'Uploaded files',
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: false,
  })
  @IsOptional()
  media?: Express.Multer.File[];

  @ApiProperty({ description: 'Title of the resource', example: 'Motivational Video', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;
}