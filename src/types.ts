/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ReligionType =
  | "hinduism"
  | "islam"
  | "christianity"
  | "judaism"
  | "buddhism"
  | "jainism"
  | "sikhism"
  | "mythology"
  | "history"
  | "space"
  | "other"
  | "prayers";

export interface ScriptureBook {
  key: string;
  title: string;
  originalTitle?: string;
  religion: ReligionType;
  description: string;
  divisionsName: string; // "Chapter", "Surah", "Kanda", etc.
  divisionsCount: number;
  featuredPortions: {
    name: string;
    reference: string;
    topicMessage: string;
  }[];
  imageUrl?: string;
  imageCaption?: string;
  iconName?: string;
}

export interface VerseItem {
  number: string | number;
  originalText?: string;
  original?: string;
  transliteration?: string;
  translation: string;
}

export interface ScriptureReading {
  religion: ReligionType;
  bookKey: string;
  bookTitle: string;
  referenceLabel: string; // e.g. "Chapter 1" or "Surah 1"
  divisionNumber: string | number;
  introSummary: string;
  verses: VerseItem[];
  commentary: string;
  interfaithParallels: {
    religion: ReligionType;
    source: string;
    similarity: string;
    lesson: string;
  }[];
  synchronizedAt?: string;
  syncSource?: "api" | "cache" | "demo";
}

export interface SearchResultItem {
  religion: ReligionType;
  bookKey: string;
  bookTitle: string;
  reference: string;
  text: string;
  explanation: string;
}

export interface ComparisonResponse {
  theme: string;
  synthesis: string;
  comparisons: {
    religion: ReligionType;
    scriptureSource: string;
    keyPassage: string;
    explanation: string;
    relevanceToModernLife: string;
  }[];
}

export interface ChatMessage {
  id: string;
  sender: "user" | "scholar";
  text: string;
  timestamp: number;
}

export interface ReadingNote {
  id: string;
  religion: ReligionType;
  bookKey: string;
  bookTitle: string;
  reference: string; // e.g. "Ch 4, Verse 7"
  verseText?: string;
  noteText: string;
  createdTime: number;
}

export interface SacredCharacter {
  key: string;
  name: string;
  originalName?: string;
  religion: ReligionType;
  role: string;
  attributes: string[];
  scriptureRef?: { bookKey: string; bookTitle: string };
  summary: string;
  detailedEthos: string;
  story: string;
  interfaithEcho: string;
  imageUrl?: string;
  imageCaption?: string;
  isActive?: boolean;
}

export interface VerseAlignmentResult {
  sourceVerse: {
    book: string;
    number: string;
    text: string;
  };
  parallelTradition: string;
  parallelScriptureSource: string;
  parallelKeyPassage: string;
  theologicalAlignment: string;
  modernSpiritualLesson: string;
}

export interface RecentVerseItem {
  bookKey: string;
  bookTitle: string;
  religion: ReligionType;
  divisionNum: number;
  divisionName: string;
  verseNumber: string | number;
  translation: string;
  timestamp: number;
}

export interface VerseCollection {
  id: string;
  userId: string;
  name: string;
  description?: string;
  createdAt?: any;
}

export interface CollectionVerseItem {
  id: string;
  collectionId: string;
  userId: string;
  bookKey: string;
  bookTitle: string;
  religion: ReligionType;
  divisionNum: number;
  divisionName: string;
  verseNumber: string | number;
  translation: string;
  originalText?: string;
  savedAt?: any;
}



