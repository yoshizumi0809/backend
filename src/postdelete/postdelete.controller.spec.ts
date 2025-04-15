import { Test, TestingModule } from '@nestjs/testing';
import { PostdeleteController } from './postdelete.controller';

describe('PostdeleteController', () => {
  let controller: PostdeleteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostdeleteController],
    }).compile();

    controller = module.get<PostdeleteController>(PostdeleteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
