import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../users/schemas/user.schema';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { DataStatus } from '../common/enums/data-status.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signUp(registerDto: RegisterDto): Promise<{ token: string }> {
    const {
      name,
      surname,
      username,
      email,
      password,
      confirmPassword,
      termsAndConditions,
    } = registerDto;

    // Şifre doğrulama kontrolü
    if (password !== confirmPassword) {
      throw new BadRequestException('Şifreler eşleşmiyor');
    }

    // Kullanım şartlarını kabul etme kontrolü
    if (!termsAndConditions) {
      throw new BadRequestException('Kullanım şartlarını kabul etmelisiniz');
    }

    // Şifreyi hash'le
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new this.userModel({
      name,
      surname,
      username,
      email,
      password: hashedPassword,
      termsAndConditions,
      dataStatus: DataStatus.ACTIVE,
    });

    try {
      await user.save();
      const token = this.generateToken(user);
      return { token };
    } catch (error) {
      if (error.code === 11000) {
        throw new UnauthorizedException(
          'Kullanıcı adı veya e-posta zaten kullanımda',
        );
      }
      throw error;
    }
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ token: string }> {
    const { email, password } = authCredentialsDto;
    const user = await this.userModel.findOne({
      email,
      dataStatus: DataStatus.ACTIVE,
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = this.generateToken(user);
      return { token };
    } else {
      throw new UnauthorizedException(
        'Lütfen geçerli kimlik bilgilerini kontrol edin',
      );
    }
  }

  private generateToken(user: User): string {
    const payload: JwtPayload = {
      username: user.username,
      sub: user['_id'],
      role: user.role,
      refId: user.refId,
    };
    return this.jwtService.sign(payload);
  }
}
