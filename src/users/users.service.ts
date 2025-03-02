import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { BaseService } from '../common/services/base.service';
import { CreateUserDto } from './dto/create-user.dto';
import { DataStatus } from '../common/enums/data-status.enum';
import { UpdateProfilePhotoDto } from './dto/update-profile-photo.dto';

@Injectable()
export class UsersService extends BaseService<User, UserDocument> {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super(userModel);
  }

  async createAsync(
    createUserDto: CreateUserDto,
    userId?: string,
  ): Promise<User> {
    // Şifreyi hash'le
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    // Kullanıcıyı oluştur
    const createData = {
      ...createUserDto,
      password: hashedPassword,
      followersCount: 0,
      followingCount: 0,
      postCount: 0,
    };

    return super.createAsync(createData, userId);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel
      .findOne({
        username,
        dataStatus: DataStatus.ACTIVE,
      })
      .exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel
      .findOne({
        email,
        dataStatus: DataStatus.ACTIVE,
      })
      .exec();
  }

  async findByRefId(refId: string): Promise<User | null> {
    return this.userModel
      .findOne({
        refId,
        dataStatus: DataStatus.ACTIVE,
      })
      .exec();
  }

  async updateProfilePhoto(
    refId: string,
    updateProfilePhotoDto: UpdateProfilePhotoDto,
  ): Promise<User> {
    try {
      const user = await this.findByRefId(refId);

      if (!user) {
        throw new NotFoundException(`RefId ${refId} ile kullanıcı bulunamadı`);
      }

      // Profil fotoğrafını güncelle
      const updatedUser = await this.updateByRefIdAsync(refId, {
        profilePhoto: updateProfilePhotoDto.profilePhoto,
      });

      return updatedUser;
    } catch (error) {
      throw new NotFoundException(
        `Profil fotoğrafı güncellenirken bir hata oluştu: ${error.message}`,
      );
    }
  }
}
