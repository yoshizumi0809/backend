import { Injectable, Inject } from '@nestjs/common';
import { CLOUDINARY } from './constants';
import { v2 as Cloudinary } from 'cloudinary';
import toStream from 'buffer-to-stream';
import type { Express } from 'express'; // ← 型だけ import

@Injectable()
export class CloudinaryService {
  constructor(@Inject(CLOUDINARY) private cloudinary: typeof Cloudinary) {}

  async uploadImage(file: Express.Multer.File): Promise<any> {
    return new Promise((resolve, reject) => {
      const upload = this.cloudinary.uploader.upload_stream(
        { folder: 'user_icons' },
        (error, result) => {
          if (error) return reject(new Error(error.message || 'Upload failed'));
          resolve(result);
        },
      );

      /** ★ ここだけ変更（型を明示した変数を経由） */
      const buffer: Buffer = (file as unknown as { buffer: Buffer }).buffer;
      (toStream as (input: Buffer) => NodeJS.ReadableStream)(buffer).pipe(
        upload,
      );
    });
  }
}
