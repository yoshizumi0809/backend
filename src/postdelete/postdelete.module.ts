import { Module } from '@nestjs/common';
import { PostdeleteController } from './postdelete.controller';
import { PostdeleteService } from './postdelete.service';

@Module({
  controllers: [PostdeleteController],
  providers: [PostdeleteService],
})
export class PostdeleteModule {}
