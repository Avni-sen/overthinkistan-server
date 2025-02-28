import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  Matches,
  Equals,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: 'Ad', example: 'John' })
  @IsString()
  @IsNotEmpty({ message: 'Ad alanı boş bırakılamaz' })
  @MinLength(2, { message: 'Ad en az 2 karakter olmalıdır' })
  @MaxLength(50, { message: 'Ad en fazla 50 karakter olmalıdır' })
  name: string;

  @ApiProperty({ description: 'Soyad', example: 'Doe' })
  @IsString()
  @IsNotEmpty({ message: 'Soyad alanı boş bırakılamaz' })
  @MinLength(2, { message: 'Soyad en az 2 karakter olmalıdır' })
  @MaxLength(50, { message: 'Soyad en fazla 50 karakter olmalıdır' })
  surname: string;

  @ApiProperty({ description: 'Kullanıcı adı', example: 'johndoe' })
  @IsString()
  @IsNotEmpty({ message: 'Kullanıcı adı boş bırakılamaz' })
  @MinLength(4, { message: 'Kullanıcı adı en az 4 karakter olmalıdır' })
  @MaxLength(20, { message: 'Kullanıcı adı en fazla 20 karakter olmalıdır' })
  username: string;

  @ApiProperty({ description: 'E-posta adresi', example: 'john@example.com' })
  @IsEmail({}, { message: 'Geçerli bir e-posta adresi giriniz' })
  @IsNotEmpty({ message: 'E-posta alanı boş bırakılamaz' })
  email: string;

  @ApiProperty({ description: 'Şifre', example: 'Password123!' })
  @IsString()
  @IsNotEmpty({ message: 'Şifre alanı boş bırakılamaz' })
  @MinLength(8, { message: 'Şifre en az 8 karakter olmalıdır' })
  @MaxLength(32, { message: 'Şifre en fazla 32 karakter olmalıdır' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir',
  })
  password: string;

  @ApiProperty({ description: 'Şifre onayı', example: 'Password123!' })
  @IsString()
  @IsNotEmpty({ message: 'Şifre onayı alanı boş bırakılamaz' })
  confirmPassword: string;

  @ApiProperty({
    description: 'Kullanım şartlarını kabul etme durumu',
    example: true,
  })
  @IsBoolean({
    message: 'Kullanım şartlarını kabul etme durumu boolean olmalıdır',
  })
  @Equals(true, { message: 'Kullanım şartlarını kabul etmelisiniz' })
  termsAndConditions: boolean;
}
