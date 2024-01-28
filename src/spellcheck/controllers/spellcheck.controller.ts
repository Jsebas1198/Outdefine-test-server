import { Controller, Get, Param } from '@nestjs/common';
import { SpellcheckService } from '../services/spellcheck.service';

@Controller('spell')
export class SpellcheckController {
  constructor(private readonly spellcheckService: SpellcheckService) {}

  @Get(':word')
  spellcheckWord(@Param('word') word: string): {
    suggestions: string[];
    correct: boolean;
  } {
    const { suggestions, correct } = this.spellcheckService.checkWord(word);

    return {
      suggestions: Array.from(suggestions),
      correct,
    };
  }
}
