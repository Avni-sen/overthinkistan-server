import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsController } from './controllers/posts.controller';
import { PostsService } from './services/posts.service';
import { Post, PostSchema } from './models/post.model';
import { Category, CategorySchema } from './models/category.model';
import { User, UserSchema } from '../users/schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Category.name, schema: CategorySchema },
      { name: User.name, schema: UserSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret:
          configService.get<string>('JWT_SECRET') ||
          'overthinkistan-secret-key',
        signOptions: {
          expiresIn: '1d',
        },
      }),
    }),
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
