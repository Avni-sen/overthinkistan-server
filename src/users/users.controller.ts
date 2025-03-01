import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Req,
  NotFoundException,
  UseInterceptors,
  UploadedFile,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User, UserDocument } from './schemas/user.schema';
import { BaseController } from '../common/controllers/base.controller';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { multerOptions } from '../common/utils/file-upload.utils';
import { UpdateProfilePhotoDto } from './dto/update-profile-photo.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController extends BaseController<User, UserDocument> {
  constructor(private readonly usersService: UsersService) {
    super(usersService);
  }

  @Post()
  @ApiOperation({ summary: 'Yeni kullanıcı oluştur' })
  @ApiResponse({ status: 201, description: 'Kullanıcı başarıyla oluşturuldu.' })
  @ApiResponse({ status: 400, description: 'Geçersiz giriş.' })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createAsync(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('ref/:refId')
  @ApiOperation({ summary: 'RefID ile kullanıcı güncelle' })
  @ApiParam({
    name: 'refId',
    description: "Güncellenecek kullanıcının RefID'si",
  })
  @ApiResponse({ status: 200, description: 'Kullanıcı başarıyla güncellendi.' })
  @ApiResponse({ status: 404, description: 'Kullanıcı bulunamadı.' })
  @ApiResponse({ status: 400, description: 'Geçersiz giriş.' })
  async updateUserByRefId(
    @Param('refId') refId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateByRefIdAsync(refId, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('ref/:refId')
  @ApiOperation({ summary: 'RefID ile kullanıcı sil' })
  @ApiParam({
    name: 'refId',
    description: "Silinecek kullanıcının RefID'si",
  })
  @ApiResponse({ status: 200, description: 'Kullanıcı başarıyla silindi.' })
  @ApiResponse({ status: 404, description: 'Kullanıcı bulunamadı.' })
  async deleteUserByRefId(@Param('refId') refId: string): Promise<User> {
    return this.usersService.softDeleteByRefIdAsync(refId);
  }

  @Get('ref/:refId')
  @ApiOperation({ summary: 'RefID ile kullanıcı getir' })
  @ApiParam({ name: 'refId', description: 'Kullanıcı RefID' })
  @ApiResponse({ status: 200, description: 'Kullanıcı başarıyla getirildi.' })
  @ApiResponse({ status: 404, description: 'Kullanıcı bulunamadı.' })
  async findByRefId(@Param('refId') refId: string): Promise<User | null> {
    const user = await this.usersService.findByRefId(refId);
    if (!user) {
      throw new NotFoundException(`RefId ${refId} ile kullanıcı bulunamadı`);
    }
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({
    summary: 'JWT token ile oturum açmış kullanıcı bilgilerini getir',
  })
  @ApiResponse({
    status: 200,
    description: 'Kullanıcı bilgileri başarıyla getirildi.',
  })
  @ApiResponse({ status: 401, description: 'Yetkilendirme hatası.' })
  async getCurrentUser(@Req() req: any): Promise<User> {
    const { refId } = req.user;
    const user = await this.usersService.findByRefId(refId);
    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload-profile-photo')
  @ApiOperation({ summary: 'Profil fotoğrafı yükle' })
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
    description: 'Profil fotoğrafı başarıyla yüklendi.',
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
    const { refId } = req.user;

    // Dosya URL'sini oluştur (sunucu URL'si + dosya yolu)
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;

    // Kullanıcının profil fotoğrafını güncelle
    await this.usersService.updateByRefIdAsync(refId, {
      profilePhoto: fileUrl,
    });

    return { url: fileUrl };
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile-photo')
  @ApiOperation({ summary: 'Profil fotoğrafını güncelle' })
  @ApiResponse({
    status: 200,
    description: 'Profil fotoğrafı başarıyla güncellendi.',
  })
  @ApiResponse({ status: 404, description: 'Kullanıcı bulunamadı.' })
  @ApiResponse({ status: 400, description: 'Geçersiz giriş.' })
  async updateProfilePhoto(
    @Req() req: any,
    @Body() updateProfilePhotoDto: UpdateProfilePhotoDto,
  ): Promise<User> {
    const { refId } = req.user;
    return this.usersService.updateProfilePhoto(refId, updateProfilePhotoDto);
  }
}
