import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../common/controllers/base.controller';
import { Category, CategoryDocument } from '../models/category.model';
import { CategoryService } from '../services/category.service';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController extends BaseController<
  Category,
  CategoryDocument
> {
  constructor(private readonly categoryService: CategoryService) {
    super(categoryService);
  }
}
