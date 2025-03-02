import { ApiProperty } from '@nestjs/swagger';

export class PostWithRelationsDto {
  @ApiProperty()
  refId: string;

  @ApiProperty()
  content: string;

  @ApiProperty({ required: false })
  imageUrl?: string;

  @ApiProperty()
  likeCount: number;

  @ApiProperty()
  dislikeCount: number;

  @ApiProperty()
  commentCount: number;

  @ApiProperty()
  viewCount: number;

  @ApiProperty()
  isAnonymous: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  // Kategori bilgileri
  @ApiProperty({ type: Array })
  categories: {
    refId: string;
    name: string;
    description?: string;
  }[];

  // Kullanıcı bilgileri
  @ApiProperty({ required: false })
  user?: {
    refId: string;
    username: string;
    profilePhotoUrl?: string;
  } | null;
}
