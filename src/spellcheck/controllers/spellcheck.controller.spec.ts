import { Test, TestingModule } from '@nestjs/testing';
import { SpellcheckController } from './spellcheck.controller';

describe('SpellcheckController', () => {
  let controller: SpellcheckController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpellcheckController],
    }).compile();

    controller = module.get<SpellcheckController>(SpellcheckController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
