import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  HttpException,
} from '@nestjs/common';
import { PostsService } from '../services/posts.service';
import { CreatePostDto, UpdatePostDto } from '../dto';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PostDocument } from '../models/post.model';
import { BaseController } from 'src/common/controllers/base.controller';
import { JwtService } from '@nestjs/jwt';
import { Post as PostModel } from '../models/post.model';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/utils/file-upload.utils';
import { PostWithRelationsDto } from '../dto/post-with-relations.dto';

@ApiTags('Posts')
@Controller('posts')
export class PostsController extends BaseController<
  PostModel,
  PostDocument,
  CreatePostDto,
  UpdatePostDto
> {
  constructor(
    private readonly postsService: PostsService,
    protected readonly jwtService: JwtService,
  ) {
    super(postsService, jwtService);
  }

  @Post()
  @ApiOperation({ summary: 'Yeni kategori oluştur' })
  @ApiBody({ type: CreatePostDto })
  @ApiResponse({ status: 201, description: 'Post başarıyla oluşturuldu.' })
  @ApiResponse({ status: 400, description: 'Geçersiz giriş.' })
  async createAsync(
    @Body() createPostDto: CreatePostDto,
    @Req() req: any,
  ): Promise<PostModel> {
    const userRefId = this.extractUserRefIdFromRequest(req);
    return this.postsService.createAsync(createPostDto, userRefId);
  }

  @Post(':refId/like')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Bir postu beğen' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Post başarıyla beğenildi',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Post bulunamadı',
  })
  like(@Param('refId') refId: string) {
    return this.postsService.like(refId);
  }

  @Post(':refId/dislike')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Bir postu beğenme' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Post başarıyla beğenilmedi',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Post bulunamadı',
  })
  dislike(@Param('refId') refId: string) {
    return this.postsService.dislike(refId);
  }

  @Get('user/:userRefId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Bir kullanıcının tüm postlarını getir' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Kullanıcı postları başarıyla getirildi',
  })
  getUserPosts(@Param('userRefId') userRefId: string) {
    return this.postsService.getUserPosts(userRefId);
  }

  @Get('category/:categoryRefId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Bir kategoriye ait tüm postları getir' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Kategori postları başarıyla getirildi',
  })
  getCategoryPosts(@Param('categoryRefId') categoryRefId: string) {
    return this.postsService.getCategoryPosts(categoryRefId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload-post-photo')
  @ApiOperation({ summary: 'Post Görseli yükle' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Post fotoğrafı başarıyla yüklendi.',
  })
  @ApiResponse({
    status: 400,
    description: 'Geçersiz dosya formatı veya boyutu.',
  })
  @ApiResponse({ status: 401, description: 'Yetkilendirme hatası.' })
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadProfilePhoto(
    @UploadedFile() file: any,
    @Req() req: any,
  ): Promise<{ url: string }> {
    if (!file) {
      throw new HttpException('Dosya bulunamadı', HttpStatus.BAD_REQUEST);
    }
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
    return { url: fileUrl };
  }

  @Get('get-all-posts-with-relations')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Tüm postları ilişkili verilerle birlikte getir' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Postlar başarıyla getirildi',
    type: [PostWithRelationsDto],
  })
  getAllPostsWithRelations() {
    return this.postsService.getAllPostsWithRelations();
  }
}
