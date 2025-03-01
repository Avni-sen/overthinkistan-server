import { Body, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { BaseService } from '../services/base.service';
import { BaseModel } from '../models/base.model';
import { Document } from 'mongoose';

export abstract class BaseController<T extends BaseModel, D extends Document> {
  constructor(protected readonly service: BaseService<T, D>) {}

  @Get()
  @ApiOperation({ summary: 'Tüm kayıtları getir' })
  @ApiResponse({ status: 200, description: 'Kayıtlar başarıyla getirildi.' })
  async getAllAsync(): Promise<T[]> {
    return this.service.getAllAsync();
  }

  @Get('ref/:refId')
  @ApiOperation({ summary: "RefID'ye göre kayıt getir" })
  @ApiParam({ name: 'refId', description: "Kaydın RefID'si" })
  @ApiResponse({ status: 200, description: 'Kayıt başarıyla getirildi.' })
  @ApiResponse({ status: 404, description: 'Kayıt bulunamadı.' })
  async getByRefIdAsync(@Param('refId') refId: string): Promise<T> {
    return this.service.getByRefIdAsync(refId);
  }

  @Post()
  @ApiOperation({ summary: 'Yeni kayıt oluştur' })
  @ApiResponse({ status: 201, description: 'Kayıt başarıyla oluşturuldu.' })
  @ApiResponse({ status: 400, description: 'Geçersiz giriş.' })
  async createAsync(
    @Body() createDto: Partial<T>,
    @Req() req: any,
  ): Promise<T> {
    const userId = req.user?.sub || null;
    return this.service.createAsync(createDto, userId);
  }

  @Put('ref/:refId')
  @ApiOperation({ summary: 'RefID ile kayıt güncelle' })
  @ApiParam({ name: 'refId', description: "Güncellenecek kaydın RefID'si" })
  @ApiResponse({ status: 200, description: 'Kayıt başarıyla güncellendi.' })
  @ApiResponse({ status: 404, description: 'Kayıt bulunamadı.' })
  @ApiResponse({ status: 400, description: 'Geçersiz giriş.' })
  async updateByRefIdAsync(
    @Param('refId') refId: string,
    @Body() updateDto: Partial<T>,
    @Req() req: any,
  ): Promise<T> {
    const userId = req.user?.sub || null;
    return this.service.updateByRefIdAsync(refId, updateDto, userId);
  }

  @Delete('ref/:refId')
  @ApiOperation({ summary: 'RefID ile kayıt sil (soft delete)' })
  @ApiParam({ name: 'refId', description: "Silinecek kaydın RefID'si" })
  @ApiResponse({ status: 200, description: 'Kayıt başarıyla silindi.' })
  @ApiResponse({ status: 404, description: 'Kayıt bulunamadı.' })
  async deleteByRefIdAsync(
    @Param('refId') refId: string,
    @Req() req: any,
  ): Promise<T> {
    const userId = req.user?.sub || null;
    return this.service.softDeleteByRefIdAsync(refId, userId);
  }
}
