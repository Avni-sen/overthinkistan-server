import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { BaseModel } from '../../common/models/base.model';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category extends BaseModel {
  @ApiProperty({
    description: 'Kategori adı',
    example: 'Komedi',
  })
  @Prop({ required: true, unique: true })
  name: string;

  @ApiProperty({
    description: 'Kategori açıklaması',
    example: 'Komik içerikler ve hikayeler',
  })
  @Prop()
  description: string;

  @ApiProperty({
    description: 'Kategori sırası',
    example: 1,
  })
  @Prop({ default: 0 })
  order: number;

  @ApiProperty({
    description: 'Kategori ikonu (opsiyonel)',
    example: 'fa-laugh',
  })
  @Prop()
  icon: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
