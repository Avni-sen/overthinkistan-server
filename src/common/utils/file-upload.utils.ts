import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { HttpException, HttpStatus } from '@nestjs/common';

// Yükleme dizinini oluştur
export const multerConfig = {
  dest: './uploads',
};

// Multer ayarları
export const multerOptions = {
  // Dosya boyutu limiti (5MB)
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  // Dosya filtreleme
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      cb(null, true);
    } else {
      cb(
        new HttpException(
          'Desteklenmeyen dosya tipi. Sadece jpg, jpeg, png ve gif dosyaları kabul edilir.',
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
  // Depolama ayarları
  storage: diskStorage({
    // Hedef dizin
    destination: (req: any, file: any, cb: any) => {
      const uploadPath = multerConfig.dest;
      // Dizin yoksa oluştur
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    // Dosya adı
    filename: (req: any, file: any, cb: any) => {
      // Benzersiz bir dosya adı oluştur
      const filename = `${uuid()}${extname(file.originalname)}`;
      cb(null, filename);
    },
  }),
};
