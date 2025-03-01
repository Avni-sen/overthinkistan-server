import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { BaseModel } from '../../common/models/base.model';
import { Gender } from '../../common/enums/gender.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User extends BaseModel {
  @ApiProperty({ description: 'Ad', example: 'John' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ description: 'Soyad', example: 'Doe' })
  @Prop({ required: true })
  surname: string;

  @ApiProperty({ description: 'Kullanıcı adı', example: 'johndoe' })
  @Prop({ required: true, unique: true })
  username: string;

  @ApiProperty({ description: 'E-posta adresi', example: 'john@example.com' })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({ description: 'Şifre' })
  @Prop({ required: true })
  password: string;

  @ApiProperty({
    description: 'Profil fotoğrafı URL',
    example: 'https://example.com/profile.jpg',
  })
  @Prop({ default: '' })
  profilePhoto: string;

  @ApiProperty({
    description: 'Biyografi',
    example: 'Yazılım geliştirici ve fotoğrafçı',
  })
  @Prop({ default: '' })
  biography: string;

  @ApiProperty({
    description: 'Cinsiyet',
    enum: Gender,
    example: Gender.PREFER_NOT_TO_SAY,
  })
  @Prop({ default: Gender.PREFER_NOT_TO_SAY })
  gender: Gender;

  @ApiProperty({ description: 'Takipçi sayısı', example: 0 })
  @Prop({ default: 0 })
  followersCount: number;

  @ApiProperty({ description: 'Takip edilen sayısı', example: 0 })
  @Prop({ default: 0 })
  followingCount: number;

  @ApiProperty({ description: 'Gönderi sayısı', example: 0 })
  @Prop({ default: 0 })
  postCount: number;

  @ApiProperty({ description: 'Kullanıcı rolü', example: 'user' })
  @Prop({ default: 'user' })
  role: string;

  @ApiProperty({
    description: 'Kullanım şartlarını kabul etme durumu',
    example: true,
  })
  @Prop({ default: false })
  termsAndConditions: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
