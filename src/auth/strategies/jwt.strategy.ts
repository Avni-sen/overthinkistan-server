import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../users/schemas/user.schema';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';
import { DataStatus } from '../../common/enums/data-status.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:
        configService.get<string>('JWT_SECRET') || 'overthinkistan-secret-key',
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { refId } = payload;
    const user = await this.userModel.findOne({
      refId,
      dataStatus: DataStatus.ACTIVE,
    });

    if (!user) {
      throw new UnauthorizedException('Kullanıcı bulunamadı veya aktif değil');
    }

    return user;
  }
}
