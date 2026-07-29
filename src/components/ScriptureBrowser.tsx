/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { SCRIPTURE_BOOKS, RELIGION_LABELS, RELIGION_COLORS } from "../scripturesRegistry";
import { ScriptureBook, ReligionType } from "../types";
import { Star, BookOpen, Compass, Sparkles, Headphones, Search, X, Calendar, ArrowRight, Layers, FolderTree, Loader2 } from "lucide-react";
import WordOfTheDayComponent from "./WordOfTheDay";
import { ReligiousIcon } from "./ReligiousIcon";
import { GitaFirestoreView } from "./GitaFirestoreView";
import { DynamicCanonNavigator } from "./DynamicCanonNavigator";
import { fetchMasterCanonsAndRoute, MasterCanonBook } from "../firebase";

// Canonical list of the 66 books of the Christian Bible with their chapter counts and common aliases/abbreviations
interface BibleBookMeta {
  name: string;
  key: "bible_ot" | "bible_nt";
  index: number; // 1 to 66
  chapters: number;
  aliases: string[];
}

const BIBLE_BOOKS: BibleBookMeta[] = [
  // --- OLD TESTAMENT (1 - 39) ---
  { name: "Genesis", key: "bible_ot", index: 1, chapters: 50, aliases: ["gen", "ge", "gn", "genesis"] },
  { name: "Exodus", key: "bible_ot", index: 2, chapters: 40, aliases: ["ex", "exo", "exod", "exodus"] },
  { name: "Leviticus", key: "bible_ot", index: 3, chapters: 27, aliases: ["lev", "le", "lv", "leviticus"] },
  { name: "Numbers", key: "bible_ot", index: 4, chapters: 36, aliases: ["num", "nu", "nm", "nb", "numbers"] },
  { name: "Deuteronomy", key: "bible_ot", index: 5, chapters: 34, aliases: ["deut", "de", "dt", "deuteronomy"] },
  { name: "Joshua", key: "bible_ot", index: 6, chapters: 24, aliases: ["josh", "jos", "jsh", "joshua"] },
  { name: "Judges", key: "bible_ot", index: 7, chapters: 21, aliases: ["judg", "jud", "jdg", "jgs", "judges"] },
  { name: "Ruth", key: "bible_ot", index: 8, chapters: 4, aliases: ["rut", "ru", "ruth"] },
  { name: "1 Samuel", key: "bible_ot", index: 9, chapters: 31, aliases: ["1 sam", "1 samuel", "1sam", "1sa", "1s", "i samuel", "i sam", "i sa", "i s"] },
  { name: "2 Samuel", key: "bible_ot", index: 10, chapters: 24, aliases: ["2 sam", "2 samuel", "2sam", "2sa", "2s", "ii samuel", "ii sam", "ii sa", "ii s"] },
  { name: "1 Kings", key: "bible_ot", index: 11, chapters: 22, aliases: ["1 kings", "1 kgs", "1kgs", "1ki", "1k", "i kings", "i kgs", "i ki", "i k"] },
  { name: "2 Kings", key: "bible_ot", index: 12, chapters: 25, aliases: ["2 kings", "2 kgs", "2kgs", "2ki", "2k", "ii kings", "ii kgs", "ii ki", "ii k"] },
  { name: "1 Chronicles", key: "bible_ot", index: 13, chapters: 29, aliases: ["1 chronicles", "1 chon", "1ch", "1chr", "i chronicles", "i chr", "i ch"] },
  { name: "2 Chronicles", key: "bible_ot", index: 14, chapters: 36, aliases: ["2 chronicles", "2 chon", "2ch", "2chr", "ii chronicles", "ii chr", "ii ch"] },
  { name: "Ezra", key: "bible_ot", index: 15, chapters: 10, aliases: ["ezra", "ezr", "ez"] },
  { name: "Nehemiah", key: "bible_ot", index: 16, chapters: 13, aliases: ["neh", "ne", "nehemiah"] },
  { name: "Esther", key: "bible_ot", index: 17, chapters: 10, aliases: ["esth", "est", "es", "esther"] },
  { name: "Job", key: "bible_ot", index: 18, chapters: 42, aliases: ["job", "jb"] },
  { name: "Psalms", key: "bible_ot", index: 19, chapters: 150, aliases: ["psalm", "ps", "pss", "psa", "psalms"] },
  { name: "Proverbs", key: "bible_ot", index: 20, chapters: 31, aliases: ["proverbs", "prov", "pro", "pr", "prv"] },
  { name: "Ecclesiastes", key: "bible_ot", index: 21, chapters: 12, aliases: ["ecclesiastes", "eccl", "ecc", "ec", "qoheleth"] },
  { name: "Song of Solomon", key: "bible_ot", index: 22, chapters: 8, aliases: ["song of songs", "song", "so", "canticles", "canticle", "song of solomon"] },
  { name: "Isaiah", key: "bible_ot", index: 23, chapters: 66, aliases: ["isaiah", "isa", "is"] },
  { name: "Jeremiah", key: "bible_ot", index: 24, chapters: 52, aliases: ["jeremiah", "jer", "je", "jr"] },
  { name: "Lamentations", key: "bible_ot", index: 25, chapters: 5, aliases: ["lamentations", "lam", "la"] },
  { name: "Ezekiel", key: "bible_ot", index: 26, chapters: 48, aliases: ["ezekiel", "ezek", "eze", "ezk"] },
  { name: "Daniel", key: "bible_ot", index: 27, chapters: 12, aliases: ["daniel", "dan", "da", "dn"] },
  { name: "Hosea", key: "bible_ot", index: 28, chapters: 14, aliases: ["hosea", "hos", "ho"] },
  { name: "Joel", key: "bible_ot", index: 29, chapters: 3, aliases: ["joel", "jl"] },
  { name: "Amos", key: "bible_ot", index: 30, chapters: 9, aliases: ["amos", "am"] },
  { name: "Obadiah", key: "bible_ot", index: 31, chapters: 1, aliases: ["obadiah", "obad", "ob"] },
  { name: "Jonah", key: "bible_ot", index: 32, chapters: 4, aliases: ["jonah", "jon", "jnh"] },
  { name: "Micah", key: "bible_ot", index: 33, chapters: 7, aliases: ["micah", "mic", "mc"] },
  { name: "Nahum", key: "bible_ot", index: 34, chapters: 3, aliases: ["nahum", "nah", "na"] },
  { name: "Habakkuk", key: "bible_ot", index: 35, chapters: 3, aliases: ["habakkuk", "hab", "hb"] },
  { name: "Zephaniah", key: "bible_ot", index: 36, chapters: 3, aliases: ["zephaniah", "zeph", "zep", "zp"] },
  { name: "Haggai", key: "bible_ot", index: 37, chapters: 2, aliases: ["haggai", "hag", "hg"] },
  { name: "Zechariah", key: "bible_ot", index: 38, chapters: 14, aliases: ["zechariah", "zech", "zec", "zc"] },
  { name: "Malachi", key: "bible_ot", index: 39, chapters: 4, aliases: ["malachi", "mal", "ml"] },

  // --- NEW TESTAMENT (40 - 66) ---
  { name: "Matthew", key: "bible_nt", index: 40, chapters: 28, aliases: ["matthew", "matt", "mat", "mt"] },
  { name: "Mark", key: "bible_nt", index: 41, chapters: 16, aliases: ["mark", "mrk", "mk"] },
  { name: "Luke", key: "bible_nt", index: 42, chapters: 24, aliases: ["luke", "luk", "lk"] },
  { name: "John", key: "bible_nt", index: 43, chapters: 21, aliases: ["john", "jhn", "jn"] },
  { name: "Acts", key: "bible_nt", index: 44, chapters: 28, aliases: ["acts", "act", "ac"] },
  { name: "Romans", key: "bible_nt", index: 45, chapters: 16, aliases: ["romans", "rom", "ro", "rm"] },
  { name: "1 Corinthians", key: "bible_nt", index: 46, chapters: 16, aliases: ["1 corinthians", "1 cor", "1cor", "1co", "i corinthians", "i cor", "i co"] },
  { name: "2 Corinthians", key: "bible_nt", index: 47, chapters: 13, aliases: ["2 corinthians", "2 cor", "2cor", "2co", "ii corinthians", "ii cor", "ii co"] },
  { name: "Galatians", key: "bible_nt", index: 48, chapters: 6, aliases: ["galatians", "gal", "ga"] },
  { name: "Ephesians", key: "bible_nt", index: 49, chapters: 6, aliases: ["ephesians", "eph", "ep"] },
  { name: "Philippians", key: "bible_nt", index: 50, chapters: 4, aliases: ["philippians", "phil", "php", "pp"] },
  { name: "Colossians", key: "bible_nt", index: 51, chapters: 4, aliases: ["colossians", "col", "co"] },
  { name: "1 Thessalonians", key: "bible_nt", index: 52, chapters: 5, aliases: ["1 thessalonians", "1 thess", "1 thes", "1thess", "1thes", "1th", "i thessalonians", "i thess", "i thes"] },
  { name: "2 Thessalonians", key: "bible_nt", index: 53, chapters: 3, aliases: ["2 thessalonians", "2 thess", "2 thes", "2thess", "2thes", "2th", "ii thessalonians", "ii thess", "ii thes"] },
  { name: "1 Timothy", key: "bible_nt", index: 54, chapters: 6, aliases: ["1 timothy", "1 tim", "1tim", "1ti", "1t", "i timothy", "i tim", "i ti", "i t"] },
  { name: "2 Timothy", key: "bible_nt", index: 55, chapters: 4, aliases: ["2 timothy", "2 tim", "2tim", "2ti", "2t", "ii timothy", "ii tim", "ii ti", "ii t"] },
  { name: "Titus", key: "bible_nt", index: 56, chapters: 3, aliases: ["titus", "tit", "ti", "tt"] },
  { name: "Philemon", key: "bible_nt", index: 57, chapters: 1, aliases: ["philemon", "philem", "phm", "pm"] },
  { name: "Hebrews", key: "bible_nt", index: 58, chapters: 13, aliases: ["hebrews", "heb", "he"] },
  { name: "James", key: "bible_nt", index: 59, chapters: 5, aliases: ["james", "jas", "jm"] },
  { name: "1 Peter", key: "bible_nt", index: 60, chapters: 5, aliases: ["1 peter", "1 pet", "1pet", "1pe", "1p", "i peter", "i pet", "i pe", "i p"] },
  { name: "2 Peter", key: "bible_nt", index: 61, chapters: 3, aliases: ["2 peter", "2 pet", "2pet", "2pe", "2p", "ii peter", "ii pet", "ii pe", "ii p"] },
  { name: "1 John", key: "bible_nt", index: 62, chapters: 5, aliases: ["1 john", "1 jhn", "1 jn", "1j", "i john", "i jhn", "i jn", "i j"] },
  { name: "2 John", key: "bible_nt", index: 63, chapters: 1, aliases: ["2 john", "2 jhn", "2 jn", "2j", "ii john", "ii jhn", "ii jn", "ii j"] },
  { name: "3 John", key: "bible_nt", index: 64, chapters: 1, aliases: ["3 john", "3 jhn", "3 jn", "3j", "iii john", "iii jhn", "iii jn", "iii j"] },
  { name: "Jude", key: "bible_nt", index: 65, chapters: 1, aliases: ["jude", "jud"] },
  { name: "Revelation", key: "bible_nt", index: 66, chapters: 22, aliases: ["revelation", "rev", "re", "rv", "apocalypse"] }
];

