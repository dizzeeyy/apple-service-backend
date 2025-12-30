import { Test, TestingModule } from '@nestjs/testing';
import { RepearController } from './repear.controller';

describe('RepearController', () => {
  let controller: RepearController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RepearController],
    }).compile();

    controller = module.get<RepearController>(RepearController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
