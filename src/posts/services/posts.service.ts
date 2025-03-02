import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto, UpdatePostDto } from '../dto';
import { Post, PostDocument } from '../models/post.model';
import { DataStatus } from '../../common/enums/data-status.enum';
import { BaseService } from '../../common/services/base.service';
import { User } from 'src/users/schemas/user.schema';
import { UpdatePostPhotoDto } from '../dto/update-post-photo.dto';

@Injectable()
export class PostsService extends BaseService<Post, PostDocument> {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
  ) {
    super(postModel);
  }
  async like(refId: string): Promise<Post> {
    const post = await this.postModel
      .findOne({ refId, dataStatus: DataStatus.ACTIVE })
      .exec();

    if (!post) {
      throw new NotFoundException(`Post with refId ${refId} not found`);
    }

    const updatedPost = await this.postModel
      .findOneAndUpdate({ refId }, { $inc: { likeCount: 1 } }, { new: true })
      .exec();

    if (!updatedPost) {
      throw new NotFoundException(`Post with refId ${refId} not found`);
    }

    return updatedPost as Post;
  }

  async dislike(refId: string): Promise<Post> {
    const post = await this.postModel
      .findOne({ refId, dataStatus: DataStatus.ACTIVE })
      .exec();

    if (!post) {
      throw new NotFoundException(`Post with refId ${refId} not found`);
    }

    const updatedPost = await this.postModel
      .findOneAndUpdate({ refId }, { $inc: { dislikeCount: 1 } }, { new: true })
      .exec();

    if (!updatedPost) {
      throw new NotFoundException(`Post with refId ${refId} not found`);
    }

    return updatedPost as Post;
  }

  async getUserPosts(userRefId: string): Promise<{ posts: Post[] }> {
    const posts = await this.getAllAsync({ createdBy: userRefId });
    return { posts };
  }

  async getCategoryPosts(
    categoryRefId: string,
    page = 1,
    limit = 10,
  ): Promise<{ posts: Post[] }> {
    const posts = await this.getAllAsync({ categoryRefIds: categoryRefId });
    return { posts };
  }

  async updatePostPhoto(
    refId: string,
    updatePostPhotoDto: UpdatePostPhotoDto,
  ): Promise<Post> {
    try {
      const post = await this.getByIdAsync(refId);

      if (!post) {
        throw new NotFoundException(`RefId ${refId} ile post bulunamadı`);
      }

      // Post fotoğrafını güncelle
      const updatedPost = await this.updateByRefIdAsync(refId, {
        photoUrl: updatePostPhotoDto.postPhoto,
      });

      return updatedPost;
    } catch (error) {
      throw new NotFoundException(
        `Post fotoğrafı güncellenirken bir hata oluştu: ${error.message}`,
      );
    }
  }
}