export function matchBook(prefix?: string, bookPart?: string): BibleBookMeta | undefined {
  const normBookPart = (bookPart || "").trim().toLowerCase();
  const standardizedPrefix = prefix ? (
    prefix.toLowerCase()
      .replace(/^1st$/, "1")
      .replace(/^2nd$/, "2")
      .replace(/^3rd$/, "3")
  ) : "";

  // Combine space-separated prefix and book part
  const fullSearch = (standardizedPrefix ? standardizedPrefix + " " : "") + normBookPart;
  const target = fullSearch.trim().replace(/\s+/g, " ");

  return BIBLE_BOOKS.find((b) => {
    return b.name.toLowerCase() === target || b.aliases.includes(target);
  });
}

export function getBookImage(book: ScriptureBook): { url: string; caption: string } {
  // Curated premium repositories representing official symbols, photo library assets, and pristine photography
  switch (book.key) {
    case "bhagavad_gita":
      return {
        url: "https://images.unsplash.com/photo-1615672924033-f111815e9ff0?auto=format&fit=crop&w=600&q=80",
        caption: "The sovereign sculpture of Lord Krishna playing his divine reed flute, representing the supreme teacher and guiding philosopher of the Gita."
      };
    case "ramayana":
      return {
        url: "https://images.unsplash.com/photo-1561361513-2d000a50f0db?auto=format&fit=crop&w=600&q=80",
        caption: "Gilded representation of Lord Rama, representing the path of righteousness and moral epics of the Ramayana."
      };
    case "upanishads":
      return {
        url: "https://images.unsplash.com/photo-1604881990409-b9f246db39da?auto=format&fit=crop&w=600&q=80",
        caption: "Traditional sacred OM symbol detailing nature and self, seeking non-dual Upanishadic truth."
      };
    case "quran":
      return {
        url: "https://image.shutterstock.com/image-photo/blue-mosque-sultan-ahmet-istanbul-260nw-1718228394.jpg",
        caption: "Symmetrical mosque domes and vaulted interiors, representing the divine cosmic order and the balance of Quranic wisdom."
      };
    case "hadith_bukhari":
      return {
        url: "https://image.shutterstock.com/image-photo/open-bible-holy-book-ancient-260nw-1830639521.jpg",
        caption: "Pristine detail of an illuminated sacred calligraphy book, symbolizing the preserved oral transmission and codification of Hadith."
      };
    case "bible_nt":
      return {
        url: "https://pluralism.org/files/pluralism/files/symbols/cross.png",
        caption: "The sacred Christian Cross, representing eternal grace, resurrection hope, and divine reconciliation in the New Testament."
      };
    case "bible_ot":
      return {
        url: "https://image.shutterstock.com/image-photo/interior-medieval-gothic-cathedral-glowing-260nw-2101348821.jpg",
        caption: "Gothic rose stained-glass windows filtering heavenly light in old stone arches, illustrating sacred stories of the covenants."
      };
    case "torah":
    case "tanakh":
      return {
        url: "https://pluralism.org/files/pluralism/files/symbols/star-of-david.png",
        caption: "The Magen David (Star of David) representing the shield, protective covenant, and enduring heritage of Israel."
      };
    case "talmud":
      return {
        url: "https://image.shutterstock.com/image-photo/western-wall-wailing-jerusalem-israel-260nw-1913988229.jpg",
        caption: "The historic limestone Western Wall in Jerusalem, where generations tuck written prayer petitions into ancient ashlar block seams."
      };
    case "dhammapada":
      return {
        url: "https://pluralism.org/files/pluralism/files/symbols/dharmawheel.png",
        caption: "The eight-spoked Buddhist Dharma Wheel (Dharmachakra), representing the Noble Path of cessation of suffering."
      };
    case "heart_sutra":
      return {
        url: "https://pluralism.org/files/pluralism/files/symbols/dharmawheel.png",
        caption: "The sacred Dharma Wheel, symbolizing transcendent wisdom and the realization of emptiness (Sunyata)."
      };
    case "tattvartha_sutra":
      return {
        url: "https://www.worldreligionsphotolibrary.com/images/gallery/jainism_ranakpur_pillars.jpg",
        caption: "Pristine white-marble carved columns of Ranakpur Dilwara Temples, representing absolute non-violence (Ahimsa)."
      };
    case "guru_granth":
      return {
        url: "https://www.worldreligionsphotolibrary.com/images/gallery/harmandir_sahib_amritsar.jpg",
        caption: "The absolute radiance of Sri Harmandir Sahib (the Golden Temple) reflecting in the Pool of Nectar under starlight."
      };
    case "tao_te_ching":
      return {
        url: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=600&q=80",
        caption: "Ethereal misty mountain ranges with winding paths, symbolizing flowing effortlessly with the eternal Tao (Wu Wei)."
      };
    case "poetic_edda":
      return {
        url: "https://images.unsplash.com/photo-1608988220025-a74ef43d463e?auto=format&fit=crop&w=600&q=80",
        caption: "Ancestral environmental runestones and cold high cliffs under starlight, housing Norse mythological secrets."
      };
    case "the_odyssey":
      return {
        url: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&w=600&q=80",
        caption: "The mathematical symmetry of classical Greek Doric columns pointing upward into clear bright skies."
      };
    case "mahabharata":
      return {
        url: "https://images.unsplash.com/photo-1615672924033-f111815e9ff0?auto=format&fit=crop&w=600&q=80",
        caption: "Traditional depictions of sages, seekers, and scholars gathering to learn the duties and moral struggles of the Mahabharata."
      };
    case "zafarnama":
      return {
        url: "https://pluralism.org/files/pluralism/files/symbols/khanda.png",
        caption: "The pristine sacred Sikh Khanda symbol, representing spiritual sovereignty and the letter of moral victory."
      };
    case "morte_arthur":
      return {
        url: "https://image.shutterstock.com/image-photo/interior-medieval-gothic-cathedral-glowing-260nw-2101348821.jpg",
        caption: "Classic Gothic arches illuminated by stained-glass window beams, representing holy knightly honor and chivalric quests."
      };
    case "epic_gilgamesh":
      return {
        url: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&w=600&q=80",
        caption: "Stately towering columns and ancient foundations, representing the epic history and achievements of King Gilgamesh."
      };
    case "homers_iliad":
      return {
        url: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&w=600&q=80",
        caption: "Classic Greek Doric columns and ancient temple lines standing through history, representing heroic epics of Ilium."
      };
    case "journey_west":
      return {
        url: "https://www.worldreligionsphotolibrary.com/images/gallery/epics-pilgrim-journey-monk.jpg",
        caption: "An epic pilgrimage across rugged ranges, representing the historic and mythological journey of Xuanzang to obtain sacred scriptures."
      };
    case "somnium":
      return {
        url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
        caption: "A cosmic vision of starlit nebulae and distant planetary orbits, representing Kepler's dream of lunar flight."
      };
    case "rigveda":
      return {
        url: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80",
        caption: "The sacred fire of Agni rising with chants from a Havan fire altar, representing Rigvedic daily solar devotion."
      };
    case "yajurveda":
      return {
        url: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80",
        caption: "A dynamic Vedic fire yajna altar ceremony, representing the ritual coordination and active fire offerings of the Yajurveda."
      };
    case "samaveda":
      return {
        url: "https://images.unsplash.com/photo-1604881990409-b9f246db39da?auto=format&fit=crop&w=600&q=80",
        caption: "The Supreme OM (Aum) Resonance, representing the musical sound-soul of the majestic Samavedic chants."
      };
    case "atharvaveda":
      return {
        url: "https://images.unsplash.com/photo-1604881990409-b9f246db39da?auto=format&fit=crop&w=600&q=80",
        caption: "Glowing OM symbol, denoting the herbal cures, environmental preservation, and daily chants of the Atharvaveda."
      };
    case "shahnameh":
      return {
        url: "https://images.unsplash.com/photo-1527126800417-a4dc8bc2b435?auto=format&fit=crop&w=600&q=80",
        caption: "Equestrian warriors and epic stone reliefs at Persepolis, evoking the crown jewels of Persian mythological cycles."
      };
    case "the_aeneid":
      return {
        url: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&w=600&q=80",
        caption: "High architectural columns of classical antiquity, symbolizing the epic establishing of Rome by Aeneas."
      };
    case "nibelungenlied":
      return {
        url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
        caption: "Ethereal pine forests shrouded in mountain fog, illustrating German heroic epics, betrayal, and destiny."
      };
    case "gesta_danorum":
      return {
        url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80",
        caption: "A gray, weathered stone castle tower overlooking coastal cliffs, evoking the dark, cold Denmark of Amleth's tragedy."
      };
    case "anabasis_alexander":
      return {
        url: "https://images.unsplash.com/photo-1503152394-c571994fd383?auto=format&fit=crop&w=600&q=80",
        caption: "A historical white classical Greek marble carving, evoking the world campaigns of Alexander of Macedon."
      };
    case "siva_chhatrapati":
      return {
        url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80",
        caption: "Scenic mountain passes of the rugged Western Ghats, reflecting the defensive forts and sovereignty of Chhatrapati Shivaji."
      };
    case "mewar_annals_pratap":
      return {
        url: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80",
        caption: "Sunset over Rajput fortress towers and ancient lakes, reflecting Maharana Pratap's unyielding epic loyalty."
      };
    case "commentarii_bello_gallico":
      return {
        url: "https://images.unsplash.com/photo-1516222338250-863216ce01fa?auto=format&fit=crop&w=600&q=80",
        caption: "Roman architectural columns standing tall against clear skies, representing Caesar's administrative speed."
      };
    case "lalitavistara":
      return {
        url: "https://pluralism.org/files/pluralism/files/symbols/dharmawheel.png",
        caption: "The sacred Dharma Wheel (Dharmachakra) from pluralism archives, representing the Buddhist path to deep awakening and cessation of suffering."
      };
    case "gospel_of_jesus_christ":
      return {
        url: "https://pluralism.org/files/pluralism/files/symbols/cross.png",
        caption: "The pristine Christian Cross, representing eternal grace, redemption, and reconciliation."
      };
    case "saga_ragnar_lothbrok":
      return {
        url: "https://images.unsplash.com/photo-1506458959157-965f8c07b9bb?auto=format&fit=crop&w=600&q=80",
        caption: "Viking ships navigating dark Northern fjords under a crisp sky, representing historical voyages."
      };
    case "hindu_prayers":
      return {
        url: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80",
        caption: "Vedic Fire Ceremony (Yajna), representing sacred offerings and the divine light of hymns."
      };
    case "islam_prayers":
      return {
        url: "https://www.worldreligionsphotolibrary.com/images/gallery/makkah_kaaba_dome.jpg",
        caption: "The holy Kaaba at Mecca, from world religion collections, representing the center of prayer orbits."
      };
    case "christian_prayers":
      return {
        url: "https://image.shutterstock.com/image-photo/candles-burning-front-holy-cross-260nw-1915903912.jpg",
        caption: "Devotional candles burning in front of the Holy Cross, representing quiet prayers and chants."
      };
    case "jewish_prayers":
      return {
        url: "https://pluralism.org/files/pluralism/files/symbols/star-of-david.png",
        caption: "The beautiful Star of David (Magen David) from world religion databases, representing the protection and covenant of Israel."
      };
    case "buddhist_prayers":
      return {
        url: "https://pluralism.org/files/pluralism/files/symbols/dharmawheel.png",
        caption: "The pristine Dharma Wheel (Dharmachakra) representing the Noble Path which leads to supreme peace."
      };
    case "sikh_prayers":
      return {
        url: "https://pluralism.org/files/pluralism/files/symbols/khanda.png",
        caption: "The sacred Khanda symbol from pluralism databases, representing the basic pillars of Sikhism."
      };
    case "jain_prayers":
      return {
        url: "https://www.worldreligionsphotolibrary.com/images/gallery/jainism_ranakpur_pillars.jpg",
        caption: "The white carved marble columns of Ranakpur Jain Temples, representing absolute non-violence (Ahimsa)."
      };
    default: {
      // Pattern-based mapping for any custom registry books to ensure fallback to premium repositories
      const r = (book.religion || "").toLowerCase();
      const k = (book.key || "").toLowerCase();
      
      // Use explicitly defined Shutterstock URLs first if present in registry
      if (book.imageUrl && book.imageUrl.includes("shutterstock.com")) {
        return { url: book.imageUrl, caption: book.imageCaption || "Canonical visualization representation." };
      }

      if (k.includes("gita") || k.includes("krishna") || k.includes("vishnu") || k.includes("matsya") || k.includes("kurma") || k.includes("vamana") || k.includes("garuda") || k.includes("bhagavata") || k.includes("narasingha") || k.includes("narasimha") || k.includes("sanatkumar") || k.includes("bhargava")) {
        return {
          url: "https://images.unsplash.com/photo-1615672924033-f111815e9ff0?auto=format&fit=crop&w=600&q=80",
          caption: book.imageCaption || "Sovereign illustration of Lord Krishna playing his divine flute, representing Bhakti."
        };
      }
      if (k.includes("shiva") || k.includes("kailash") || k.includes("linga") || k.includes("nandi") || k.includes("durvasa") || k.includes("skanda") || k.includes("nila") || k.includes("rakshasa")) {
        return {
          url: "https://images.unsplash.com/photo-1609137144813-94c632616238?auto=format&fit=crop&w=600&q=80",
          caption: book.imageCaption || "Sovereign rendering of Lord Shiva meditating peacefully against Mount Kailash peaks."
        };
      }
      if (k.includes("veda") || k.includes("fire") || k.includes("yajna") || k.includes("havan") || k.includes("agni") || k.includes("surya") || k.includes("samba") || k.includes("kapila") || k.includes("parashara") || k.includes("saur")) {
        return {
          url: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80",
          caption: book.imageCaption || "Traditional Vedic Fire Ceremony (Yajna), representing sacred offerings and the light of hymns."
        };
      }
      if (k.includes("devi") || k.includes("chandi") || k.includes("kali") || k.includes("shakti") || k.includes("mata") || k.includes("brahmaddhar") || k.includes("brihad")) {
        return {
          url: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=600&q=80",
          caption: book.imageCaption || "Sovereign illustration representing the protective divine weapons and armor of Goddess Durga."
        };
      }
      if (k.includes("ganesh") || k.includes("mudgala")) {
        return {
          url: "https://images.unsplash.com/photo-1604881990409-b9f246db39da?auto=format&fit=crop&w=600&q=80",
          caption: book.imageCaption || "The sacred sound representation of Lord Ganesha, remover of all obstacles."
        };
      }
      if (r === "hinduism") {
        return {
          url: "https://images.unsplash.com/photo-1604881990409-b9f246db39da?auto=format&fit=crop&w=600&q=80",
          caption: book.imageCaption || "The Supreme OM (Aum) Resonance, representing the source of cosmic vibration and Brahman."
        };
      }
      if (r === "islam") {
        if (k.includes("mecca")) {
          return {
            url: "https://www.worldreligionsphotolibrary.com/images/gallery/makkah_kaaba_dome.jpg",
            caption: book.imageCaption || "The holy Kaaba at Mecca, from world religion collections."
          };
        }
        return {
          url: "https://image.shutterstock.com/image-photo/blue-mosque-sultan-ahmet-istanbul-260nw-1718228394.jpg",
          caption: book.imageCaption || "The historic Sultan Ahmed Mosque domes under a peaceful sky."
        };
      }
      if (r === "christianity") {
        if (k.includes("cross")) {
          return {
            url: "https://pluralism.org/files/pluralism/files/symbols/cross.png",
            caption: book.imageCaption || "The sacred Christian Cross, representing eternal grace and reconciliation."
          };
        }
        return {
          url: "https://image.shutterstock.com/image-photo/interior-medieval-gothic-cathedral-glowing-260nw-2101348821.jpg",
          caption: book.imageCaption || "Stained glass of an ancient cathedral, casting red and blue light patterns."
        };
      }
      if (r === "judaism") {
        return {
          url: "https://image.shutterstock.com/image-photo/western-wall-wailing-jerusalem-israel-260nw-1913988229.jpg",
          caption: book.imageCaption || "The limestone courses of the Western Wall in Jerusalem."
        };
      }
      if (r === "buddhism") {
        return {
          url: "https://pluralism.org/files/pluralism/files/symbols/dharmawheel.png",
          caption: book.imageCaption || "The Pristine Dharma Wheel (Dharmachakra), representing the Noble Eightfold Path."
        };
      }
      if (r === "jainism") {
        return {
          url: "https://www.worldreligionsphotolibrary.com/images/gallery/jainism_ranakpur_pillars.jpg",
          caption: book.imageCaption || "Intricate white carved marble columns of Ranakpur Jain Temples, representing Ahimsa."
        };
      }
      if (r === "sikhism") {
        return {
          url: "https://pluralism.org/files/pluralism/files/symbols/khanda.png",
          caption: book.imageCaption || "The sacred Sikh Khanda symbol, representing the fundamental pillars of Sikhism."
        };
      }
      
      if (book.imageUrl) {
        return { url: book.imageUrl, caption: book.imageCaption || "Canonical visualization representation." };
      }
      return {
        url: "https://image.shutterstock.com/image-photo/open-bible-holy-book-ancient-260nw-1830639521.jpg",
        caption: "An open sacred book reflecting detailed calligraphic texts, representing the shared literary lineage of human wisdom."
      };
    }
  }
}

