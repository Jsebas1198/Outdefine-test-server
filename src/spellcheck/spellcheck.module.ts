import { Module } from '@nestjs/common';
import { SpellcheckController } from './controllers/spellcheck.controller';
import { SpellcheckService } from './services/spellcheck.service';

@Module({
  controllers: [SpellcheckController],
  providers: [SpellcheckService],
})
export class SpellcheckModule {}
