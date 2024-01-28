import { Test, TestingModule } from '@nestjs/testing';
import { SpellcheckService } from './spellcheck.service';

describe('SpellcheckService', () => {
  let service: SpellcheckService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpellcheckService],
    }).compile();

    service = module.get<SpellcheckService>(SpellcheckService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
