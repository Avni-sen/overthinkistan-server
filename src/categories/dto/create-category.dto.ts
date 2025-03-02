import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Kategori adı',
    example: 'Komedi',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Kategori açıklaması',
    example: 'Komik içerikler ve hikayeler',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Kategori sırası',
    example: 1,
    required: false,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiProperty({
    description: 'Kategori ikonu (opsiyonel)',
    example: 'fa-laugh',
    required: false,
  })
  @IsOptional()
  @IsString()
  icon?: string;
}
