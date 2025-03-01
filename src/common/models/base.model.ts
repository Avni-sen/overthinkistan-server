import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { DataStatus } from '../enums/data-status.enum';
import { v4 as uuidv4 } from 'uuid';

export class BaseModel {
  @ApiProperty({
    description: 'Referans ID (GUID)',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @Prop({ default: uuidv4, unique: true })
  refId: string;

  @ApiProperty({ description: 'Oluşturulma tarihi' })
  @Prop({ default: Date.now })
  createdAt: Date;

  @ApiProperty({ description: 'Oluşturan kullanıcı ID' })
  @Prop()
  createdBy: string;

  @ApiProperty({ description: 'Güncellenme tarihi' })
  @Prop()
  updatedAt: Date;

  @ApiProperty({ description: 'Güncelleyen kullanıcı ID' })
  @Prop()
  updatedBy: string;

  @ApiProperty({ description: 'Silinme tarihi' })
  @Prop()
  deletedAt: Date;

  @ApiProperty({ description: 'Silen kullanıcı ID' })
  @Prop()
  deletedBy: string;

  @ApiProperty({
    description: 'Veri durumu',
    enum: DataStatus,
    example: DataStatus.ACTIVE,
  })
  @Prop({ default: DataStatus.ACTIVE })
  dataStatus: DataStatus;
}
