import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SpellcheckService {
  private dictionary: Set<string>;
  private readonly DICTIONARY_FILE_PATH = path.join(
    process.cwd(),
    'src/assets/dictionary.txt',
  );
  constructor() {
    this.loadDictionary();
  }

  private loadDictionary(): void {
    try {
      const dictionaryContent = fs.readFileSync(
        this.DICTIONARY_FILE_PATH,
        'utf-8',
      );
      this.dictionary = new Set(
        dictionaryContent.split('\n').map((word) => word.trim().toLowerCase()),
      );
    } catch (error) {
      console.error('Error reading dictionary file:', error);
    }
  }

  private isValidWord(word: string): boolean {
    return this.dictionary.has(word);
  }

  private hasRepeatingCharacters(word: string): boolean {
    const repeatingCharsRegex = /(.)\1+/;
    return repeatingCharsRegex.test(word);
  }

  private isMissingVowels(word: string): boolean {
    const vowelsRegex = /[aeiou]/i;
    return !vowelsRegex.test(word);
  }

  private hasMixedCasing(word: string): boolean {
    const lowercaseWord = word.toLowerCase();
    const uppercaseWord = word.toUpperCase();
    return (
      lowercaseWord !== uppercaseWord &&
      lowercaseWord !== word &&
      uppercaseWord !== word
    );
  }

  spellcheckWord(word: string): { suggestions: string[]; correct: boolean } {
    if (this.isValidWord(word)) {
      return { suggestions: [], correct: true };
    }
    const lowercaseWord = word.toLowerCase();
    const suggestions: string[] = [];

    for (const dictWord of this.dictionary) {
      if (
        dictWord.length === lowercaseWord.length &&
        this.areSimilarWords(dictWord, lowercaseWord)
      ) {
        suggestions.push(dictWord);
      }
    }

    if (suggestions.length === 0) {
      for (const dictWord of this.dictionary) {
        if (
          (this.hasRepeatingCharacters(dictWord) &&
            !this.hasRepeatingCharacters(word)) ||
          (this.isMissingVowels(dictWord) && !this.isMissingVowels(word)) ||
          (this.hasMixedCasing(dictWord) && !this.hasMixedCasing(word))
        ) {
          suggestions.push(dictWord);
        }
      }
    }

    return { suggestions, correct: false };
  }

  private areSimilarWords(word1: string, word2: string): boolean {
    let differences = 0;
    for (let i = 0; i < word1.length; i++) {
      if (word1[i] !== word2[i]) {
        differences++;
        if (differences > 1) {
          return false;
        }
      }
    }
    return true;
  }
}
