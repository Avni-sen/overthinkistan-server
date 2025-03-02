import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class UpdatePostPhotoDto {
  @ApiProperty({
    description: 'Post fotoğrafı URL',
    example: 'https://example.com/uploads/posts/post123.jpg',
  })
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  postPhoto: string;
}
