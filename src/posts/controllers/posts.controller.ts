import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
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
  ApiBearerAuth,
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
import { UpdatePostPhotoDto } from '../dto/update-post-photo.dto';

// Request tipini genişletiyoruz
interface RequestWithUser extends Request {
  user: {
    refId: string;
    [key: string]: any;
  };
}

@ApiTags('posts')
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
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: CreatePostDto })
  @ApiOperation({ summary: 'Yeni bir post oluştur' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Post başarıyla oluşturuldu',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Geçersiz veri',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Yetkilendirme hatası',
  })
  async createAsync(
    @Body() createPostDto: CreatePostDto,
    @Req() req: RequestWithUser,
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
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/posts/${file.filename}`;
    return { url: fileUrl };
  }
}
