/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AlignedVerse {
  book: string;
  reference: string;
  religion: string;
  text: string;
  theme: string;
}

export const VERSE_ALIGNMENT_GROUPS: AlignedVerse[][] = [
  // Group 1: Returning Good for Evil / Active Compassion
  [
    {
      book: "Dhammapada",
      reference: "Chapter 1, Verse 5",
      religion: "buddhism",
      text: "Hatred is never appeased by hatred; it is appeased by love. This is an eternal law.",
      theme: "Conquering Evil with Good & Non-Retaliation"
    },
    {
      book: "Bhagavad Gita",
      reference: "Chapter 12, Verse 13",
      religion: "hinduism",
      text: "Be friendly, compassionate, and free from malicious intent toward all; patient, self-controlled, and with mind set on Me.",
      theme: "Conquering Evil with Good & Non-Retaliation"
    },
    {
      book: "Holy Bible",
      reference: "Romans 12:21",
      religion: "christianity",
      text: "Do not be overcome by evil, but overcome evil with good.",
      theme: "Conquering Evil with Good & Non-Retaliation"
    },
    {
      book: "Quran",
      reference: "Surah 41, Verse 34",
      religion: "islam",
      text: "The good deed and the evil deed cannot be equal. Repel evil with that which is better; then the one with whom you had enmity will become as if he were a close friend.",
      theme: "Conquering Evil with Good & Non-Retaliation"
    }
  ],
  // Group 2: The Golden Rule (Universal Reciprocity)
  [
    {
      book: "Holy Bible",
      reference: "Matthew 7:12",
      religion: "christianity",
      text: "So in everything, do to others what you would have them do to you, for this sums up the Law and the Prophets.",
      theme: "The Golden Rule & Empathy"
    },
    {
      book: "Sahih al-Bukhari",
      reference: "Book 2, Hadith 6 (An-Nawawi 13)",
      religion: "islam",
      text: "None of you truly believes until he loves for his brother what he loves for himself.",
      theme: "The Golden Rule & Empathy"
    },
    {
      book: "Mahabharata",
      reference: "Anushasana Parva 113.8",
      religion: "hinduism",
      text: "One should never do that to another which one regards as injurious to one's own self. This, in brief, is the rule of Dharma.",
      theme: "The Golden Rule & Empathy"
    },
    {
      book: "Dhammapada",
      reference: "Chapter 10, Verse 129",
      religion: "buddhism",
      text: "All tremble at violence; all fear death. Comparing oneself to others, one should not strike or cause to strike.",
      theme: "The Golden Rule & Empathy"
    },
    {
      book: "Talmud",
      reference: "Shabbat 31a (Hillel)",
      religion: "judaism",
      text: "What is hateful to you, do not do to your neighbor. This is the whole Torah; the rest is explanation. Go and learn it.",
      theme: "The Golden Rule & Empathy"
    },
    {
      book: "Analects of Confucius",
      reference: "Book 15, Verse 23",
      religion: "other",
      text: "Do not do to others what you do not want them to do to you.",
      theme: "The Golden Rule & Empathy"
    }
  ],
  // Group 3: Self-Conquest & Inner Mastery
  [
    {
      book: "Dhammapada",
      reference: "Chapter 8, Verse 103",
      religion: "buddhism",
      text: "Though one may conquer a thousand times a thousand men in battle, yet he indeed is the noblest victor who conquers himself.",
      theme: "Self-Conquest & Mind Control"
    },
    {
      book: "Bhagavad Gita",
      reference: "Chapter 6, Verse 6",
      religion: "hinduism",
      text: "For him who has conquered the mind, the mind is the best of friends; but for one who has failed to do so, his very mind will remain the greatest enemy.",
      theme: "Self-Conquest & Mind Control"
    },
    {
      book: "Tao Te Ching",
      reference: "Chapter 33",
      religion: "taoism",
      text: "He who knows others is wise; he who knows himself is enlightened. He who conquers others is strong; he who conquers himself is mighty.",
      theme: "Self-Conquest & Mind Control"
    },
    {
      book: "Holy Bible",
      reference: "Proverbs 16:32",
      religion: "christianity",
      text: "Better a patient person than a warrior, one with self-control than one who takes a city.",
      theme: "Self-Conquest & Mind Control"
    }
  ],
  // Group 4: Truth, Integrity, and Speech
  [
    {
      book: "Upanishads",
      reference: "Mundaka Upanishad 3.1.6",
      religion: "hinduism",
      text: "Truth alone triumphs, not untruth. By truth is laid out the path to the divine.",
      theme: "Truth, Integrity & Honest Speech"
    },
    {
      book: "Quran",
      reference: "Surah 9, Verse 119",
      religion: "islam",
      text: "O you who have believed, fear Allah and be with those who are true in word and deed.",
      theme: "Truth, Integrity & Honest Speech"
    },
    {
      book: "Holy Bible",
      reference: "Ephesians 4:25",
      religion: "christianity",
      text: "Therefore each of you must put off falsehood and speak truthfully to your neighbor, for we are all members of one body.",
      theme: "Truth, Integrity & Honest Speech"
    },
    {
      book: "Dhammapada",
      reference: "Chapter 17, Verse 223",
      religion: "buddhism",
      text: "Conquer anger by love. Conquer evil by good. Conquer the stingy by giving. Conquer the liar by truth.",
      theme: "Truth, Integrity & Honest Speech"
    }
  ]
];

// Simple token-based keyword extraction to search alignments offline
export function findMatchingAlignmentGroup(verseText: string): AlignedVerse[] | null {
  if (!verseText) return null;
  
  const textLower = verseText.toLowerCase();
  
  // Clean tokens (discarding small words and punctuation)
  const tokens = textLower
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(token => token.length > 3 && !["with", "this", "that", "their", "they", "them", "from", "your", "have"].includes(token));
  
  if (tokens.length === 0) return null;

  let bestGroup: AlignedVerse[] | null = null;
  let maxScore = 0;

  for (const group of VERSE_ALIGNMENT_GROUPS) {
    let groupScore = 0;
    
    for (const verse of group) {
      const verseTextLower = verse.text.toLowerCase();
      let matchCount = 0;
      
      for (const token of tokens) {
        if (verseTextLower.includes(token)) {
          matchCount++;
        }
      }
      
      // Calculate overlap ratio
      if (matchCount > groupScore) {
        groupScore = matchCount;
      }
    }

    // High enough match score (sharing at least 2 key terms)
    if (groupScore >= 2 && groupScore > maxScore) {
      maxScore = groupScore;
      bestGroup = group;
    }
  }

  return bestGroup;
}
