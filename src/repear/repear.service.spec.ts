import { Test, TestingModule } from '@nestjs/testing';
import { RepearService } from './repear.service';

describe('RepearService', () => {
  let service: RepearService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RepearService],
    }).compile();

    service = module.get<RepearService>(RepearService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
