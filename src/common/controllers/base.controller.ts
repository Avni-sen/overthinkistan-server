import { Body, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { BaseService } from '../services/base.service';
import { BaseModel } from '../models/base.model';
import { Document } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

export abstract class BaseController<
  T extends BaseModel,
  D extends Document,
  CreateDto = any,
  UpdateDto = any,
> {
  protected jwtService: JwtService;

  constructor(
    protected readonly service: BaseService<T, D>,
    jwtService?: JwtService,
  ) {
    if (jwtService) {
      this.jwtService = jwtService;
    }
  }

  /**
   * Request nesnesinden kullanıcı refId'sini çıkarır
   * @param req Request nesnesi
   * @returns Kullanıcı refId'si veya undefined
   */
  protected extractUserRefIdFromRequest(req: any): string | undefined {
    let userRefId: string | undefined = undefined;

    try {
      // Cookie'den token'ı al
      if (this.jwtService && req.cookies && req.cookies.token) {
        // "Bearer " önekini kaldır
        const tokenValue = req.cookies.token.replace('Bearer ', '');
        const decodedToken = this.jwtService.verify(tokenValue, {
          secret: process.env.JWT_SECRET,
        });
        userRefId = decodedToken.refId;
        console.log('Token çözümlendi, userRefId:', userRefId);
      } else {
        console.log('Cookie içinde token bulunamadı');
      }
    } catch (error) {
      console.error('Token çözümleme hatası:', error.message);
    }

    return userRefId;
  }

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
  @ApiBody({ type: Object, description: 'Entity verisi' })
  @ApiResponse({ status: 201, description: 'Kayıt başarıyla oluşturuldu.' })
  @ApiResponse({ status: 400, description: 'Geçersiz giriş.' })
  async createAsync(@Body() createDto: CreateDto, @Req() req: any): Promise<T> {
    const userRefId = this.extractUserRefIdFromRequest(req);
    return this.service.createAsync(createDto as any, userRefId);
  }

  @Put('ref/:refId')
  @ApiOperation({ summary: 'RefID ile kayıt güncelle' })
  @ApiParam({ name: 'refId', description: "Güncellenecek kaydın RefID'si" })
  @ApiBody({ type: Object, description: 'Güncellenecek entity verisi' })
  @ApiResponse({ status: 200, description: 'Kayıt başarıyla güncellendi.' })
  @ApiResponse({ status: 404, description: 'Kayıt bulunamadı.' })
  @ApiResponse({ status: 400, description: 'Geçersiz giriş.' })
  async updateByRefIdAsync(
    @Param('refId') refId: string,
    @Body() updateDto: UpdateDto,
    @Req() req: any,
  ): Promise<T> {
    const userRefId = this.extractUserRefIdFromRequest(req);
    return this.service.updateByRefIdAsync(refId, updateDto as any, userRefId);
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
    const userRefId = this.extractUserRefIdFromRequest(req);
    return this.service.softDeleteByRefIdAsync(refId, userRefId);
  }
}
