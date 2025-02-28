import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({ summary: 'Yeni kullanıcı kaydı' })
  @ApiResponse({ status: 201, description: 'Kullanıcı başarıyla kaydedildi.' })
  @ApiResponse({ status: 400, description: 'Geçersiz giriş.' })
  @ApiResponse({
    status: 401,
    description: 'Kullanıcı adı veya e-posta zaten kullanımda.',
  })
  signUp(@Body() registerDto: RegisterDto): Promise<{ token: string }> {
    return this.authService.signUp(registerDto);
  }

  @Post('/signin')
  @ApiOperation({ summary: 'Kullanıcı girişi' })
  @ApiResponse({ status: 200, description: 'Kullanıcı başarıyla giriş yaptı.' })
  @ApiResponse({ status: 401, description: 'Geçersiz kimlik bilgileri.' })
  signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ token: string }> {
    return this.authService.signIn(authCredentialsDto);
  }
}
