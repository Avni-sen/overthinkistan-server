import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty({
    description: 'Post içeriği',
    example: 'Güncellenmiş post içeriği...',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({
    description: 'Post kategorileri (refId)',
    example: [
      'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      'b2c3d4e5-f6a7-8901-bcde-f23456789012',
    ],
  })
  @IsArray()
  @IsOptional()
  categoryRefIds?: string[];

  @ApiProperty({
    description: 'Anonim paylaşım durumu',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isAnonymous?: boolean;

  @ApiProperty({
    description: 'Post fotoğrafı URL',
    example: 'https://example.com/photos/post123.jpg',
  })
  @IsString()
  @IsOptional()
  photoUrl?: string;
}
