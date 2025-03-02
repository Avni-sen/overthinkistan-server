import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from '../../common/services/base.service';
import { Category, CategoryDocument } from '../models/category.model';

@Injectable()
export class CategoryService extends BaseService<Category, CategoryDocument> {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {
    super(categoryModel);
  }
}
