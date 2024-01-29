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
   */
  private loadDictionary = async (): Promise<void> => {
    try {
      const dictionaryContent = await fs.promises.readFile(
        this.DICTIONARY_FILE_PATH,
        'utf-8',
      );
      this.dictionary = new Set(
        dictionaryContent.trim().toLowerCase().split('\n'),
      );
    } catch (error) {
      console.error('Error reading dictionary file:', error);
    }
  };

  /**
   * Check if the word is valid.
   *
   * @param {string} word - the word to be checked
   * @return {boolean} true if the word is in the dictionary, false otherwise
   */
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

    return { suggestions: [...suggestions], correct: false };
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
    const dp = Array(a.length + 1)
      .fill(0)
      .map((_, i) =>
        Array(b.length + 1)
          .fill(0)
          .map((_, j) => (i === 0 ? j : j === 0 ? i : 0)),
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
      suggestions.push({ word: dictWord, distance });
    }

    // Find the minimum distance
    const minDistance = Math.min(
      ...suggestions.map((suggestion) => suggestion.distance),
    );

    // Collect suggestions with the minimum distance
    const resultSuggestions = suggestions
      .filter((suggestion) => suggestion.distance === minDistance)
      .map((suggestion) => suggestion.word);

    return resultSuggestions;
  }
}
