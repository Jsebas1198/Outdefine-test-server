import { Injectable, NotFoundException } from '@nestjs/common';
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

  /**
   * Loads the dictionary from the specified file path and populates the dictionary set.
   *
   */
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

  /**
   * Check the given word for validity and provide suggestions if invalid.
   *
   * @param {string} word - the word to be checked
   * @return {object} an object containing suggestions and correctness flag
   */
  checkWord(word: string) {
    if (this.isValidWord(word)) {
      return { suggestions: [], correct: true };
    }

    const suggestions = new Set<string>();
    const lowercaseWord = word.toLowerCase();

    if (
      /(\w)\1+/.test(word) ||
      !/[aeiou]/.test(word) ||
      (word !== lowercaseWord && word !== word.toUpperCase())
    ) {
      this.addSuggestionsToSet(suggestions, this.getSuggestions(word));
    }

    if (suggestions.size === 0) {
      throw new NotFoundException('Word not found');
    }

    return { suggestions: Array.from(suggestions), correct: false };
  }

  /**
   * Adds new suggestions to the target set, converting them to lowercase.
   *
   * @param {Set<string>} targetSet - the set to add suggestions to
   * @param {string[]} newSuggestions - the new suggestions to add
   */
  private addSuggestionsToSet(
    targetSet: Set<string>,
    newSuggestions: string[],
  ) {
    newSuggestions.forEach((suggestion) =>
      targetSet.add(suggestion.toLowerCase()),
    );
  }

  /**
   * Calculates the Levenshtein distance between two strings.
   *
   * @param {string} a - the first string
   * @param {string} b - the second string
   * @return {number} the Levenshtein distance between the two strings
   */
  private levenshteinDistance(a: string, b: string): number {
    const dp = Array.from({ length: a.length + 1 }, (_, i) =>
      Array.from({ length: b.length + 1 }, (_, j) =>
        i === 0 ? j : j === 0 ? i : 0,
      ),
    );

    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + cost,
        );
      }
    }

    return dp[a.length][b.length];
  }

  /**
   * Retrieves suggestions for the given word based on the Levenshtein distance
   *
   * @param {string} word - the input word for which suggestions are retrieved
   * @return {string[]} an array of suggested words
   */
  private getSuggestions(word: string): string[] {
    const suggestions: { word: string; distance: number }[] = [];

    for (const dictWord of this.dictionary) {
      const distance = this.levenshteinDistance(word, dictWord);
      if (distance <= 2) {
        suggestions.push({ word: dictWord, distance });
      }
    }

    // Sort suggestions by distance
    suggestions.sort((a, b) => a.distance - b.distance);

    // Filter suggestions to include only words with the smallest distance
    const minDistance =
      suggestions.length > 0 ? suggestions[0].distance : Infinity;
    const filteredSuggestions = suggestions.filter(
      (suggestion) => suggestion.distance === minDistance,
    );

    // Extract words from filtered suggestions
    const resultSuggestions = filteredSuggestions.map(
      (suggestion) => suggestion.word,
    );

    return resultSuggestions;
  }
}
