import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { BaseModel } from '../../common/models/base.model';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post extends BaseModel {
  @ApiProperty({
    description: 'Post içeriği',
    example: 'Bugün çok güzel bir gün geçirdim...',
  })
  @Prop({ required: true })
  content: string;

  @ApiProperty({
    description: 'Post kategorileri (refId)',
    example: [
      'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      'b2c3d4e5-f6a7-8901-bcde-f23456789012',
    ],
  })
  @Prop({ type: [String] })
  categoryRefIds: string[];

  @ApiProperty({
    description: 'Beğeni sayısı',
    example: 42,
  })
  @Prop({ default: 0 })
  likeCount: number;

  @ApiProperty({
    description: 'Beğenmeme sayısı',
    example: 5,
  })
  @Prop({ default: 0 })
  dislikeCount: number;

  @ApiProperty({
    description: 'Anonim paylaşım durumu',
    example: false,
  })
  @Prop({ default: false })
  isAnonymous: boolean;

  @ApiProperty({
    description: 'Post fotoğrafı URL',
    example: 'https://example.com/photos/post123.jpg',
  })
  @Prop()
  photoUrl: string;

  @ApiProperty({
    description: 'Yorum sayısı',
    example: 15,
  })
  @Prop({ default: 0 })
  commentCount: number;

  @ApiProperty({
    description: 'Görüntülenme sayısı',
    example: 120,
  })
  @Prop({ default: 0 })
  viewCount: number;
}

export const PostSchema = SchemaFactory.createForClass(Post);
