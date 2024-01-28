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
    const result = this.spellcheckService.spellcheckWord(word);

    if (result.correct) {
      return { suggestions: [], correct: true };
    } else {
      return { suggestions: result.suggestions, correct: false };
    }
  }
}
