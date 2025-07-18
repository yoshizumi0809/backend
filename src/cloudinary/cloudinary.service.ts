import { Injectable, Inject } from '@nestjs/common';
import { CLOUDINARY } from './constants';
import { v2 as Cloudinary } from 'cloudinary';
import toStream from 'buffer-to-stream';

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

      const buffer: Buffer = (file as unknown as { buffer: Buffer }).buffer;
      (toStream as (input: Buffer) => NodeJS.ReadableStream)(buffer).pipe(
        upload,
      );
    });
  }
}
