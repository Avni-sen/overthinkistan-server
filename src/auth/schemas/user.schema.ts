import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
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
