import { Controller, Get, Param } from '@nestjs/common';
import { SpellcheckService } from '../services/spellcheck.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('spell')
@Controller('spell')
export class SpellcheckController {
  constructor(private readonly spellcheckService: SpellcheckService) {}

  @Get(':word')
  @ApiParam({ name: 'word', description: 'The word to spellcheck' })
  @ApiOperation({
    summary: 'Spellcheck a word',
    description: 'Returns spellcheck suggestions and correctness',
  })
  @ApiResponse({
    status: 200,
    description: 'If the word is found, suggestions are provided if necessary.',
  })
  @ApiResponse({
    status: 404,
    description: 'Word not found',
  })
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
