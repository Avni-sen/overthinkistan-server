import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({
    description: 'Kategori adı',
    example: 'Komedi',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

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
