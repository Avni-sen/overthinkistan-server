import { Document, FilterQuery, Model, UpdateQuery } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { BaseModel } from '../models/base.model';
import { DataStatus } from '../enums/data-status.enum';

export abstract class BaseService<T extends BaseModel, D extends Document> {
  constructor(protected readonly model: Model<D>) {}

  async getAllAsync(filter: FilterQuery<D> = {}): Promise<T[]> {
    // Varsayılan olarak sadece aktif kayıtları getir
    const defaultFilter: FilterQuery<D> = {
      ...filter,
      dataStatus: DataStatus.ACTIVE,
    };
    return this.model.find(defaultFilter).exec() as unknown as T[];
  }

  async getByIdAsync(id: string): Promise<T> {
    const entity = await this.model
      .findOne({
        refId: id,
        dataStatus: DataStatus.ACTIVE,
      })
      .exec();

    if (!entity) {
      throw new NotFoundException(
        `${this.model.modelName} with ID ${id} not found`,
      );
    }

    return entity as unknown as T;
  }

  async getByRefIdAsync(refId: string): Promise<T> {
    const entity = await this.model
      .findOne({
        refId,
        dataStatus: DataStatus.ACTIVE,
      })
      .exec();

    if (!entity) {
      throw new NotFoundException(
        `${this.model.modelName} with RefID ${refId} not found`,
      );
    }

    return entity as unknown as T;
  }

  async createAsync(createDto: Partial<T>, userId?: string): Promise<T> {
    const createdEntity = new this.model({
      ...createDto,
      createdAt: new Date(),
      createdBy: userId,
      dataStatus: DataStatus.ACTIVE,
    });

    console.log(createdEntity);

    return (await createdEntity.save()) as unknown as T;
  }

  async updateAsync(
    id: string,
    updateDto: Partial<T>,
    userId?: string,
  ): Promise<T> {
    const entity = await this.getByIdAsync(id);

    if (!entity) {
      throw new NotFoundException(
        `${this.model.modelName} with ID ${id} not found`,
      );
    }

    const updateData: UpdateQuery<D> = {
      ...updateDto,
      updatedAt: new Date(),
      updatedBy: userId,
    };

    const updatedEntity = await this.model
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    return updatedEntity as unknown as T;
  }

  async updateByRefIdAsync(
    refId: string,
    updateDto: Partial<T>,
    userId?: string,
  ): Promise<T> {
    const entity = await this.getByRefIdAsync(refId);

    if (!entity) {
      throw new NotFoundException(
        `${this.model.modelName} with RefID ${refId} not found`,
      );
    }

    const updateData: UpdateQuery<D> = {
      ...updateDto,
      updatedAt: new Date(),
      updatedBy: userId,
    };

    const updatedEntity = await this.model
      .findOneAndUpdate({ refId }, updateData, { new: true })
      .exec();

    return updatedEntity as unknown as T;
  }

  async softDeleteAsync(id: string, userId?: string): Promise<T> {
    const entity = await this.getByIdAsync(id);

    if (!entity) {
      throw new NotFoundException(
        `${this.model.modelName} with ID ${id} not found`,
      );
    }

    const updateData: UpdateQuery<D> = {
      dataStatus: DataStatus.DELETED,
      deletedAt: new Date(),
      deletedBy: userId,
    };

    const deletedEntity = await this.model
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    return deletedEntity as unknown as T;
  }

  async softDeleteByRefIdAsync(refId: string, userId?: string): Promise<T> {
    const entity = await this.getByRefIdAsync(refId);

    if (!entity) {
      throw new NotFoundException(
        `${this.model.modelName} with RefID ${refId} not found`,
      );
    }

    const updateData: UpdateQuery<D> = {
      dataStatus: DataStatus.DELETED,
      deletedAt: new Date(),
      deletedBy: userId,
    };

    const deletedEntity = await this.model
      .findOneAndUpdate({ refId }, updateData, { new: true })
      .exec();

    return deletedEntity as unknown as T;
  }

  async hardDeleteAsync(id: string): Promise<boolean> {
    const result = await this.model.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }

  async hardDeleteByRefIdAsync(refId: string): Promise<boolean> {
    const result = await this.model.deleteOne({ refId }).exec();
    return result.deletedCount > 0;
  }
}
