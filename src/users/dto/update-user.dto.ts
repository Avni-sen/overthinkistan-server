import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Gender } from '../../common/enums/gender.enum';

export class UpdateUserDto {
  @ApiProperty({ description: 'Ad', example: 'John', required: false })
  @IsString()
  @IsOptional()
  @MinLength(2, { message: 'Ad en az 2 karakter olmalıdır' })
  @MaxLength(50, { message: 'Ad en fazla 50 karakter olmalıdır' })
  name?: string;

  @ApiProperty({ description: 'Soyad', example: 'Doe', required: false })
  @IsString()
  @IsOptional()
  @MinLength(2, { message: 'Soyad en az 2 karakter olmalıdır' })
  @MaxLength(50, { message: 'Soyad en fazla 50 karakter olmalıdır' })
  surname?: string;

  @ApiProperty({
    description: 'E-posta adresi',
    example: 'john@example.com',
    required: false,
  })
  @IsEmail({}, { message: 'Geçerli bir e-posta adresi giriniz' })
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Profil fotoğrafı URL',
    example: 'https://example.com/profile.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  profilePhoto?: string;

  @ApiProperty({
    description: 'Biyografi',
    example: 'Yazılım geliştirici ve fotoğrafçı',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'Biyografi en fazla 500 karakter olmalıdır' })
  biography?: string;

  @ApiProperty({
    description: 'Cinsiyet',
    enum: Gender,
    example: Gender.PREFER_NOT_TO_SAY,
    required: false,
  })
  @IsEnum(Gender, { message: 'Geçerli bir cinsiyet değeri giriniz' })
  @IsOptional()
  gender?: Gender;
}
