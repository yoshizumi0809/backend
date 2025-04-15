import { Test, TestingModule } from '@nestjs/testing';
import { PostdeleteService } from './postdelete.service';

describe('PostdeleteService', () => {
  let service: PostdeleteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostdeleteService],
    }).compile();

    service = module.get<PostdeleteService>(PostdeleteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
