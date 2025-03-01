import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class UpdateProfilePhotoDto {
  @ApiProperty({
    description: 'Profil fotoğrafı URL',
    example: 'https://example.com/uploads/profile.jpg',
  })
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  profilePhoto: string;
}