interface ScriptureBrowserProps {
  onSelectBook: (book: ScriptureBook, portionRef?: string, isAudioMode?: boolean) => void;
  onNavigateToTab?: (tab: string) => void;
  selectedReligion?: ReligionType | "all";
  onSelectReligion?: (religion: ReligionType | "all") => void;
  customImages?: { [key: string]: string };
  favorites?: any[];
  onToggleFavorite?: (book: ScriptureBook) => Promise<void>;
  onOpenManageBookmarks?: () => void;
}

export default function ScriptureBrowser({ 
  onSelectBook, 
  onNavigateToTab,
  selectedReligion: controlledReligion,
  onSelectReligion: controlledOnSelectReligion,
  customImages = {},
  favorites = [],
  onToggleFavorite,
  onOpenManageBookmarks
}: ScriptureBrowserProps) {
  const resolveBookImage = (b: ScriptureBook) => {
    if (customImages && customImages[b.key]) {
      return {
        url: customImages[b.key],
        caption: b.imageCaption || `Customized cover illustration for ${b.title}.`
      };
    }
    return getBookImage(b);
  };

  const [localSelectedReligion, setLocalSelectedReligion] = useState<ReligionType | "all">("all");
  const selectedReligion = controlledReligion !== undefined ? controlledReligion : localSelectedReligion;
  const setSelectedReligion = (religion: ReligionType | "all") => {
    if (controlledOnSelectReligion) {
      controlledOnSelectReligion(religion);
    } else {
      setLocalSelectedReligion(religion);
    }
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [lightboxBook, setLightboxBook] = useState<ScriptureBook | null>(null);

  // Dynamic Master Canons state from Firestore (interfaith-108)
  const [masterCanons, setMasterCanons] = useState<MasterCanonBook[]>([]);
  const [activeDynamicBook, setActiveDynamicBook] = useState<MasterCanonBook | null>(null);
  const [loadingCanons, setLoadingCanons] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    async function loadMasterCanons() {
      setLoadingCanons(true);
      try {
        const res = await fetchMasterCanonsAndRoute();
        if (isMounted && res && res.allCanons) {
          setMasterCanons(res.allCanons);
        }
      } catch (err) {
        console.warn("Notice: Could not load master canons from Firestore:", err);
      } finally {
        if (isMounted) setLoadingCanons(false);
      }
    }
    loadMasterCanons();
    return () => { isMounted = false; };
  }, []);

  // States for the newly added Bible chapters and verses Quick Jump shortcut
  const [bibleReference, setBibleReference] = useState("");
  const [bibleError, setBibleError] = useState("");
  const [selectedFirestoreBook, setSelectedFirestoreBook] = useState<"bhagavad_gita" | "rigveda" | "ramayana" | "mahabharata" | "yajurveda" | "mahapuranas">("bhagavad_gita");

  const handleSelectBookAction = (book: ScriptureBook, portionRef?: string, isAudioMode?: boolean) => {
  const isYajur = book.key.includes("yajurveda") || book.title.toLowerCase().includes("yajurveda");
  const isPurana = book.key.includes("purana") || book.title.toLowerCase().includes("purana") || book.key === "mahapuranas";
  if (isYajur || isPurana || ["bhagavad_gita","rigveda","ramayana","mahabharata","mahapuranas"].includes(book.key)) {
    setSelectedFirestoreBook(isYajur ? "yajurveda" : isPurana ? "mahapuranas" : book.key as any);
  }

  const liveData = masterCanons.find(mc => mc.key === book.key);
  const isMultiTier = liveData?.hierarchy_type === "multi_tier" || liveData?.hierarchy_type === "kandas_prashanas";
  if (isMultiTier && liveData) {
    setActiveDynamicBook(liveData);
  }

  onSelectBook(book, portionRef, isAudioMode);
};

  const handleBibleJump = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setBibleError("");
    const trimmed = bibleReference.trim();
    if (!trimmed) {
      setBibleError("Please enter a reference.");
      return;
    }

    // Match something like "1 Corinthians 13:4" or "John 3:16" or "James 1"
    const regex = /^\s*(?:([123]|i{1,3})\s+)?([a-zA-Z\s]+?)\s*(\d+)(?:\s*[:\s]\s*(\d+))?\s*$/i;
    const match = trimmed.match(regex);
    if (!match) {
      setBibleError("Invalid format. Try e.g. 'John 3:16' or 'Genesis 1'");
      return;
    }

    const prefix = match[1];
    const bookPart = match[2];
    const chapterNum = parseInt(match[3], 10);
    const verseNum = match[4]; // optional string

    // Query standard Bible books dictionary
    const matchedBook = matchBook(prefix, bookPart);
    if (!matchedBook) {
      setBibleError(`Could not find Bible book for "${prefix ? prefix + ' ' : ''}${bookPart}".`);
      return;
    }

    if (chapterNum < 1 || chapterNum > matchedBook.chapters) {
      setBibleError(`"${matchedBook.name}" only has chapters 1 to ${matchedBook.chapters}.`);
      return;
    }

    // Retrieve base ScriptureBook from pre-registered canons lists
    const baseBook = SCRIPTURE_BOOKS.find(item => item.key === matchedBook.key);
    if (!baseBook) {
      setBibleError("Scripture metadata not matching registry.");
      return;
    }

    // Build specialized ScriptureBook dynamic instance
    const customBook: ScriptureBook = {
      ...baseBook,
      title: `${matchedBook.name}`,
      divisionsName: verseNum ? `Chapter ${chapterNum}, Verse ${verseNum}` : "Chapter",
      divisionsCount: matchedBook.chapters,
      description: `The sacred book of ${matchedBook.name} from the Christian Bible canon. Selected portion: Chapter ${chapterNum}${verseNum ? `, Verse ${verseNum}` : ""}.`,
    };

    // Trigger selected book context loading
    onSelectBook(customBook, String(chapterNum));
  };

  const filteredBooks = SCRIPTURE_BOOKS.filter((b) => {
    const matchesReligion = selectedReligion === "all" || b.religion === selectedReligion;
    const matchesKeyword = searchQuery.trim() === "" ||
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.originalTitle && b.originalTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      RELIGION_LABELS[b.religion].toLowerCase().includes(searchQuery.toLowerCase());
    return matchesReligion && matchesKeyword;
  });

  return (
    <div className="space-y-8 animate-fade-in text-slate-200">
      {/* Intro and Info Panel */}
      <div className="bg-gradient-to-br from-stone-900/60 to-[#0c0c10] border border-white/10 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-[0.03] pointer-events-none">
          <BookOpen className="w-96 h-96" />
        </div>
        <div className="max-w-3xl space-y-4 relative z-10">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>AI-Guided Comparative Scripture Platform</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-light tracking-tight text-white">
            Explore Sacred Wisdom of the World
          </h2>
          <p className="text-slate-300 font-serif leading-relaxed text-sm sm:text-base">
            Throughout history, humanity has written its highest truths upon the parchment of sacred books.
            This open-access interfaith platform maps scripture across major traditions—fostering mutual reverence,
            uncovering universal ethical guidelines, and providing live scholarship powered by generative intelligence.
          </p>
        </div>
      </div>

      {/* SCRIPTURE WORD OF THE DAY */}
      <WordOfTheDayComponent />

      {/* QUICK-ACCESS BOOKMARKS SHELF */}
      {favorites && favorites.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/5 to-orange-500/5 border border-amber-500/10 rounded-2xl p-5 space-y-4 shadow-lg animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
              <h3 className="text-sm font-semibold text-white tracking-wide font-sans">
                Quick-Access Bookmarks Shelf
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono bg-amber-500/15 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-full font-bold">
                {favorites.length} {favorites.length === 1 ? "Book" : "Books"} pinned
              </span>
              {onOpenManageBookmarks && (
                <button
                  id="manage-bookmarks-trigger"
                  onClick={onOpenManageBookmarks}
                  className="text-[10px] font-mono bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 px-2.5 py-0.5 rounded-full font-bold hover:text-amber-200 transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>Manage</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {favorites.map((fav) => {
              const book = SCRIPTURE_BOOKS.find((b) => b.key === fav.itemKey);
              if (!book) return null;
              const bookImg = resolveBookImage(book);
              return (
                <div
                  id={`shelf-item-${book.key}`}
                  key={book.key}
                  className="flex-shrink-0 w-64 bg-[#0a0a0f] border border-white/5 hover:border-amber-500/30 rounded-xl p-3 flex items-center gap-3 transition-all duration-200 group relative shadow-md"
                >
                  <div className="w-14 h-16 rounded-lg overflow-hidden shrink-0 bg-white/5">
                    <img
                      src={bookImg.url}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80";
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <span className="text-[9px] font-mono uppercase bg-amber-500/10 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/20 block w-max">
                      {RELIGION_LABELS[book.religion]}
                    </span>
                    <h4 className="text-xs font-semibold text-slate-100 truncate group-hover:text-amber-400 transition-colors">
                      {book.title}
                    </h4>
                    <div className="flex items-center gap-1.5">
                      <button
                        id={`shelf-open-${book.key}`}
                        onClick={() => handleSelectBookAction(book)}
                        className="text-[9px] font-mono font-bold bg-amber-500 hover:bg-amber-400 text-black px-2 py-0.5 rounded transition-all cursor-pointer"
                      >
                        Read
                      </button>
                      <button
                        id={`shelf-audio-${book.key}`}
                        onClick={() => handleSelectBookAction(book, undefined, true)}
                        className="text-[9px] font-mono font-bold bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-black px-2 py-0.5 rounded transition-all cursor-pointer border border-emerald-500/20 hover:border-transparent"
                      >
                        Listen
                      </button>
                    </div>
                  </div>
                  {/* Unpin button */}
                  <button
                    id={`shelf-unpin-${book.key}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite?.(book);
                    }}
                    className="absolute top-2 right-2 p-1 rounded-md bg-stone-900/80 hover:bg-rose-950/50 hover:text-rose-400 text-slate-400 border border-white/5 transition-colors cursor-pointer"
                    title="Unpin from Shelf"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Search and Filters Panel */}
      <div className="bg-gradient-to-r from-stone-900/40 to-stone-900/60 border border-white/10 rounded-2xl p-5 flex flex-col xl:flex-row gap-5 items-center justify-between">
        <div className="space-y-3 w-full xl:w-auto flex-1">
          <label className="text-xs font-mono text-slate-400 uppercase tracking-widest block font-bold">
            Filter Library by Faith Tradition
          </label>
          <div className="flex flex-wrap gap-1.5">
            <button
              id="tab-all"
              onClick={() => setSelectedReligion("all")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 border cursor-pointer ${
                selectedReligion === "all"
                  ? "bg-amber-500 text-black border-amber-500 shadow-md shadow-amber-950/20"
                  : "bg-white/5 text-slate-300 border-white/10 hover:border-white/20 hover:bg-white/10"
              }`}
            >
              All Canons
            </button>
            {(Object.keys(RELIGION_LABELS) as ReligionType[]).map((religion) => {
              const isSelected = selectedReligion === religion;
              return (
                <button
                  id={`tab-${religion}`}
                  key={religion}
                  onClick={() => setSelectedReligion(religion)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 border cursor-pointer ${
                    isSelected
                      ? "bg-amber-500 text-black border-amber-500 shadow-md shadow-amber-950/20"
                      : "bg-white/5 text-slate-300 border-white/10 hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  {RELIGION_LABELS[religion]}
                </button>
              );
            })}
            <div className="w-[1.5px] h-5 bg-white/15 self-center hidden sm:block mx-1" />
            <button
              id="tab-system-festivals"
              onClick={() => onNavigateToTab?.("festivals")}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/20 hover:text-white transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-sm shadow-emerald-950/10"
              title="Open the Interactive Sacred Calendar & Lunar Tracker"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Sacred Festivals & Fasts</span>
            </button>
          </div>
        </div>

        {/* Search Inputs Container */}
        <div className="w-full xl:w-auto flex flex-col sm:flex-row gap-4 shrink-0">
          {/* Search input box */}
          <div className="w-full sm:w-64 space-y-2 shrink-0">
            <label className="text-xs font-mono text-slate-400 uppercase tracking-widest block font-bold font-sans">
              Search Scripture Canon
            </label>
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                id="scriptures-library-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search books, terms, descriptions..."
                className="w-full bg-[#0d0d12] border border-white/10 rounded-xl py-2 pl-10 pr-9 text-xs sm:text-sm focus:outline-none focus:border-amber-500 text-slate-200 placeholder-slate-500 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Bible Reference Quick Jump Shortcut box */}
          <div className="w-full sm:w-64 space-y-2 shrink-0">
            <label className="text-xs font-mono text-slate-400 uppercase tracking-widest block font-bold font-sans">
              Bible Reference Jump
            </label>
            <div>
              <form onSubmit={handleBibleJump} className="relative w-full flex gap-2">
                <div className="relative flex-1">
                  <BookOpen className="absolute left-3.5 top-2.5 w-4 h-4 text-amber-500/80" />
                  <input
                    type="text"
                    id="bible-quick-jump-search"
                    value={bibleReference}
                    onChange={(e) => {
                      setBibleReference(e.target.value);
                      if (bibleError) setBibleError("");
                    }}
                    placeholder="John 3:16 or Genesis 1..."
                    className="w-full bg-[#0d0d12] border border-white/10 rounded-xl py-2 pl-10 pr-9 text-xs sm:text-sm focus:outline-none focus:border-amber-500 text-slate-200 placeholder-slate-500 font-medium"
                  />
                  {bibleReference && (
                    <button
                      type="button"
                      onClick={() => {
                        setBibleReference("");
                        setBibleError("");
                      }}
                      className="absolute right-3 top-2 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-bold flex items-center justify-center transition-all cursor-pointer shadow-md shadow-amber-950/15 shrink-0"
                  title="Go to Bible Reference"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
              {/* Dynamic Error Indicator */}
              {bibleError && (
                <p className="text-[10px] text-red-400 mt-1 animate-pulse font-medium max-w-xs leading-none">
                  {bibleError}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* DYNAMIC CANON NAVIGATOR OVERLAY FOR MULTI-TIER BOOKS */}
      {activeDynamicBook && (
        <div className="mb-8">
          <DynamicCanonNavigator
            book={activeDynamicBook}
            onClose={() => setActiveDynamicBook(null)}
          />
        </div>
      )}

      {/* FIRESTORE SCRIPTURE VIEWER (BHAGAVAD GITA, YAJURVEDA, RIGVEDA, RAMAYANA, MAHABHARATA) */}
      {(selectedReligion === "hinduism" || selectedReligion === "all") && (
        <GitaFirestoreView 
          selectedBook={selectedFirestoreBook}
          onSelectBook={setSelectedFirestoreBook}
          onReadInDesk={(bookKey, divNum) => {
            const baseBook = SCRIPTURE_BOOKS.find(b => b.key === bookKey);
            if (baseBook) {
              onSelectBook(baseBook, String(divNum));
            }
          }}
        />
      )}

      {/* ALL CANONS MASTER REGISTRY (DYNAMIC FIRESTORE SCHEMAS) */}
      {selectedReligion === "all" && masterCanons.length > 0 && (
        <div className="bg-[#0e0e14] border border-amber-500/20 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4 my-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/25 rounded-xl text-amber-400">
                <FolderTree className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                  <span>All Canons Master Registry</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold uppercase">
                    Firestore interfaith-108
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Metadata-driven hierarchy navigation across all traditions (flat chapters, 2-tier, and 3-tier Kandas & Prashanas).
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {masterCanons.map((mc) => {
              const hType = mc.hierarchy_type || "chapters";
              const isMultiTier = hType === "kandas_prashanas" || hType === "multi_tier" || (mc.branches && mc.branches.length > 0);
              return (
                <div
                  key={mc.id}
                  onClick={() => {
                    const isYajur = mc.key.includes("yajurveda") || mc.title.toLowerCase().includes("yajurveda");
                    const isPurana = mc.key.includes("purana") || mc.title.toLowerCase().includes("purana") || mc.key === "mahapuranas";
                    if (isYajur) {
                      setSelectedFirestoreBook("yajurveda");
                    } else if (isPurana) {
                      setSelectedFirestoreBook("mahapuranas");
                    }
                    setActiveDynamicBook(mc);
                  }}
                  className="p-3.5 bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-amber-500/40 rounded-xl transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span className="uppercase text-amber-400 font-bold">{mc.religion}</span>
                      <span className={`px-2 py-0.5 rounded uppercase font-bold text-[9px] ${
                        isMultiTier ? "bg-purple-500/15 text-purple-300 border border-purple-500/30" : "bg-blue-500/15 text-blue-300 border border-blue-500/30"
                      }`}>
                        {isMultiTier ? "Kandas & Prashanas" : hType}
                      </span>
                    </div>
                    <h4 className="text-sm font-serif font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                      {mc.title}
                    </h4>
                    {mc.branches && mc.branches.length > 0 && (
                      <div className="text-[11px] text-amber-400/80 font-mono flex items-center gap-1">
                        <Layers className="w-3 h-3 text-amber-400" />
                        <span>Branches: {mc.branches.join(", ")}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400 group-hover:text-amber-300">
                    <span>Explore Canon Tree</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Books Display Grid or Empty State */}
      {filteredBooks.length === 0 ? (
        <div className="py-16 text-center bg-white/[0.01] border border-dashed border-white/10 rounded-2xl">
          <Search className="w-10 h-10 text-slate-600 mx-auto mb-3 animate-pulse" />
          <h3 className="font-serif text-lg text-slate-200">No scripture canons found</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
            We couldn't find any books matching &ldquo;{searchQuery}&rdquo;. Try modifying your search keywords or switching traditions.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedReligion("all");
            }}
            className="mt-4 px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-semibold text-slate-300 transition-all cursor-pointer"
          >
            Clear Search Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredBooks.map((book) => {
          const bookImg = resolveBookImage(book);
          const isBookmarked = favorites ? favorites.some((f) => f.itemKey === book.key) : false;
          const liveData = masterCanons.find(mc => mc.key === book.key);
          const displayCount = liveData?.chapterCount ?? book.divisionsCount;
          const displayDivisionName = liveData ? "Chapter" : book.divisionsName;
          return (
            <div
              id={`book-card-${book.key}`}
              key={book.key}
              className="bg-white/[0.03] border border-white/10 hover:border-amber-500/40 hover:bg-white/[0.06] hover:shadow-xl hover:shadow-black/50 rounded-xl transition-all duration-300 flex flex-col justify-between group overflow-hidden"
            >
              {/* IMAGE HEADER */}
              <div 
                className="relative h-44 overflow-hidden cursor-zoom-in group"
                onClick={() => setLightboxBook(book)}
              >
                <img 
                  src={bookImg.url} 
                  alt={book.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80";
                  }}
                />
                {/* Overlay shadow gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/20 to-transparent"></div>
                
                {/* Floating Bookmark/Pin Star Button */}
                <button
                  id={`bookmark-btn-${book.key}`}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent opening the lightbox
                    onToggleFavorite?.(book);
                  }}
                  className={`absolute top-3 right-3 p-2 rounded-full border transition-all duration-200 backdrop-blur-sm shadow-md hover:scale-110 cursor-pointer z-10 ${
                    isBookmarked
                      ? "bg-amber-500 text-black border-amber-500 shadow-amber-500/10"
                      : "bg-black/60 hover:bg-black/85 text-white/80 hover:text-white border-white/10"
                  }`}
                  title={isBookmarked ? "Remove Bookmark" : "Add to Bookmarks Shelf"}
                >
                  <Star className={`w-3.5 h-3.5 ${isBookmarked ? "fill-black" : ""}`} />
                </button>

                {/* Quick-zoom label cover inside corner */}
                <span className="absolute bottom-3 right-3 bg-black/85 hover:bg-black p-1.5 px-2.5 rounded-lg text-[10px] text-amber-400 border border-white/10 transition-colors flex items-center gap-1.5 font-mono shadow-lg">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Sacred Image</span>
                </span>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Book Header Label */}
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-white/10 bg-white/5 text-amber-300 inline-flex items-center gap-1.5"
                    >
                      <ReligiousIcon bookKey={book.key} religion={book.religion} className="w-3.5 h-3.5" />
                      <span>{RELIGION_LABELS[book.religion]}</span>
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {displayCount} {displayDivisionName}s
                    </span>
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className={`text-xl sm:text-2xl font-serif font-bold text-white group-hover:text-amber-400 transition-colors inline-flex items-center gap-2.5 ${/[\u0900-\u097F]/.test(book.title) ? "leading-relaxed" : "leading-snug"}`}>
                      <ReligiousIcon bookKey={book.key} religion={book.religion} className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                      <span>{book.title}</span>
                    </h3>
                    {book.originalTitle && (
                      <span className={`text-sm block mt-0.5 ml-1 italic font-light ${
                        /[\u0900-\u097F]/.test(book.originalTitle) ? "font-hindi text-slate-400/90 leading-relaxed py-0.5" : "font-serif text-slate-400"
                      }`}>
                        {book.originalTitle}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-serif">
                    {book.description}
                  </p>

                  {/* Curated Portions */}
                  {book.featuredPortions && book.featuredPortions.length > 0 && (
                    <div className="bg-black/40 rounded-lg p-4 space-y-2.5 border border-white/5">
                      <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1.5 font-bold">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400 animate-pulse" /> Suggested Study Portions
                      </span>
                      <div className="space-y-2 text-xs">
                        {book.featuredPortions.map((portion, idx) => (
                          <button
                            id={`suggested-btn-${book.key}-${idx}`}
                            key={idx}
                            onClick={() => handleSelectBookAction(book, portion.reference)}
                            className="w-full text-left p-2.5 rounded-md hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors block group cursor-pointer"
                          >
                            <div className="font-medium text-slate-200 flex items-center justify-between group-hover:text-amber-300">
                              <span>{portion.name}</span>
                              <span className="text-[10px] text-amber-400/70 group-hover:text-amber-300 font-mono">
                                Quick-Read &rarr;
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5 italic leading-tight">
                              {portion.topicMessage}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action */}
                <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center space-x-1.5 text-[10px] uppercase font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Knowledge Source</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      id={`audio-btn-${book.key}`}
                      onClick={() => handleSelectBookAction(book, undefined, true)}
                      className="px-3 py-2 rounded-lg text-xs font-semibold shadow-sm flex items-center space-x-1.5 cursor-pointer transition-all bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                      title="Listen in Audio Mode"
                    >
                      <Headphones className="w-3.5 h-3.5" />
                      <span>Audio Mode</span>
                    </button>
                    <button
                      id={`read-btn-${book.key}`}
                      onClick={() => handleSelectBookAction(book)}
                      className="px-4 py-2 rounded-lg text-xs font-semibold shadow-md flex items-center space-x-1 cursor-pointer transition-all bg-amber-500 text-black hover:bg-amber-400 hover:shadow-amber-500/10"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Begin Reading</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* BOOK LIGHTBOX MODAL */}
      {lightboxBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0c0c10] border border-amber-500/30 max-w-2xl w-full rounded-2xl overflow-hidden relative shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Full-width image header */}
            <div className="relative h-80 sm:h-96 w-full shrink-0">
              <img
                src={resolveBookImage(lightboxBook).url}
                alt={lightboxBook.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c10] via-[#0c0c10]/30 to-transparent"></div>
              
              {/* Close Button */}
              <button
                onClick={() => setLightboxBook(null)}
                className="absolute top-4 right-4 bg-black/80 hover:bg-black text-slate-300 hover:text-white p-2 rounded-full border border-white/10 transition-colors cursor-pointer"
              >
                <span className="text-lg font-bold block px-2 leading-none">&times;</span>
              </button>
            </div>

            {/* Core Info & Scholarly Caption */}
            <div className="p-6 sm:p-8 space-y-4 overflow-y-auto">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-full font-bold inline-flex items-center gap-1.5">
                  <ReligiousIcon bookKey={lightboxBook.key} religion={lightboxBook.religion} className="w-3.5 h-3.5" />
                  <span>{RELIGION_LABELS[lightboxBook.religion]}</span>
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-2 flex items-center gap-2.5">
                  <ReligiousIcon bookKey={lightboxBook.key} religion={lightboxBook.religion} className="w-7 h-7 shrink-0" />
                  <span>{lightboxBook.title}</span>
                </h3>
                {lightboxBook.originalTitle && (
                  <p className={`text-base mt-0.5 italic ${
                    /[\u0900-\u097F]/.test(lightboxBook.originalTitle) ? "font-hindi text-amber-200/80 leading-relaxed py-0.5" : "font-serif text-amber-200/60"
                  }`}>
                    {lightboxBook.originalTitle}
                  </p>
                )}
              </div>

              {/* Visual Symbolism Explanation */}
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-amber-500 font-bold tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Interactive Artwork Symbolism
                </span>
                <p className="text-xs sm:text-sm font-serif italic text-slate-200 leading-relaxed">
                  &ldquo;{resolveBookImage(lightboxBook).caption}&rdquo;
                </p>
              </div>

              {/* Scholarly summary */}
              <p className="text-xs sm:text-sm font-serif text-slate-300 leading-relaxed">
                {lightboxBook.description}
              </p>

              {/* Begin Reading shortcut button */}
              <div className="pt-2 flex flex-wrap justify-end gap-3.5">
                {/* Dynamic Lightbox Bookmark button */}
                <button
                  onClick={() => {
                    onToggleFavorite?.(lightboxBook);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer border ${
                    favorites && favorites.some((f) => f.itemKey === lightboxBook.key)
                      ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/30"
                      : "bg-white/5 hover:bg-white/10 text-slate-300 border-white/10"
                  }`}
                  title={favorites && favorites.some((f) => f.itemKey === lightboxBook.key) ? "Remove Bookmark" : "Add Bookmark"}
                >
                  <Star className={`w-4 h-4 ${favorites && favorites.some((f) => f.itemKey === lightboxBook.key) ? "fill-amber-400 text-amber-400" : "text-slate-400"}`} />
                  <span>{favorites && favorites.some((f) => f.itemKey === lightboxBook.key) ? "Bookmarked" : "Bookmark"}</span>
                </button>

                <button
                  onClick={() => {
                    handleSelectBookAction(lightboxBook, undefined, true);
                    setLightboxBook(null);
                  }}
                  className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/25 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <Headphones className="w-4 h-4 text-emerald-400" />
                  <span>Audio Mode</span>
                </button>
                <button
                  onClick={() => {
                    handleSelectBookAction(lightboxBook);
                    setLightboxBook(null);
                  }}
                  className="bg-amber-500 hover:bg-amber-400 text-black px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-lg transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Begin Reading Canon Text</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

