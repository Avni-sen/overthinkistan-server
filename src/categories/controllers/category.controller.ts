import { Body, Controller, Post, Put, Param, Req } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BaseController } from '../../common/controllers/base.controller';
import { Category, CategoryDocument } from '../models/category.model';
import { CategoryService } from '../services/category.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { JwtService } from '@nestjs/jwt';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController extends BaseController<
  Category,
  CategoryDocument,
  CreateCategoryDto,
  UpdateCategoryDto
> {
  constructor(
    private readonly categoryService: CategoryService,
    protected readonly jwtService: JwtService,
  ) {
    super(categoryService, jwtService);
  }

  @Post()
  @ApiOperation({ summary: 'Yeni kategori oluştur' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({ status: 201, description: 'Kategori başarıyla oluşturuldu.' })
  @ApiResponse({ status: 400, description: 'Geçersiz giriş.' })
  async createAsync(
    @Body() createDto: CreateCategoryDto,
    @Req() req: any,
  ): Promise<Category> {
    const userRefId = this.extractUserRefIdFromRequest(req);
    return this.categoryService.createAsync(createDto, userRefId);
  }

  @Put('ref/:refId')
  @ApiOperation({ summary: 'RefID ile kategori güncelle' })
  @ApiParam({
    name: 'refId',
    description: "Güncellenecek kategorinin RefID'si",
  })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({ status: 200, description: 'Kategori başarıyla güncellendi.' })
  @ApiResponse({ status: 404, description: 'Kategori bulunamadı.' })
  @ApiResponse({ status: 400, description: 'Geçersiz giriş.' })
  async updateByRefIdAsync(
    @Param('refId') refId: string,
    @Body() updateDto: UpdateCategoryDto,
    @Req() req: any,
  ): Promise<Category> {
    const userRefId = this.extractUserRefIdFromRequest(req);
    return this.categoryService.updateByRefIdAsync(refId, updateDto, userRefId);
  }
}
