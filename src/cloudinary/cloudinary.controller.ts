import { Controller, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';

@Controller('icon')
export class IconUploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Put()
  @UseInterceptors(FileInterceptor('file'))
  async uploadIcon(@UploadedFile() file: Express.Multer.File) {
    // CloudinaryService.uploadImage(file) を呼ぶ
    const result = await this.cloudinaryService.uploadImage(file);
    // secure_urlなど必要な情報を返却
    return { url: result.secure_url };
  }
}
