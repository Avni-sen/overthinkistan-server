import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { BaseModel } from '../../common/models/base.model';
import { DataStatus } from '../../common/enums/data-status.enum';

export type CategoryDocument = Category & Document;

@Schema()
export class Category extends BaseModel {
  @ApiProperty({
    description: 'Kategori adı',
    example: 'Teknoloji',
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    description: 'Kategori açıklaması',
    example: 'Teknoloji ile ilgili paylaşımlar',
  })
  @Prop()
  description?: string;

  @ApiProperty({
    description: 'Kategori ikonu',
    example: 'https://example.com/icons/tech.png',
  })
  @Prop()
  iconUrl?: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
