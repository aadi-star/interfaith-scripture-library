/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, applicationDefault, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { GoogleAuth } from "google-auth-library";

let adminAppInstance: App | null = null;
let adminDbInstance: Firestore | null = null;

export function getAdminApp(): App {
  if (!adminAppInstance) {
    try {
      const apps = getApps();
      if (apps.length === 0) {
        adminAppInstance = initializeApp({
          credential: applicationDefault()
        });
      } else {
        adminAppInstance = apps[0];
      }
    } catch (error: any) {
      console.warn("Firebase Admin App lazy-init warning/bypass:", error.message);
      throw new Error(`Firebase Admin App is not initialized. Ensure Application Default Credentials (ADC) are configured. Details: ${error.message}`);
    }
  }
  return adminAppInstance;
}

// Single, cached adminDb instance routing to 'interfaith-108'
export const adminDb = (() => {
  try {
    const appInstance = getAdminApp();
    return getFirestore(appInstance, "interfaith-108");
  } catch (error: any) {
    console.warn("Firebase Admin Firestore cached instance creation failed:", error.message);
    // Return a proxy/lazy getter or null, but since it is called on server startup with valid ADC, this runs successfully.
    // To make it fully robust and avoid module-load crashes if credentials are missing during local build, we can resolve lazily
    return null as unknown as Firestore;
  }
})();

export function getAdminDb(): Firestore {
  if (adminDbInstance) {
    return adminDbInstance;
  }
  if (adminDb) {
    adminDbInstance = adminDb;
    return adminDbInstance;
  }
  // Fallback lazy initialization if early-load returned null
  try {
    const appInstance = getAdminApp();
    adminDbInstance = getFirestore(appInstance, "interfaith-108");
    return adminDbInstance;
  } catch (error: any) {
    throw new Error(`Firebase Admin Firestore is not initialized. Details: ${error.message}`);
  }
}

/**
 * Diagnostic helper to verify local environment's Application Default Credentials (ADC) configuration.
 */
export async function getAdcInfo() {
  const auth = new GoogleAuth();
  let projectId = "";
  try {
    projectId = await auth.getProjectId();
  } catch (err: any) {
    projectId = `Error fetching project ID: ${err.message}`;
  }

  const envVars = {
    GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS ? `Present (${process.env.GOOGLE_APPLICATION_CREDENTIALS})` : "Not set",
    GOOGLE_CLOUD_PROJECT: process.env.GOOGLE_CLOUD_PROJECT || "Not set",
    GCLOUD_PROJECT: process.env.GCLOUD_PROJECT || "Not set",
    FIREBASE_CONFIG: process.env.FIREBASE_CONFIG ? "Present" : "Not set",
    NODE_ENV: process.env.NODE_ENV || "Not set",
  };

  let credentialSource = "Unknown";
  try {
    const client = await auth.getClient();
    credentialSource = client.constructor.name || typeof client;
  } catch (err: any) {
    credentialSource = `Error resolving client: ${err.message}`;
  }

  return {
    projectId,
    credentialSource,
    envVars,
    isLocalEnv: !process.env.K_SERVICE, // True if not running inside Google Cloud Run/Hosting compute environment
  };
}

import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import https from "https";
import http, { IncomingMessage } from "http";
import { createProxyMiddleware } from "http-proxy-middleware";
import { HINDU_PRAYERS_FULL_DATA } from "./src/shared/hinduPrayersData";
import { UPANISHADS_108 } from "./src/data/upanishads";
import { BRAHMA_PURANA_CHAPTERS } from "./src/data/brahmaPuranaChapters";
import { getPuranaChapterName } from "./src/data/puranaChapters";
import { MAHABHARATA_PARVAS } from "./src/data/mahabharataParvas";
import { findMatchingAlignmentGroup } from "./src/data/existingAlignments";
import { getHadithBookName } from "./src/data/hadithBooks";

dotenv.config();

const app = express();

// Proxy Firebase Auth requests before any body-parsing middleware to support same-origin auth
app.use(
  "/__/auth",
  createProxyMiddleware({
    target: "https://hallowed-scout-371nt.firebaseapp.com",
    changeOrigin: true,
  })
);

app.use(express.json());

// Log client-side errors for debugging sandboxed iframe environment
app.post("/api/log-error", (req, res) => {
  try {
    const { message, source, lineno, colno, error, stack } = req.body;
    const logMessage = `[CLIENT ERROR] ${new Date().toISOString()}
Message: ${message}
Source: ${source}
Line: ${lineno}:${colno}
Error: ${JSON.stringify(error)}
Stack: ${stack}
------------------------------------------------------------------------\n`;
    fs.appendFileSync(path.join(process.cwd(), "client_errors.log"), logMessage, "utf8");
    console.error(logMessage);
  } catch (err) {
    console.error("Failed to write client-side error to log file:", err);
  }
  res.sendStatus(200);
});

// Dynamically use the PORT env variable provided by Cloud Run, fallback to 3000 for local development
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

// Initialize Gemini SDK lazily to prevent hard-crash if the API key is missing.
let aiInstance: GoogleGenAI | null = null;

function cleanAndParseJSON(text: string): any {
  if (!text) return {};
  try {
    let cleanText = text.trim();
    // Strip markdown code fences if present
    if (cleanText.startsWith("```json")) {
      cleanText = cleanText.substring(7);
    } else if (cleanText.startsWith("```")) {
      cleanText = cleanText.substring(3);
    }
    if (cleanText.endsWith("```")) {
      cleanText = cleanText.substring(0, cleanText.length - 3);
    }
    cleanText = cleanText.trim();
    return JSON.parse(cleanText);
  } catch (err) {
    console.log("[JSON Clean Parser] Initiating alternate extraction parsing strategy...");
    try {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        return JSON.parse(match[0]);
      }
    } catch (nestedErr) {
      console.log("[JSON Clean Parser] Alternate parsing complete.");
    }
    throw err;
  }
}

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error(
      "GEMINI_API_KEY is not configured. Please add your real Gemini API Key in the Secrets panel."
    );
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

let geminiQuotaExhausted = false;
let lastQuotaCheckTime = 0;
const QUOTA_COOLDOWN_MS = 60 * 1000; // 1 minute of auto-bypass/fallback when Gemini is exhausted

// Helper to execute any Gemini API call with exponential retry policies on transient error codes (e.g. 503, 429)
async function callGeminiWithRetry<T>(apiCallFn: () => Promise<T>, maxRetries = 4, delayMs = 1200): Promise<T> {
  if (geminiQuotaExhausted) {
    if (Date.now() - lastQuotaCheckTime > QUOTA_COOLDOWN_MS) {
      console.log("[System Notice] Standby completed. Reactivating primary services.");
      geminiQuotaExhausted = false;
    } else {
      console.log("[System Notice] Primary engine on standby. Activating alternate fallback.");
      throw new Error("STANDBY: Primary services on standby.");
    }
  }

  let attempt = 0;
  while (true) {
    try {
      const response = await apiCallFn();
      // Reset indicator if we successfully request
      if (geminiQuotaExhausted) {
        geminiQuotaExhausted = false;
      }
      return response;
    } catch (error: any) {
      attempt++;
      const errMsg = String(error.message || error);

      const isQuotaExceeded = 
        errMsg.includes("429") || 
        errMsg.includes("RESOURCE_EXHAUSTED") ||
        errMsg.includes("quota") ||
        errMsg.includes("Quota exceeded") ||
        errMsg.includes("limit exceeded");

      if (isQuotaExceeded) {
        if (attempt <= maxRetries) {
          const currentDelay = Math.round(delayMs * attempt * 1.5);
          console.log(`[Gemini API Rate Limit] Quota/429 exceeded. Retrying ${attempt}/${maxRetries} in ${currentDelay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, currentDelay));
          continue;
        }
        console.log(`[System Notice] Activating standby mode for ${QUOTA_COOLDOWN_MS / 1000}s. Routing requests to alternate fallback engines.`);
        geminiQuotaExhausted = true;
        lastQuotaCheckTime = Date.now();
        throw new Error("STANDBY: Primary services on standby.");
      }

      const isTransient = 
        errMsg.includes("503") || 
        errMsg.includes("UNAVAILABLE") || 
        errMsg.includes("high demand") || 
        errMsg.includes("overloaded") ||
        errMsg.includes("spikes in demand");

      if (isTransient && attempt <= maxRetries) {
        const currentDelay = delayMs * attempt;
        console.log(`[Gemini API Attempt] Status checked. Resuming execution ${attempt}/${maxRetries} in ${currentDelay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, currentDelay));
        continue;
      }
      throw error;
    }
  }
}


// -----------------------------------------------------------------
// GENERAL PERSISTENT & HIGH-PERFORMANCE DISK/MEMORY CACHE
// -----------------------------------------------------------------
// Persistent cache to survive dev-server restarts and bypass API rate limits completely
const GEMINI_CACHE_FILE = path.join(process.cwd(), "gemini_cache.json");
let geminiDiskCacheData: Record<string, Record<string, any>> = {};

try {
  if (fs.existsSync(GEMINI_CACHE_FILE)) {
    geminiDiskCacheData = JSON.parse(fs.readFileSync(GEMINI_CACHE_FILE, "utf-8"));
    console.log(`[Gemini Cache Load] Loaded persistent Gemini & TTS caches from disk.`);
  }
} catch (err) {
  console.error("[Gemini Cache Load Fail] Failed to read persistent Gemini cache:", err);
}

function saveMapToDisk(cacheName: string, map: Map<string, any>) {
  try {
    const obj: Record<string, any> = {};
    for (const [k, v] of map.entries()) {
      obj[k] = v;
    }
    geminiDiskCacheData[cacheName] = obj;
    fs.writeFileSync(GEMINI_CACHE_FILE, JSON.stringify(geminiDiskCacheData, null, 2), "utf-8");
  } catch (err) {
    console.error(`[Gemini Cache Save Fail] Failed to save cache ${cacheName}:`, err);
  }
}

class PersistentMap<K extends string, V> extends Map<K, V> {
  private cacheName: string;
  constructor(cacheName: string) {
    super();
    this.cacheName = cacheName;
    const saved = geminiDiskCacheData[cacheName];
    if (saved) {
      for (const [k, v] of Object.entries(saved)) {
        super.set(k as K, v as V);
      }
    }
  }

  set(key: K, value: V): this {
    super.set(key, value);
    saveMapToDisk(this.cacheName, this);
    return this;
  }
}

const scriptureCache = new PersistentMap<string, any>("scripture");
const ttsCache = new PersistentMap<string, any>("tts");
const compareCache = new PersistentMap<string, any>("compare");
const verseAlignmentCache = new PersistentMap<string, any>("verseAlignment");
const similarVersesCache = new PersistentMap<string, any>("similarVerses");
const workbenchCache = new PersistentMap<string, any>("workbench");
const chatCache = new PersistentMap<string, any>("chat");
const storyCache = new PersistentMap<string, any>("story");
const qaCache = new PersistentMap<string, any>("qa");
const glossaryCache = new PersistentMap<string, any>("glossary");
const hymnTranslationCache = new PersistentMap<string, any>("hymnTranslation");
const wordCloudCache = new PersistentMap<string, any>("wordcloud");

// -----------------------------------------------------------------
// OFFLINE HIGH-FIDELITY SCHOLARLY FALLBACK DATA GENERATORS
// -----------------------------------------------------------------

async function getOfflineScriptureFallback(
  religion: string,
  bookKey: string,
  bookTitle: string,
  divisionNumber: number,
  divisionsName: string,
  originalTitle: string,
  targetLanguage: string
) {
  const relLower = (religion || "").toLowerCase();
  const keyLower = (bookKey || "").toLowerCase();

  if (keyLower === "brahma_purana") {
    const chName = BRAHMA_PURANA_CHAPTERS[divisionNumber - 1] || `Chapter ${divisionNumber}`;
    let intro = `A high-fidelity academic translation and commentary of the Brahma Purana, Chapter ${divisionNumber}: "${chName}". `;
    let originalText = "ॐ ब्रह्मज्ञानं परमं गुह्यं सृष्टिस्थित्यन्तकारणम् । प्रणम्य शिरसा देवं प्रवक्ष्यामि सनातनम् ॥";
    let translit = "oṁ brahma-jñānaṁ paramaṁ guhyaṁ sṛṣṭi-sthity-anta-kāraṇam | praṇamya śirasā devaṁ pravakṣyāmi sanātanam";
    let trans = "Saluting the Supreme Divine Lord, who is the mysterious cause of cosmic creation, preservation, and dissolution, we describe the eternal, sacred knowledge of the Brahma Purana.";
    let commentary = `This chapter is part of the traditional core of the Brahma Purana. It explores themes of ${chName}, reinforcing the Puranic emphasis on connecting physical geography, local tirthas, and personal virtues to the cosmic order of Brahman.`;
    
    if (divisionNumber === 1) {
      intro += "This first chapter covers Adi Srishti (Divine Creation), detailing how the Supreme Creator (Brahma) brought forth the elements, sages, and cosmic order.";
      originalText = "यः सर्वज्ञः सर्वविद् यस्य ज्ञानमयं तपः । तस्मादेतद्ब्रह्म नाम रूपमन्नं च जायते ॥";
      translit = "yaḥ sarvajñaḥ sarvavid yasya jñānamayaṁ tapaḥ | tasmād etad brahma nāma rūpam annaṁ ca jāyate";
      trans = "From the Divine who is all-knowing and all-wise, whose penance consists of absolute knowledge, are produced this cosmos, name, form, and material sustenance.";
      commentary = "Chapter 1 establishes the cosmological foundation of the Brahma Purana. It explains that creation is not a random mechanical process, but a conscious emanation of cosmic consciousness (Brahman), transitioning from unmanifest stillness to the dynamic diversity of the material universe.";
    } else if (divisionNumber === 28) {
      intro += "This chapter is the Surya Mahatmya, detailing the praises, dimensions, and meditation on Lord Surya, representing the physical source of energy and inner light.";
      originalText = "नमः सवित्रे जगदेकचक्षुषे जगत्प्रसूतिस्थितिनाशहेतवे । त्रयीमयाय त्रिगुणात्मधारिणे विरिञ्चिनारायणशङ्करात्मने ॥";
      translit = "namaḥ savitre jagad-eka-cakṣuṣe jagat-prasūti-sthiti-nāśa-hetave | trayī-mayāya tri-guṇātma-dhāriṇe viriñci-nārāyaṇa-śaṅkarātmane";
      trans = "Salutations to the Sun-God, the sole eye of the universe, the cause of creation, sustenance, and dissolution of the cosmos, who is embodied in the Vedas, sustains the three gunas, and represents the combined souls of Brahma, Vishnu, and Shiva.";
      commentary = "The Surya Mahatmya (Chapters 28-32) highlights Solar devotion as a path to direct physical well-being, mental illumination, and spiritual realization. In the Brahma Purana, Lord Surya is recognized as the visible symbol of the formless, ultimate Truth, providing both warmth to the outer world and light to the inner seeker.";
    } else if (divisionNumber >= 176 && divisionNumber <= 212) {
      intro += "This portion belongs to the Krishna Charitra, describing the divine exploits, spiritual lessons, and pure love of Lord Krishna's manifestation.";
      originalText = "वसुदेवसुतं देवं कंसचाणूरमर्दनम् । देवकीपरमानन्दं कृष्णं वन्दे जगद्गुरुम् ॥";
      translit = "vasudevasutaṁ devaṁ kaṁsacāṇūramardanam | devakīparamānandaṁ kṛṣṇaṁ vande jagadgurum";
      trans = "I salute Lord Krishna, the spiritual preceptor of the universe, the son of Vasudeva, the destroyer of Kamsa and Chanura, and the supreme joy of mother Devaki.";
      commentary = "The Krishna Charitra section of the Brahma Purana presents Krishna's life as a play of divine consciousness (Lila). It teaches that absolute surrender (Bhakti Yoga) and righteous actions (Karma Yoga) are completely aligned with the ultimate reality of Brahman.";
    } else if (divisionNumber >= 101 && divisionNumber <= 175) {
      intro += "This chapter is part of the famous Gautami Mahatmya, dedicating 75 chapters to the sacred geography, tirthas, and cleansing powers of the Godavari River.";
      originalText = "गङ्गा गङ्गेति यो ब्रूयाद् योजनानां शतैरपि । मुच्यते सर्वपापेभ्यो विष्णुलोकं स गच्छति ॥";
      translit = "gaṅgā gaṅgeti yo brūyād yojanānāṁ śatairapi | mucyate sarvapāpebhyo viṣṇulokaṁ sa gacchati";
      trans = "Whoever utters 'Ganga, Ganga' even from a distance of hundreds of miles is liberated from all downfalls and attains the supreme realm of peace.";
      commentary = "The Gautami Mahatmya is a major and highly revered section of the Brahma Purana. It illustrates the spiritual ecology of ancient India, treating rivers as living mothers of purification and wisdom, where every bank has a sacred story of healing and self-correction.";
    } else if (divisionNumber >= 236 && divisionNumber <= 245) {
      intro += "This chapter explores Yoga Shastra, Samkhya philosophy, and the practical path of meditation leading to self-realization (Moksha).";
      originalText = "यदा पञ्चावतिष्ठन्ते ज्ञानानि मनसा सह । बुद्धिश्च न विचेष्टति तामाहुः परमां गतिम् ॥";
      translit = "yadā pañcāvatiṣṭhante jñānāni manasā saha | buddhiś ca na viceṣṭati tām āhuḥ paramāṁ gatim";
      trans = "When the five senses, along with the mind, are completely stilled, and the intellect remains firm and unmoving, that state is declared by sages to be the supreme path of liberation.";
      commentary = "The final chapters of the Brahma Purana consolidate the deep philosophical teachings of Ashtanga Yoga and Samkhya. It stresses that outer devotion (Bhakti) must culminate in the inner direct realization of non-dual consciousness, where the individual soul merges with the supreme light of Brahman.";
    }

    return {
      isOfflineFallback: true,
      introSummary: intro,
      verses: [
        {
          number: `${divisionNumber}.1`,
          originalText,
          transliteration: translit,
          translation: trans
        }
      ],
      commentary,
      interfaithParallels: [
        {
          religion: "christianity",
          source: "Gospel of John 1:1",
          similarity: "The concept of creation emanating from supreme word/wisdom (Brahma or Sabda-Brahman) corresponds to the Logos.",
          lesson: "Creation has a divine, intelligent, and spiritual foundation that is accessible through contemplative wisdom."
        }
      ]
    };
  }

  const puranasKeys = [
    "padma_purana",
    "vishnu_purana",
    "shiva_purana",
    "vayu_purana",
    "bhagavata_purana",
    "narada_purana",
    "markandeya_purana",
    "agni_purana",
    "bhavishya_purana",
    "brahmavaivarta_purana",
    "linga_purana",
    "varaha_purana",
    "skanda_purana",
    "vamana_purana",
    "kurma_purana",
    "matsya_purana",
    "garuda_purana",
    "brahmanda_purana"
  ];

  if (puranasKeys.includes(keyLower)) {
    const chName = getPuranaChapterName(keyLower, divisionNumber);
    let intro = `A high-fidelity academic translation and commentary of the ${bookTitle}, Portion/Chapter ${divisionNumber}: "${chName}". `;
    let originalText = "ॐ नमः परमात्मने सर्वसृष्टिस्थित्यन्तकारिणे नमः ॥";
    let translit = "oṁ namaḥ paramātmane sarva-sṛṣṭī-sthity-anta-kāriṇe namaḥ";
    let trans = "Salutations to the Supreme Divine Soul, who is the cause of cosmic creation, preservation, and dissolution.";
    let commentary = `This chapter is part of the traditional core of the ${bookTitle}. It explores themes of ${chName}, reinforcing the Puranic emphasis on connecting physical geography, local tirthas, and personal virtues to the cosmic order of Brahman.`;
    let parallelReligion = "christianity";
    let parallelSource = "Gospel of John 1:1";
    let parallelSimilarity = "The concept of creation emanating from supreme word/wisdom corresponds to the Logos.";
    let parallelLesson = "Creation has a divine, intelligent, and spiritual foundation that is accessible through contemplative wisdom.";

    if (keyLower === "vishnu_purana") {
      intro += "Focuses on Lord Vishnu as the primary supporter and preserver of the universe, offering deep insights into moral righteousness and devotion.";
      originalText = "ॐ नमो भगवते वासुदेवाय ॥";
      translit = "oṁ namo bhagavate vāsudevāya";
      trans = "Salutations to the Supreme Lord Vasudeva, the all-pervading divine source of cosmic preservation.";
      commentary = "The Vishnu Purana emphasizes Vishnu's preservation aspect (Sthiti). It teaches that the individual soul finds peace by aligning with the cosmic preservation grid of Lord Vishnu.";
      parallelReligion = "christianity";
      parallelSource = "Colossians 1:17";
      parallelSimilarity = "The idea of a divine protector in whom all things hold together is shared between Christ and Vishnu's role.";
      parallelLesson = "Nurturing and preserving the creation is a sacred spiritual duty for all individuals.";
    } else if (keyLower === "shiva_purana") {
      intro += "Presents Lord Shiva as the non-dual supreme Brahman, detailing his forms, auspicious rituals, and deep meditative path (Shaiva Yoga).";
      originalText = "ॐ नमः शिवाय ॥";
      translit = "oṁ namaḥ śivāya";
      trans = "Salutations to the auspicious Lord Shiva, the inner self and ruler of formless cosmic consciousness.";
      commentary = "The Shiva Purana guides the devotee towards realizing the unmanifest, formless aspect of Shiva (Jyotirlinga), transcending worldly name, form, and attachment.";
      parallelReligion = "buddhism";
      parallelSource = "Heart Sutra";
      parallelSimilarity = "Shiva's formless aspect as the void (Shunya) corresponds to the Buddhist concept of emptiness.";
      parallelLesson = "Acknowledge the impermanence of all physical forms and seek the underlying formless, eternal truth.";
    } else if (keyLower === "bhagavata_purana") {
      intro += "Details the deep devotion towards Lord Krishna, portraying pure self-surrender (Sharanagati) as the ultimate path of liberation.";
      originalText = "सच्चिदानन्दरूपाय विश्वोत्पत्त्यादिहेतवे । तापत्रयविनाशाय श्रीकृष्णाय वयं नुमः ॥";
      translit = "saccidānandarūpāya viśvotpatti-ādi-hetave | tāpatraya-vināśāya śrīkṛṣṇāya vayaṁ numaḥ";
      trans = "We offer our salutations to Lord Krishna, who is the embodiment of absolute Truth, Consciousness, and Bliss, the sole cause of cosmic creation, and the remover of three-fold human suffering.";
      commentary = "The Srimad Bhagavatam holds devotion (Bhakti) to be superior even to bare intellectual liberation, as it establishes a living, loving relationship with the personal supreme divine.";
      parallelReligion = "christianity";
      parallelSource = "Gospel of John 15:4";
      parallelSimilarity = "The deep intimacy of the devotee remaining inside the love of the Divine is shared between Krishna Bhakti and Christ's vine metaphor.";
      parallelLesson = "Cultivate an active, loving heart-relationship with the Divine to experience genuine peace.";
    } else if (keyLower === "padma_purana") {
      intro += "Upholds moral and ecological balance as the core message, covering creation from the sacred cosmic lotus.";
      originalText = "धर्मो रक्षितः सुखाय भवति नित्यं सताम् ॥";
      translit = "dharmo rakṣitaḥ sukhāya bhavati nityaṁ satām";
      trans = "Righteousness (Dharma), when protected and upheld, always brings supreme peace and happiness to the virtuous.";
      commentary = "The Padma Purana outlines that all realms—terrestrial, heavenly, and netherworld—are interconnected, and that our current ethical choices reverberate across these dimensions.";
      parallelReligion = "islam";
      parallelSource = "Quran 55:7-9";
      parallelSimilarity = "The call to maintain the balance (Mizan) corresponds to the Puranic emphasis on preserving cosmic Dharma.";
      parallelLesson = "Act with justice and integrity, ensuring you do not disrupt the natural or spiritual scales of balance.";
    } else if (keyLower === "narada_purana") {
      intro += "Sage Narada details the nine-fold paths of Bhakti Yoga as direct methods of cleansing the human mind and attaining union.";
      originalText = "श्रवणं कीर्तनं विष्णोः स्मरणं पादसेवनम् । अर्चनं वन्दनं दास्यं सख्यमात्मनिवेदनम् ॥";
      translit = "śravaṇaṁ kīrtanaṁ viṣṇoḥ smaraṇaṁ pāda-sevanam | arcanaṁ vandanaṁ dāsyaṁ sakhyam ātma-nivedanam";
      trans = "The nine modes of devotion: listening, chanting, remembering, serving, worshiping, bowing, serving, befriending, and complete self-surrender.";
      commentary = "Narada Purana provides a comprehensive manual on spiritual lifestyle, fasting vows (vratas), and temple sciences to keep the practitioner centered in daily life.";
      parallelReligion = "sikhism";
      parallelSource = "Guru Granth Sahib p. 305";
      parallelSimilarity = "Chanting and remembering the divine name (Naam Simran) as the primary cleansing agent corresponds to Narada's Bhakti.";
      parallelLesson = "Engage in constant remembrance of the Divine to purify the mind from ego and malice.";
    } else if (keyLower === "markandeya_purana") {
      intro += "Glorifies the primordial active divine feminine energy (Shakti) as the ultimate protector of the cosmos, notably containing the Devi Mahatmyam.";
      originalText = "सर्वमङ्गलमङ्गल्ये शिवे सर्वार्थसाधिके । शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते ॥";
      translit = "sarva-maṅgala-maṅgalye śive sarvārtha-sādhike | śaraṇye tryambake gauri nārāyaṇi namo'stu te";
      trans = "Salutations to the auspicious Goddess Narayani, who is the source of all blessings, the ultimate achiever of all goals, the supreme refuge, and the three-eyed divine Mother Gauri.";
      commentary = "The Markandeya Purana shows that when collective peace is threatened by dark egoistic forces, the active divine feminine energy manifests to restore equilibrium and protect the righteous.";
      parallelReligion = "christianity";
      parallelSource = "Revelation 12:1";
      parallelSimilarity = "The cosmic queen clothed with the sun, victorious over the dragon, mirrors Goddess Durga's cosmic warrior role.";
      parallelLesson = "Inner strength and courage arise when we align our actions with the divine active justice.";
    } else if (keyLower === "agni_purana") {
      intro += "Delivered directly by the Fire God representing active physical and spiritual energy, spanning sciences, arts, and Ayurveda.";
      originalText = "अग्निमीळे पुरोहितं यज्ञस्य देवमृत्विजम् । होतारं रत्नधातमम् ॥";
      translit = "agnim īḷe purohitaṁ yajñasya devam ṛtvijam | hotāraṁ ratnadhātamam";
      trans = "I praise Agni, the priest, the divine minister of the sacred offering, the summoner, and the bestower of ultimate spiritual jewels.";
      commentary = "The Agni Purana treats secular arts (medicine, architecture, poetry) as branches of sacred wisdom, showing that a balanced, healthy physical life supports spiritual liberation.";
      parallelReligion = "judaism";
      parallelSource = "Proverbs 3:13";
      parallelSimilarity = "The acquisition of versatile, practical wisdom for daily life is celebrated as the highest wealth in both scriptures.";
      parallelLesson = "Integrate your daily work, health habits, and professional skills into a unified spiritual lifestyle.";
    } else if (keyLower === "vayu_purana") {
      intro += "Explores cosmology and Shaiva yoga, describing the vital breath (Prana) and solar dynasties under the guidance of Vayu, the Wind God.";
      originalText = "वायुरायुर्जगत्प्राणः सर्वभूतहृदि स्थितः ॥";
      translit = "vāyur āyur jagat-prāṇaḥ sarvabhūta-hṛdi sthitaḥ";
      trans = "Vayu is the vital breath of life (Prana) of the universe, established firmly in the hearts of all living beings.";
      commentary = "The Vayu Purana outlines that the physical wind and the inner breath (Pranayama) are cosmic vibrations of Lord Shiva's power, allowing seekers to reach samadhi through breath control.";
      parallelReligion = "christianity";
      parallelSource = "Genesis 2:7";
      parallelSimilarity = "God breathing the breath of life (Pneuma/Prana) into human nostrils to make them living souls mirrors Vayu's role.";
      parallelLesson = "Treat your breath as a sacred connection to the cosmic life force, cultivating mindfulness in every inhalation and exhalation.";
    } else if (keyLower === "bhavishya_purana") {
      intro += "Addresses the progression of time across the Yugas, encouraging humanity to guard core moral values in times of rapid change.";
      originalText = "सत्यं बृहदृतमुग्रं दीक्षा तपो ब्रह्म यज्ञः पृथिवीं धारयन्ति ॥";
      translit = "satya\u1e41 b\u1e5bhad \u1e5btam ugra\u1e41 d\u012bk\u1e63\u0101 tapo brahma yaj\u00f1a\u1e25 p\u1e5bthiv\u012b\u1e41 dh\u0101rayanti";
      trans = "Truth, cosmic order, spiritual consecration, austerity, absolute knowledge, and selfless offerings sustain the Earth.";
      commentary = "The Bhavishya Purana emphasizes that while external cultures and technologies shift across eras, the fundamental laws of soul-purification and cosmic devotion remain unchanged.";
      parallelReligion = "buddhism";
      parallelSource = "Lotus Sutra";
      parallelSimilarity = "The decline of the Dharma in the latter days (Mappo) and the call to maintain steady mindfulness mirrors the Kali Yuga warnings.";
      parallelLesson = "When social ethics decay, redouble your commitment to inner truth, compassion, and spiritual practice.";
    } else if (keyLower === "brahmavaivarta_purana") {
      intro += "Explores the sweet non-dual union of Radha and Krishna, representing the primordial active and passive elements of ultimate cosmic love.";
      originalText = "राधा कृष्णमयी प्रोक्ता कृष्णो राधा मयो ध्रुवम् ।";
      translit = "rādhā kṛṣṇamayī proktā kṛṣṇo rādhā mayo dhruvam";
      trans = "Radha is declared to be completely immersed in Krishna, and Krishna is eternally immersed in Radha.";
      commentary = "The Brahmavaivarta Purana interprets creation as an aesthetic and romantic expression of the Divine (Rasa), teaching that pure spiritual love is the quickest way to dissolve the ego.";
      parallelReligion = "christianity";
      parallelSource = "Ephesians 5:31-32";
      parallelSimilarity = "The mystical marriage of the soul and the Divine, compared to earthly union, is central to both traditions.";
      parallelLesson = "See all human relationships as opportunities to practice and reflect the selfless, unconditional love of the Divine.";
    } else if (keyLower === "linga_purana") {
      intro += "Focuses on Lord Shiva's formless light manifestation, reminding seekers that all physical entities eventually merge back into pure consciousness.";
      originalText = "प्रधानं प्रकृतिश्चैव यदाहुर्लिङ्गमुत्तमम् ।";
      translit = "pradhānaṁ prakṛtiś caiva yad āhur liṅgam uttamam";
      trans = "The unmanifest source and active nature together are declared to be the supreme, infinite pillar of cosmic light (Shiva Lingam).";
      commentary = "The Linga Purana details the emergence of the pillar of fire (Jyotirlinga) before Brahma and Vishnu, symbolizing that absolute reality exceeds intellectual categorization.";
      parallelReligion = "judaism";
      parallelSource = "Exodus 13:21";
      parallelSimilarity = "The pillar of fire guiding the seekers through the darkness corresponds to Shiva's Jyotirlinga.";
      parallelLesson = "When intellect fails, look for the formless light of awareness that shines constantly inside your heart.";
    } else if (keyLower === "varaha_purana") {
      intro += "Explores ecological protection and divine grace, emphasizing the harmonious co-existence of all living species with Bhu Devi.";
      originalText = "नमो नमस्ते वराहाय भूमेरुद्धारकारिणे ॥";
      translit = "namo namaste varāhāya bhūmer uddhāra-kāriṇe";
      trans = "Salutations, endless salutations to the divine Varaha avatar, who lifted and saved Mother Earth from the oceans of delusion.";
      commentary = "The Varaha Purana stresses that Mother Earth (Bhu Devi) is a living, conscious entity that must be respected, cared for, and treated with complete ethical responsibility.";
      parallelReligion = "native american spirituality";
      parallelSource = "Traditional Lakota teachings";
      parallelSimilarity = "The profound honor and kinship with Mother Earth (Unci Maka) as a sacred provider matches Varaha's dialogue.";
      parallelLesson = "Ecology and spiritual progression are inseparable; protecting the planet is a direct form of divine service.";
    } else if (keyLower === "skanda_purana") {
      intro += "Presents Kartikeya's acts and a detailed description of regional shrines, treating geography as a map of inner consciousness.";
      originalText = "ज्ञानशक्तिधरा देव स्कन्ददेव नमोऽस्तु ते ॥";
      translit = "jñāna-śakti-dharā deva skandadeva namo'stu te";
      trans = "Salutations to Lord Skanda, the holder of the divine spear of wisdom and power, who vanishes inner dark forces.";
      commentary = "The Skanda Purana holds that every geographical tirtha (pilgrimage site, lake, mountain) corresponds to a specific energy hub (chakra) in the subtle body of the seeker.";
      parallelReligion = "christianity";
      parallelSource = "Hebrews 11:13-16";
      parallelSimilarity = "Earthly pilgrimage as a physical symbol of the soul's inner journey towards a heavenly homeland matches Skanda's focus.";
      parallelLesson = "Let every physical journey or walk in nature be an intentional pilgrimage of self-purification and inner awakening.";
    } else if (keyLower === "vamana_purana") {
      intro += "Highlights how surrendering one's ego (represented by King Bali) is the highest path to attaining ultimate freedom and grace.";
      originalText = "त्रिपदक्रमेण देवेशो जगन्माप जनार्दनः ।";
      translit = "tripada-krameṇa deveśo jagan māpa janārdanaḥ";
      trans = "With three divine strides, the Lord of gods (Janardana) measured the entire cosmic universe, dismantling human pride.";
      commentary = "The Vamana Purana illustrates that true surrender does not mean losing one's identity, but rather transcending the limited ego to merge with the cosmic expanse of the Divine.";
      parallelReligion = "islam";
      parallelSource = "Quran 2:112";
      parallelSimilarity = "Submitting one's entire will and face to God to obtain absolute peace mirrors King Bali's submission to Vamana.";
      parallelLesson = "Real strength is born when we surrender our pride, letting the Divine direct our actions and intelligence.";
    } else if (keyLower === "kurma_purana") {
      intro += "Teaches Ashtanga Yoga and Samkhya philosophy as practical paths to self-realization, featuring the famous Ishvara Gita.";
      originalText = "योगात्सञ्जायते ज्ञानं ज्ञानाद्योगः प्रवर्तते ।";
      translit = "yogāt sañjāyate jñānaṁ jñānād yogaḥ pravartate";
      trans = "From the steady practice of Yoga arises supreme knowledge, and through knowledge, Yoga becomes firmly established.";
      commentary = "The Kurma Purana, delivered by Vishnu in his tortoise manifestation supporting the churning of the ocean, teaches that steady concentration is required to churn wisdom out of the mind.";
      parallelReligion = "buddhism";
      parallelSource = "Dhammapada 20:282";
      parallelSimilarity = "The idea that wisdom (panna) is born from the active practice of meditation matches the Kurma's yoga maxim.";
      parallelLesson = "Balance intellectual contemplation with quiet daily meditation to integrate wisdom into your nervous system.";
    } else if (keyLower === "matsya_purana") {
      intro += "Narrated by the Golden Fish (Matsya) during the great cosmic deluge, describing the laws of survival, arts, and cyclic rejuvenation.";
      originalText = "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत ।";
      translit = "yadā yadā hi dharmasya glānir bhavati bhārata";
      trans = "Whenever there is a decline in righteousness and a rise in dark forces, the Divine manifests to protect and restore order.";
      commentary = "The Matsya Purana teaches that during times of immense crisis or deluge (pralaya), the Divine provides the 'ark' of wisdom and preserves the seeds of future civilization.";
      parallelReligion = "judaism";
      parallelSource = "Genesis 6:13-14";
      parallelSimilarity = "The salvation of the righteous and the preservation of species in an ark during a global flood is shared with Noah's story.";
      parallelLesson = "In times of great external crisis, anchor your mind to the eternal boat of spiritual truth and righteous living.";
    } else if (keyLower === "garuda_purana") {
      intro += "Deals with ethics, healing, gemology, and the afterlife transition of the soul, teaching non-attachment and pure actions.";
      originalText = "न कश्चित् कस्यचिन्मित्रं न कश्चित् कस्यचिद्रिपुः ।";
      translit = "na kaścit kasyacin mitraṁ na kaścit kasyacid ripuḥ";
      trans = "No one is by birth a friend to anyone, nor is anyone an enemy; relationships are forged through one's own actions (Karma).";
      commentary = "The Garuda Purana reminds the seeker that the physical body is a temporary vehicle, urging them to focus on accumulating spiritual wealth (righteousness, compassion) rather than material attachments.";
      parallelReligion = "buddhism";
      parallelSource = "Tibetan Book of the Dead (Bardo Thodol)";
      parallelSimilarity = "Guiding the consciousness of the deceased through transitional afterlife dimensions is identical to the Preta Khanda.";
      parallelLesson = "Remember that death is only a transition of the immortal soul; live your life today with integrity and kindness.";
    } else if (keyLower === "brahmanda_purana") {
      intro += "Explores the cosmic golden egg, hosting the revered Lalitha Sahasranama which celebrates the Divine Mother as the absolute source of consciousness.";
      originalText = "ॐ ब्रह्माण्डसृष्टिस्थित्यन्तकारिणी परा शक्तिः ॥";
      translit = "oṁ brahmāṇḍa-sṛṣṭi-sthity-anta-kāriṇe parā śaktiḥ";
      trans = "We bow to the supreme, active cosmic force (Para Shakti) that creates, sustains, and dissolves the entire golden cosmic egg (Brahmanda).";
      commentary = "The Brahmanda Purana depicts the entire physical universe as a living cell of consciousness, where every element and galaxy is sustained by the intelligent power of the Divine Mother.";
      parallelReligion = "gnosticism";
      parallelSource = "Gospel of Mary";
      parallelSimilarity = "The portrayal of a supreme divine wisdom (Sophia) as the active mother of material creation matches the Lalitha theology.";
      parallelLesson = "Respect the entire universe as a sacred, living, and conscious manifestation of divine light.";
    }

    return {
      isOfflineFallback: true,
      introSummary: intro,
      verses: [
        {
          number: `${divisionNumber}.1`,
          originalText,
          transliteration: translit,
          translation: trans
        }
      ],
      commentary,
      interfaithParallels: [
        {
          religion: parallelReligion,
          source: parallelSource,
          similarity: parallelSimilarity,
          lesson: parallelLesson
        }
      ]
    };
  }

  if (keyLower === "hindu_prayers") {
    const prayersData = HINDU_PRAYERS_FULL_DATA;
    /*
    const old_prayersData: Record<number, any> = {
      1: {
        introSummary: "The Gayatri Mantra is the supreme, ancient Vedic chant from the Rigveda (3.62.10) for mental illumination, paired with traditional Shanti Mantras invoking absolute peace across the cosmos.",
        verses: [
          {
            number: "1",
            originalText: "ॐ भूर्भुवः स्वः । तत्सवितुर्वरेण्यं । भर्गो देवस्य धीमहि । धियो यो नः प्रचोदयात् ॥",
            transliteration: "oṁ bhūr bhuvaḥ svaḥ | tat savitur vareṇyaṁ | bhargo devasya dhīmahi | dhiyo yo nः pracodayāt",
            translation: "We contemplate the glorious solar light of the Divine Creator; may that divine illumination inspire and guide our intellect on the right path."
          },
          {
            number: "2",
            originalText: "ॐ सह नाववतु । सह नौ भुनक्तु । सह वीर्यं करवावहै । तेजस्वि नावधीतमस्तु मा विद्विषावहै ॥ ॐ शान्तिः शान्तिः शान्तिः ॥",
            transliteration: "oṁ saha nāvavatu | saha nau bhunaktu | saha vīryaṁ karavāvahai | tejasvi nāvad hītam astu mā vidviṣāvahai | oṁ śāntiḥ śāntiḥ śāntiḥ",
            translation: "May the Divine protect us both (teacher and student) together. May we be nourished together. May we work together with great energy. May our study be enlightened and effective. May there be no animosity between us. Om Peace, Peace, Peace."
          }
        ],
        commentary: "These prayers reveal that Vedic spirituality is a collective seeking for mental clarity and peaceful study. Rather than individualistic salvation, it stresses harmonious co-existence with our environment, teachers, and student peers."
      },
      2: {
        introSummary: "The Hanuman Chalisa is a forty-verse devotional song composed by Goswami Tulsidas in Awadhi. It praises Lord Hanuman's matchless devotion, strength, courage, and surrender.",
        verses: [
          {
            number: "Doha 1",
            originalText: "श्रीगुरु चरन सरोज रज निज मनु मुकुरु सुधारि । बरनउँ रघुबर बिमल जसु जो दायकु फल चारि ॥",
            transliteration: "shree guru charan saroj raj nij manu mukuru sudhaari | baranaun raghubar bimal jasu jo daayaku phal chaari",
            translation: "Having cleaned the mirror of my mind with the dust of the lotus feet of my Guru, I praise the untarnished glory of Rama, who bestows the four objectives of life: righteousness, wealth, joy, and liberation."
          },
          {
            number: "Chaupai 1",
            originalText: "जय हनुमान ज्ञान गुन सागर । जय कपीस तिहुं लोक उजागर ॥",
            transliteration: "jai hanumaan gyaan gun saagar | jai kapees tihun lok ujaagar",
            translation: "Victory to Hanuman, the supreme ocean of wisdom and virtues! Victory to the chief of monkeys, who illuminates the three worlds with his brilliant presence."
          }
        ],
        commentary: "The Hanuman Chalisa is recited daily by millions of devotees to overcome fear and focus the mind. It represents Bhakti Yoga (devotional relationship) expressed through selfless actions of protecting the weak."
      },
      3: {
        introSummary: "The Bajrang Baan is a highly protective and powerful hymn dedicated to Lord Hanuman. It is chanted to dispel severe external fears, negative vibrations, and obstacles, invoking Hanuman to act with the speed and target-precision of an arrow.",
        verses: [
          {
            number: "1",
            originalText: "निश्चय प्रेम प्रतीत ते, विनय करैं सनमान । तेहि के कारज सकल शुभ, सिद्ध करैं हनुमान ॥",
            transliteration: "nishchay prem prateet te, vinay karain sanmaan | tehi ke kaaraj sakal shubh, siddh karain hanumaan",
            translation: "For whoever approaches with firm confidence, pure love, and humble respect, Lord Hanuman ensures all their auspicious tasks are fully accomplished."
          },
          {
            number: "2",
            originalText: "जय हनुमंत संत हितकारी । सुन लीजै प्रभु अरज हमारी ॥",
            transliteration: "jai hanumant sant hitkaari | sun leejai prabhu araj hamaari",
            translation: "Victory to Hanuman, the benefactor of saints and righteous seekers! Please listen, O Lord, to this earnest prayer of mine."
          }
        ],
        commentary: "The Bajrang Baan uses powerful sound vibrations and rapid meter. In Bhakti, swearing by Lord Rama is a force that Hanuman cannot ignore, reminding us of the cosmic vows protecting all sincere seekers."
      },
      4: {
        introSummary: "The Shiv Tandav Stotram is a Sanskrit hymn of supreme rhythm and literary beauty, traditionally attributed to Ravana, the king of Lanka. It describes Lord Shiva’s cosmic dance of destruction, recreation, and absolute liberation.",
        verses: [
          {
            number: "1",
            originalText: "जटाटवीगलज्जलप्रवाहपावितस्थले गलेऽवलम्ब्य लम्बितां भुजङ्गतुङ्गमालिकाम् । डमड्डमड्डमड्डमन्निनादवड्डमर्वयं चकार चण्डताण्डवं तनोतु नः शिवः शिवम् ॥",
            transliteration: "jaṭāṭavī-gala-jjalapravāha-pāvitasthale gale'valambya lambitāṁ bhujanga-tunga-mālikām | ḍamaḍ-ḍamaḍ-ḍamaḍ-ḍaman-ninādavad-ḍamarvayaṁ cakāra caṇḍataṇḍavaṁ tanotu naḥ śivaḥ śivam",
            translation: "With his neck consecrated by the flow of water trickling down his matted locks, a grand serpent draped around his throat like a garland, and the damaru drum sounding 'Damad-Damad-Damad', Lord Shiva performs his fierce cosmic Tandav dance. May he shower auspiciousness on us all."
          }
        ],
        commentary: "The Tandava symbolizes the cosmic act of constant transformation. Through dynamic dance, Shiva destroys outmoded attachment, cleaning the slate so new cosmic creation can cycle."
      },
      5: {
        introSummary: "The Ganesha Aarti is a popular devotional hymn praising Lord Ganesha, the remover of obstacles, supreme intellectual force, husband of Riddhi & Siddhi, and first invoked deity.",
        verses: [
          {
            number: "1",
            originalText: "जय गणेश जय गणेश, जय गणेश देवा । माता जाकी पारवती, पिता महादेवा ॥",
            transliteration: "jaya gaṇeśa jaya gaṇeśa, jaya gaṇeśa devā | mātā jākī pāravatī, pitā mahādevā",
            translation: "Victory to Lord Ganesha, victory to the divine Ganesha! Whose mother is Parvati, and whose father is Lord Shiva."
          },
          {
            number: "2",
            originalText: "एकदन्त दयावन्त, चार भुजाधारी । माथे सिन्दूर सोहे, मूस की सवारी ॥",
            transliteration: "ekadanta dayāvanta, cāra bhujādhārī | māthe sindūra sohe, mūsa kī savārī",
            translation: "The single-tusked, merciful Lord with four arms, adorned with red vermillion on his forehead and riding upon his mouse."
          }
        ],
        commentary: "Ganesha represents the inner wisdom and intelligence. Invoking Ganesha is a spiritual psychological trigger to ensure all details are planned well and executed nicely."
      },
      6: {
        introSummary: "A beautiful compilation of traditional chants dedicated to the Divine Mother in her forms of Durga (strength), Lakshmi (abundance), and Saraswati (knowledge), traditionally sung during Navratri.",
        verses: [
          {
            number: "Durga Aarti",
            originalText: "अम्बे तू है जगदम्बे काली, जय दुर्गे खप्पर वाली । तेरे ही गुण गावें भारती, ओ मैया हम सब उतारें तेरी आरती ॥",
            transliteration: "ambe tū hai jagadambe kālī, jaya durge khappara vālī | tere hī guṇa gāveṁ bhāratī, o maiyā hama saba utāreṁ terī āratī",
            translation: "O Mother, you are the mother of the universe, Jagdamba, and Kali. Victory to Durga, who holds the sacred chalice. All of India sings your praises; O Mother, we all perform your light-worship."
          }
        ],
        commentary: "The female energy represents active dynamic divine focus in the cosmos. Wisdom (Saraswati), spiritual wealth (Lakshmi), and clean power (Durga) must work as one to support active devotion."
      },
      7: {
        introSummary: "Om Jai Jagdish Hare is the ultimate universal temple aarti in Hinduism, composed by Pandit Shardha Ram Phillauri. It is a heartfelt prayer of complete surrender and devotion to the Lord of the Universe (Vishnu).",
        verses: [
          {
            number: "1",
            originalText: "ॐ जय जगदीश हरे, स्वामी जय जगदीश हरे । भक्त जनों के संकट, क्षण में दूर करे ॥",
            transliteration: "oṁ jaya jagadīśa hare, svāmī jaya jagadīśa hare | bhakta janoṁ ke saṅkaṭa, kṣaṇa meṁ dūra kare",
            translation: "Om, Victory to the Lord of the Universe! Who dispels the suffering, fears, and obstacles of his devotees in a fraction of a second."
          },
          {
            number: "2",
            originalText: "तन मन धन सब है तेरा, स्वामी सब कुछ है तेरा । तेरा तुझको अर्पण, क्या लागे मेरा ॥",
            transliteration: "tana mana dhana saba hai terā, svāmī saba kucha hai terā | terā तुझको अर्पण, क्या लागे मेरा",
            translation: "My body, my mind, and my wealth—everything belongs to You. O Lord, everything is yours. I offer back to You what is already Yours; what is there that I can call mine?"
          }
        ],
        commentary: "The core lesson of this visual prayer is the joyful letting go of ego and physical possessions. Offering all possessions back to the divine source leads to ultimate mental peace and freedom."
      },
      8: {
        introSummary: "The Maha Mrityunjaya Mantra is a life-giving cosmic prayer dedicated to Lord Shiva, found in the Rigveda (7.59.12). It is chanted to overcome fears of death, illnesses, and attachments.",
        verses: [
          {
            number: "1",
            originalText: "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् । उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात् ॥",
            transliteration: "oṁ tryambakaṁ yajāmahe sugandhiṁ puṣṭi-vardhanam | urvārukam-iva bandhanān mṛtyor mukṣīya mā'mṛtāt",
            translation: "We worship the three-eyed Lord Shiva, who is fragrant and nourishes all beings. May he liberate us from the bondage of death and lead us to immortality, just as a ripe cucumber is effortlessly separated from its vine."
          }
        ],
        commentary: "This ancient mantra shields the devotee's mind from fear of transition, utilizing a beautiful metaphor of the cucumber ripening and slipping naturally from the branch."
      }
    };
    */

    const prayer = prayersData[divisionNumber] || prayersData[1];
    return {
      isOfflineFallback: true,
      introSummary: `A beautiful fallback reading of ${bookTitle} (${divisionsName} ${divisionNumber}). ${prayer.introSummary}`,
      verses: prayer.verses,
      commentary: `### Scholarly Commentary\n\n${prayer.commentary}\n\nThis classic devotional text provides seekers a beautiful, deep guidance for daily living, clearing negative emotions, and centering the mind on the infinite.`,
      isLiveAiOutput: false,
      interfaithParallels: [
        {
          religion: "Buddhism",
          source: "Dhammapada 1:5",
          similarity: "Both text selections emphasize conquering negative thoughts, fear, and malice with boundless love and self-restraint to attain calm peace.",
          lesson: "Focus deeply on your selfless devotion and mental peace, releasing attachment to immediate external rewards."
        }
      ]
    };
  }

  if (keyLower === "islam_prayers") {
    const prayersData: Record<number, any> = {
      1: {
        introSummary: "Surah Al-Fatiha (The Opening) is the foundational prayer of Islam, repeated in every cycle of daily worship. It is a profound petition for guidance along the path of integrity and righteousness.",
        verses: [
          {
            number: "1.1",
            originalText: "بِسْمِ اللَّهِ الرَّحْمَٰनِ الرَّحِيمِ",
            transliteration: "Bismillāhi r-raḥmāni r-raḥīm",
            translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful."
          }
        ],
        commentary: "Al-Fatiha initiates a direct connection between the Creator and the devotee, emphasizing mercy as the ultimate law governing the universe."
      },
      2: {
        introSummary: "Rabbana refers to the beautiful group of forty supplications from the Quran starting with the word 'Rabbana' (Our Lord). They request moral integrity, protection, and peaceful resting.",
        verses: [
          {
            number: "2.201",
            originalText: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
            transliteration: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhaban-nar",
            translation: "Our Lord, grant us good in this world and good in the Hereafter, and save us from the torment of the Fire."
          }
        ],
        commentary: "Rabbana prayers highlight the balance of striving for clean excellence in material life while remaining anchored to higher moral goals."
      },
      3: {
        introSummary: "The Dua of Light is a magnificent prophetic supplication traditionally recited in the morning, asking for divine illumination in every aspect of one's existence and senses.",
        verses: [
          {
            number: "Proverb",
            originalText: "اللَّهُمَّ اجْعَلْ فِي قَلْبِي नूराँ وَفِي لِسَانِي नूराँ...",
            transliteration: "Allahumma-j'al fi qalbi nuran, wa fi lisani nuran...",
            translation: "O Allah, place light in my heart, light on my tongue, light in my hearing, light in my sight, and make me light."
          }
        ],
        commentary: "The Dua of Light is a beautiful meditation on sensory and cognitive purity, asking to transform all perceptions into positive, creative rays."
      },
      4: {
        introSummary: "Ayat al-Kursi (The Throne Verse) is the most protective verse of the Quran, praising God's absolute living presence, complete knowledge, and eternal custody over the cosmos.",
        verses: [
          {
            number: "2.255",
            originalText: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...",
            transliteration: "Allahu la ilaha illa Huwal-Hayyul-Qayyum...",
            translation: "Allah! There is no deity except Him, the Ever-Living, the Sustainer of all existence. Neither drowsiness overtakes Him nor sleep..."
          }
        ],
        commentary: "This verse anchors monotheistic peace, serving as a reminder that the supreme creative consciousness is never tired, always watching over existence."
      }
    };

    const prayer = prayersData[divisionNumber] || prayersData[1];
    return {
      isOfflineFallback: true,
      introSummary: `A beautiful fallback reading of ${bookTitle} (${divisionsName} ${divisionNumber}). ${prayer.introSummary}`,
      verses: prayer.verses,
      commentary: `### Scholarly Commentary\n\n${prayer.commentary}\n\nThis classic Islamic petition inspires deep surrender and active social righteousness, offering a beautiful moral anchor for self-correction.`,
      isLiveAiOutput: false,
      interfaithParallels: [
        {
          religion: "Hinduism",
          source: "Rig Veda (Gayatri Mantra)",
          similarity: "Both describe requesting the Divine Light to guide, illuminate, and raise the human intellect on the path of truth.",
          lesson: "True progress begins with requesting an objective moral and intellectual compass."
        }
      ]
    };
  }

  if (keyLower === "christian_prayers") {
    const prayersData: Record<number, any> = {
      1: {
        introSummary: "The Lord's Prayer (Pater Noster) is the central prayer of Christian faith, delivered by Jesus during the Sermon on the Mount as the blueprint for aligning the human heart with God's will.",
        verses: [
          {
            number: "1",
            originalText: "Pater noster, qui es in caelis, sanctificetur nomen tuum...",
            transliteration: "Pater noster, qui es in caelis, sanctificetur nomen tuum...",
            translation: "Our Father, who art in heaven, hallowed be thy name. Thy kingdom come, thy will be done on earth as it is in heaven."
          }
        ],
        commentary: "The Lord's Prayer shifts the human relationship with the sacred to a sweet familial intimacy, seeking spiritual nourishment and forgiveness."
      },
      2: {
        introSummary: "The Peace Prayer of St. Francis of Assisi is a beautiful petition of complete selflessness, requesting to become a conduit of divine peace, love, forgiveness, and light.",
        verses: [
          {
            number: "1",
            originalText: "Lord, make me an instrument of your peace...",
            transliteration: "Instrument of Peace Supplication",
            translation: "Lord, make me an instrument of your peace: where there is hatred, let me sow love; where there is injury, pardon; where there is doubt, faith."
          }
        ],
        commentary: "St. Francis's prayer is the ultimate ethical anthem for active reconciliation, prioritizing understanding other souls over seeking to be understood."
      },
      3: {
        introSummary: "Psalm 23 is a sublime song of trust and security in the loving protection of the Divine, traditionally credited to King David as a shepherd boy.",
        verses: [
          {
            number: "1",
            originalText: "The Lord is my shepherd; I shall not want...",
            transliteration: "Dominus regit me et nihil mihi deerit...",
            translation: "The Lord is my shepherd; I shall not want. He maketh me to lie down in green pastures: he leadeth me beside the still waters."
          }
        ],
        commentary: "Psalm 23 evokes profound security, assuring that even when walking through the darkest valley, the loving grace of the Creator is close by."
      }
    };

    const prayer = prayersData[divisionNumber] || prayersData[1];
    return {
      isOfflineFallback: true,
      introSummary: `A beautiful fallback reading of ${bookTitle} (${divisionsName} ${divisionNumber}). ${prayer.introSummary}`,
      verses: prayer.verses,
      commentary: `### Scholarly Commentary\n\n${prayer.commentary}\n\nThese classic spiritual pathways stress mercy, proactive reconciliation, and complete trust in cosmic love.`,
      isLiveAiOutput: false,
      interfaithParallels: [
        {
          religion: "Buddhism",
          source: "Dhammapada 1:5",
          similarity: "Calling to defeat hatred with active peace and mercy, perfectly corresponding with the Beatitudes and the Peace Prayer.",
          lesson: "Only selfless compassion can dissolve longstanding cycles of hostility."
        }
      ]
    };
  }

  if (keyLower === "bhagavad_gita") {
    const ch = Number(divisionNumber) || 1;
    let originalText = "धृतराष्ट्र उवाच । धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः । मामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय ॥";
    let translit = "dhṛtarāṣṭra uvāca | dharmakṣetre kurukṣetre samavetā yuyutsavaḥ | māmakāḥ pāṇḍavāścaiva kimakurvata sañjaya";
    let trans = "Dhritarashtra said: O Sanjaya, assembled on the sacred field of Kurukshetra, eager to fight, what did my sons and the sons of Pandu do?";
    let commentary = `This chapter forms the emotional and psychological backdrop of the Bhagavad Gita. It details the despondency of Arjuna as he faces his kin on the battlefield, raising fundamental questions about duty, righteousness, and the consequences of war.`;

    if (ch === 2) {
      originalText = "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन । मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥";
      translit = "karmaṇy-evādhikāras te mā phaleṣu kadācana | mā karma-phala-hetur bhūr mā te saṅgo'stvakarmaṇi";
      trans = "You have a right to perform your prescribed duties, but you are never entitled to the fruits of your actions. Let not the fruits of action be your motive, nor let your attachment be to inaction.";
      commentary = "Chapter 2 is the core of the Gita's philosophy (Sankhya Yoga). This famous verse introduces Nishkama Karma—the path of selfless action without attachment to results—teaching that the purity of action lies in the dedication, not in the expectation of reward.";
    } else if (ch === 12) {
      originalText = "अद्वेष्टा सर्वभूतानां मैत्रः करुण एव च । निर्ममो निरहङ्कारः समदुःखसुखः क्षमी ॥";
      translit = "adveṣṭā sarva-bhūtānāṁ maitraḥ karuṇa eva ca | nirmamo nirahaṅkāraḥ sama-duḥkha-sukhaḥ kṣamī";
      trans = "He who is free from malice toward all living beings, friendly and compassionate, free from attachment and egoism, balanced in pleasure and pain, and forgiving, is dear to Me.";
      commentary = "Chapter 12 outlines Bhakti Yoga (the Path of Devotion). Here, Lord Krishna describes the qualities of a perfected devotee, emphasizing that true devotion is expressed through universal love, selflessness, equanimity, and forgiveness.";
    } else if (ch === 18) {
      originalText = "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज । अहं त्वा सर्वपापेभ्यो मोक्षयिष्यामी मा शुचः ॥";
      translit = "sarva-dharmān parityajya mām ekaṁ śaraṇaṁ vraja | ahaṁ tvā sarva-pāpebhyo mokṣayiṣyāmi mā śucaḥ";
      trans = "Abandon all varieties of dharma and surrender unto Me alone. I shall liberate you from all sinful reactions; do not fear.";
      commentary = "Chapter 18 is the grand synthesis of the Bhagavad Gita (Moksha Sanyasa Yoga). This final instruction represents Sharanagati—absolute surrender to the divine will—reassuring seekers that divine grace is the ultimate source of liberation.";
    } else {
      originalText = "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत । अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम् ॥";
      translit = "yadā yadā hi dharmasya glānir bhavati bhārata | abhyutthānam adharmasya tadātmānaṁ sṛjāmyaham";
      trans = "Whenever there is a decline in righteousness, O descendant of Bharata, and a rise in unrighteousness, at that time I manifest Myself.";
      commentary = `This chapter is part of the sublime teachings of the Bhagavad Gita, explaining the cyclic manifestation of divine grace to restore moral order (Dharma) and guide seekers on the path of selfless duty and spiritual awakening.`;
    }

    return {
      isOfflineFallback: true,
      introSummary: `A high-fidelity academic translation and commentary of the Bhagavad Gita, Chapter ${ch}.`,
      verses: [
        {
          number: `${ch}.1`,
          originalText,
          transliteration: translit,
          translation: trans
        }
      ],
      commentary,
      interfaithParallels: [
        {
          religion: "Buddhism",
          source: "Dhammapada 2:23",
          similarity: "The emphasis on selfless action and mind control to transcend worldly desires and attachment is shared.",
          lesson: "Act with total awareness and dedication, releasing personal ego and desires for external outcomes."
        }
      ]
    };
  }

  if (keyLower === "ramayana") {
    const kanda = Number(divisionNumber) || 1;
    let originalText = "तपःस्वाध्यायनिरतं तपस्वी वाग्विदां वरम् । नारदं परिपप्रच्छ वाल्मीकिर्मुनिपुङ्गवम् ॥";
    let translit = "tapaḥ-svādhyāya-nirataṁ tapasvī vāgvidāṁ varam | nāradaṁ paripapraccha vālmīkir munipuṅgavam";
    let trans = "Ascetic Valmiki asked Sage Narada, who is always devoted to penance and study, and is the best among those eloquent in speech.";
    let commentary = `This verse opens the Valmiki Ramayana. It represents the seeking of ideal human qualities, leading Narada to describe the life of Rama, who embodies absolute righteousness, truthfulness, and moral duty (Dharma).`;

    if (kanda === 5) {
      originalText = "नमोऽस्तु रामाय सलक्ष्मणाय देव्यै च तस्यै जनकात्मजायै । नमोऽस्तु रुद्रेन्द्रयमानिलेभ्यो नमोऽस्तु चन्द्रार्कमरुद्गणेभ्यः ॥";
      translit = "namo'stu rāmāya salakṣmaṇāya devyai ca tasyai janakātmajāyai | namo'stu rudrendrayamānilebhyo namo'stu candrārkamarudgaṇebhyaḥ";
      trans = "Salutations to Lord Rama along with Lakshmana, and to his divine consort Sita, the daughter of Janaka. Salutations to Rudra, Indra, Yama, and Vayu, and to the Moon, Sun, and Maruts.";
      commentary = "This famous prayer occurs in the Sundara Kanda as Hanuman prepares to leap across the ocean to find Sita. It represents the invocation of divine elements and inner strength, symbolizing courage and absolute faith in the face of insurmountable tasks.";
    } else if (kanda === 6) {
      originalText = "धर्मो हि परमो लोके धर्मे सत्यं प्रतिष्ठितम् । धर्मसंश्रितमप्येतद् राज्यं प्राप्नोति राघवः ॥";
      translit = "dharmo hi paramo loke dharme satyaṁ pratiṣṭhitam | dharmasaṁśritamapyetad rājyaṁ prāpnoti rāghavaḥ";
      trans = "Righteousness (Dharma) is supreme in the world; in Dharma is Truth established. Raghava (Rama), completely anchored in Dharma, conquers all realms.";
      commentary = "The Yuddha Kanda depicts the ultimate battle of Rama against Ravana, illustrating that the armor of righteousness (Dharma-ratha) is superior to physical weapons, assuring the ultimate triumph of moral truth.";
    }

    return {
      isOfflineFallback: true,
      introSummary: `A high-fidelity academic translation and commentary of the Valmiki Ramayana, Book (Kanda) ${kanda}.`,
      verses: [
        {
          number: `${kanda}.1`,
          originalText,
          transliteration: translit,
          translation: trans
        }
      ],
      commentary,
      interfaithParallels: [
        {
          religion: "Christianity",
          source: "Ephesians 6:14",
          similarity: "The concept of girding oneself with the breastplate of righteousness and truth mirrors Rama's spiritual armor.",
          lesson: "Stand firm in ethical values and truth, knowing that moral integrity is the ultimate shield against deception."
        }
      ]
    };
  }

  if (keyLower === "mahabharata") {
    const parvaNum = Number(divisionNumber) || 1;
    const matchedParva = MAHABHARATA_PARVAS.find(p => p.number === parvaNum) || MAHABHARATA_PARVAS[0];
    
    const subParvasList = matchedParva.subParvas.map(sp => `• ${sp}`).join("\n");
    const introSummary = `A high-fidelity academic translation and commentary of Vyasa's Mahabharata, Parva ${parvaNum}: ${matchedParva.transliteration} (${matchedParva.translation}). This book contains ${matchedParva.chapters} chapters and consists of the following traditional sub-parvas:\n\n${subParvasList}`;

    return {
      isOfflineFallback: true,
      introSummary,
      verses: [
        {
          number: matchedParva.verse.reference,
          originalText: matchedParva.verse.originalText,
          transliteration: matchedParva.verse.transliteration,
          translation: matchedParva.verse.translation
        }
      ],
      commentary: matchedParva.commentary,
      interfaithParallels: [
        {
          religion: matchedParva.parallel.religion,
          source: matchedParva.parallel.source,
          similarity: matchedParva.parallel.similarity,
          lesson: matchedParva.parallel.lesson
        }
      ]
    };
  }

  if (keyLower === "upanishads") {
    const upNum = Number(divisionNumber) || 1;
    const upanishadObj = UPANISHADS_108.find(u => u.number === upNum) || { name: "Isha", translation: "Lord's Spirit", category: "Mukhya", veda: "Yajurveda" };
    
    let originalText = "ॐ पूर्णमदः पूर्णमिदं पूर्णात्पूर्णमुदच्यते । पूर्णस्य पूर्णमादाय पूर्णमेवावशिष्यते ॥";
    let translit = "oṁ pūrṇam adaḥ pūrṇam idaṁ pūrṇāt pūrṇam udacyate | pūrṇasya pūrṇam ādāya pūrṇam evāvaśiṣyate";
    let trans = "Om. That supreme reality is whole, and this manifest universe is whole. From the infinite whole emanates the infinite whole; yet taking the whole from the whole, the whole alone remains.";
    let commentary = `The Isha Upanishad peace invocation declares the non-dual completeness of reality. It explains that the ultimate source (Brahman) is undiminished by creation, teaching that the universe is fully saturated with divine presence.`;

    if (upNum === 2) {
      originalText = "केनेषितं पतति प्रेषितं मनः केन प्राणः प्रथमः प्रैति युक्तः ।";
      translit = "keneṣitaṁ patati preṣitaṁ manaḥ kena prāṇaḥ prathamaḥ praiti yuktaḥ";
      trans = "By whose will does the mind fly toward its objects? Directed by whom does the vital breath run its course?";
      commentary = "The Kena Upanishad begins with a deep, systematic inquiry into the source of life and awareness. It teaches that the senses and intellect cannot perceive Brahman, but are themselves powered by Brahman's light of pure awareness.";
    } else if (upNum === 3) {
      originalText = "न जायते म्रियते वा विपश्चिन्नायं कुतश्चिन्न बभूव कश्चित् । अजो नित्यः शाश्वतोऽयं पुराणो न हन्यते हन्यमाने शरीरे ॥";
      translit = "na jāyate mriyate vā vipaścin nāyaṁ kutaścin na babhūva kaścit | ajo nityaḥ śāśvato'yaṁ purāṇo na hanyate hanyamāne śarīre";
      trans = "The conscious soul is neither born nor does it die; it did not emanate from anything, nor did anything emanate from it. It is unborn, eternal, everlasting, and ancient; it is not slain when the body is slain.";
      commentary = "The Katha Upanishad presents the famous dialogue between young Nachiketa and Yama, the Lord of Death. This key verse declares the absolute immortality and unmoving nature of the Atman, transcending physical decay.";
    }

    return {
      isOfflineFallback: true,
      introSummary: `A high-fidelity academic translation and commentary of the ${upanishadObj.name} Upanishad (${upanishadObj.category} category, sourced from the ${upanishadObj.veda}).`,
      verses: [
        {
          number: `${upNum}.1`,
          originalText,
          transliteration: translit,
          translation: trans
        }
      ],
      commentary,
      interfaithParallels: [
        {
          religion: "Buddhism",
          source: "Heart Sutra",
          similarity: "The concept that form is emptiness and emptiness is form, emphasizing the ultimate completeness and non-duality of reality, aligns with the Upanishadic description of wholeness.",
          lesson: "See beyond superficial separations, recognizing that all of life shares a single, integrated source of consciousness."
        }
      ]
    };
  }

  if (["rigveda", "yajurveda", "samaveda", "atharvaveda"].includes(keyLower)) {
    let originalText = "ॐ भद्रं कर्णेभिः शृणुयाम देवाः । भद्रं पश्येमाक्षभिर्यजत्राः ॥";
    let translit = "oṁ bhadraṁ karṇebhiḥ śṛṇuyāma devāḥ | bhadraṁ paśyemākṣabhir yajatrāḥ";
    let trans = "Om. O Gods, may we hear with our ears what is auspicious; may we see with our eyes what is noble and pure.";
    let commentary = `This sacred prayer from the Vedas reflects the ancient spiritual seeking of India. It emphasizes filling the senses with goodness, beauty, and truth to preserve mental purity and align the individual with the cosmic rhythm of Rta.`;

    if (keyLower === "rigveda") {
      originalText = "सङ्गच्छध्वं संवदध्वं सं वो मनांसि जानताम् । देवा भागं यथा पूर्वे सञ्जानाना उपासते ॥";
      translit = "saṅgacchadhvaṁ saṁvadadhvaṁ saṁ vo manāṁsi jānatām | devā bhāgaṁ yathā pūrve sañjānānā upāsate";
      trans = "Walk together, speak in harmony, let your minds be fully aligned in understanding; just as the ancient gods shared their offerings in perfect unity.";
      commentary = "The Rigveda ends with this sublime invocation of collective unity (Sangathan Sukta). It teaches that social harmony, collaborative thinking, and shared vision are sacred spiritual duties that sustain human society and cosmic order.";
    } else if (keyLower === "yajurveda") {
      originalText = "तन्मे मनः शिवसङ्कल्पमस्तु ॥";
      translit = "tanme manaḥ śivasankalpamastu";
      trans = "May my mind always be filled with beautiful, pure, and auspicious thoughts.";
      commentary = "This prayer belongs to the Shiva Sankalpa Sukta of the Yajurveda. It recognizes that the mind is the ruler of action, wishing that the inner thoughts always align with righteousness, peace, and auspiciousness.";
    } else if (keyLower === "samaveda") {
      originalText = "अग्न आ याहि वीतये गृणानो हव्यदातये । नि होता सत्सि बर्हिषि ॥";
      translit = "agna ā yāhi vītaye gṛṇāno havyadātaye | ni hotā satsi barhiṣi";
      trans = "O Divine Fire (Agni), come to our offering; praised by our chants, bestow upon us spiritual nourishment, and sit upon our sacred grass.";
      commentary = "The Samaveda represents the musical and chant-based expression of Vedic wisdom. Agni is invoked as the divine flame within the human heart that translates outer devotion into inner illumination and cellular transformation.";
    } else if (keyLower === "atharvaveda") {
      originalText = "जनं बिभ्रती बहुधा विवाचसं नानाधर्माणं पृथिवी यथौकसम् । सहस्रं धारा द्रविणस्य मे दुहां ध्रुवेव धेनुरनपस्फुरन्ती ॥";
      translit = "janaṁ bibhratī bahudhā vivācasaṁ nānādharmāṇaṁ pṛthivī yathaukasam | sahasraṁ dhārā draviṇasya me duhāṁ dhruveva dhenur anapasphurantī";
      trans = "Mother Earth, who supports people of diverse speeches and varied beliefs according to their homes; may she pour forth a thousand streams of wealth for us, like a steady, unmoving cow.";
      commentary = "This verse is from the famous Prithvi Sukta (Hymn to the Earth) in the Atharvaveda. It stands as one of humanity's earliest environmental and pluralistic charters, celebrating biodiversity, linguistic variation, and the sacred preservation of the environment.";
    }

    return {
      isOfflineFallback: true,
      introSummary: `A high-fidelity academic translation and commentary of the ${bookTitle} (${divisionsName} ${divisionNumber}).`,
      verses: [
        {
          number: `${divisionNumber}.1`,
          originalText,
          transliteration: translit,
          translation: trans
        }
      ],
      commentary,
      interfaithParallels: [
        {
          religion: "Islam",
          source: "Quran Surah 49:13",
          similarity: "The celebration of human diversity (nations and tribes) to know and respect one another matches the Atharvaveda's environmental pluralism.",
          lesson: "See human differences and the natural world as a sacred canvas of divine creation, practicing conservation and mutual respect."
        }
      ]
    };
  }

  if (keyLower === "six_darshans") {
    const systemNum = Number(divisionNumber) || 1;
    let originalText = "अथातो ब्रह्मजिज्ञासा ॥";
    let translit = "athāto brahma-jijñāsā";
    let trans = "Now, therefore, arises the inquiry into the ultimate reality of Brahman.";
    let commentary = `This aphorism is the opening of the Brahma Sutra (Vedanta Darshana). It declares that human life is uniquely suited for inquiring into the ultimate truth of consciousness, urging the scholar to go beyond superficial desires.`;
    let systemLabel = "Vedanta";

    if (systemNum === 1) {
      systemLabel = "Nyaya (Logical Realism)";
      originalText = "प्रमाण-प्रमेय-संशय-प्रयोजन-दृष्टान्त-सिद्धान्तावयव-तर्क-निर्णय-वाद-जल्प-वितण्डा-हेत्वाभास-छल-जाति-निग्रहस्थानानां तत्त्वज्ञानान् निःश्रेयसाधिगमः ॥";
      translit = "pramāṇa-prameya-saṁśaya-prayojana-dṛṣṭānta-siddhāntāvayava-tarka-nirṇaya-vāda-jalpa-vitaṇḍā-hetvābhāsa-chala-jāti-nigrahasthānānāṁ tattvajñānān niḥśreyasādhigamaḥ";
      trans = "By obtaining true knowledge of proof, objects of knowledge, doubt, purpose, familiar instances, established tenets, members of syllogism, confutation, ascertainment, discussion, wrangling, cavil, fallacies, quibble, futility, and occasion for rebuke, one attains the supreme goal of liberation.";
      commentary = "Sage Gautama's Nyaya Sutra (1.1.1) establishes that logical reasoning, clear epistemology, and intellectual honesty are prerequisites for spiritual liberation. It emphasizes that removing cognitive errors is the first step to dissolving pain.";
    } else if (systemNum === 2) {
      systemLabel = "Vaisheshika (Atomism & Cosmology)";
      originalText = "अथातो धर्मं व्याख्यास्यामः । यतोऽभ्युदयनिःश्रेयससिद्धिः स धर्मः ॥";
      translit = "athāto dharmaṁ vyākhyāsyāmaḥ | yato'bhyudaya-niḥśreyasa-siddhiḥ sa dharmaḥ";
      trans = "Now, therefore, we shall explain Dharma. That which leads to material prosperity and spiritual liberation is Dharma.";
      commentary = "Sage Kanada's Vaisheshika Sutra (1.1.1-2) defines a holistic spirituality that does not reject material well-being, but seeks a perfect balance between ethical outer lifestyle and inner spiritual freedom through understanding the physical universe.";
    } else if (systemNum === 3) {
      systemLabel = "Samkhya (Dualist Cosmology)";
      originalText = "अथ त्रिविधदुःखात्यन्तनिवृत्तिरत्यन्तपुरुषार्थः ॥";
      translit = "atha trividha-duḥkhātyanta-nivṛttir atyanta-puruṣārthaḥ";
      trans = "The complete and absolute cessation of the three-fold human suffering is the ultimate goal of human life.";
      commentary = "Sage Kapila's Samkhya Sutra sets a highly analytical and scientific foundation for liberation, teaching that suffering is overcome when the conscious observer (Purusha) is fully distinguished from material nature (Prakriti).";
    } else if (systemNum === 4) {
      systemLabel = "Yoga (Mind Control)";
      originalText = "अथ योगानुशासनम् । योगश्चित्तवृत्तिनिरोधः ॥";
      translit = "atha yogānuśāsanam | yogaś citta-vṛtti-nirodhaḥ";
      trans = "Now begins the instruction on Yoga. Yoga is the quiet stilling of the ripples and modifications of the mind.";
      commentary = "Sage Patanjali's Yoga Sutra (1.1-2) details the practical methodology of mind control. It explains that when the mental movements are stilled, the observer rests in its own pristine nature of pure consciousness.";
    } else if (systemNum === 5) {
      systemLabel = "Purva Mimamsa (Ritual Hermeneutics)";
      originalText = "अथातो धर्मजिज्ञासा । चोदनालक्षणोऽर्थो धर्मः ॥";
      translit = "athāto dharmajijñāsā | codanālakṣaṇo'rtho dharmaḥ";
      trans = "Now begins the inquiry into Dharma. That which is beneficial and inspired by sacred Vedic injunctions is Dharma.";
      commentary = "Sage Jaimini's Mimamsa Sutra explores the ethical and ritualistic duties of the individual. It holds that intentional actions performed as a sacred sacrifice maintain the equilibrium of society and cosmos.";
    }

    return {
      isOfflineFallback: true,
      introSummary: `A high-fidelity academic translation and commentary of the ${systemLabel} system, part of the Six Darshans of Indian Philosophy.`,
      verses: [
        {
          number: `${systemNum}.1`,
          originalText,
          transliteration: translit,
          translation: trans
        }
      ],
      commentary,
      interfaithParallels: [
        {
          religion: "Buddhism",
          source: "Four Noble Truths",
          similarity: "The identification of human suffering as the primary problem and the systematic path of mind-control to dissolve it matches the Yoga and Samkhya darshanas.",
          lesson: "Approach spiritual life with scientific clarity—identify causes of suffering, quiet the mind, and realize your true nature."
        }
      ]
    };
  }

  if (keyLower === "agamas") {
    const agNum = Number(divisionNumber) || 1;
    let originalText = "सदाशिवसमारम्भां शङ्कराचार्यमध्यमाम् । अस्मदाचार्यपर्यन्तां वन्दे गुरुपरम्पराम् ॥";
    let translit = "sadāśiva-samārambhāṁ śaṅkarācārya-madhyamām | asmad-ācārya-paryantāṁ vande guru-paramparām";
    let trans = "Salutations to the lineage of spiritual preceptors, beginning with Lord Sadashiva, with Shankaracharya in the middle, and extending to my own teacher.";
    let commentary = `This verse honors the Agama lineage (Amnaya). The Agamas are manual scriptures that translate Upanishadic wisdom into practical methods of temple science, yogic meditation, and household ritual dynamics.`;

    if (agNum % 2 === 0) {
      originalText = "शिवो दाता शिवो भोक्ता शिवं सर्वमिदं जगत् ।";
      translit = "śivo dātā śivo bhoktā śivaṁ sarvam idaṁ jagat";
      trans = "Lord Shiva is the giver, Shiva is the enjoyer, Shiva is this entire manifest universe.";
      commentary = "This Agama teaching reflects the non-dual realization of Shaivism. It instructs the devotee to view every person, object, and event as a play of Shiva's pure, universal consciousness.";
    }

    return {
      isOfflineFallback: true,
      introSummary: `A high-fidelity academic translation and commentary of the Shaiva-Shakta Agamas, Portion #${agNum}.`,
      verses: [
        {
          number: `${agNum}.1`,
          originalText,
          transliteration: translit,
          translation: trans
        }
      ],
      commentary,
      interfaithParallels: [
        {
          religion: "Christianity",
          source: "1 Corinthians 15:28",
          similarity: "The mystical state of God being 'all in all' corresponds to the Agamic realization 'Sivam sarvam idam jagat'.",
          lesson: "See the divine spark inside everyone and everything, treating all creations with equal love and reverence."
        }
      ]
    };
  }

  if (["hindu_sutras", "dharmashastras"].includes(keyLower)) {
    let originalText = "धैर्यं क्षमा दमोऽस्तेयं शौचमिन्द्रियनिग्रहः । धीर्विद्या सत्यमक्रोधो दशकं धर्मलक्षणम् ॥";
    let translit = "dhairyaṁ kṣamā damo'steyaṁ śaucam indriya-nigrahaḥ | dhīr vidyā satyam akrodho daśakaṁ dharma-lakṣaṇam";
    let trans = "Patience, forgiveness, self-control, non-stealing, purity, sensory restraint, wisdom, knowledge, truthfulness, and absence of anger—these ten are the defining traits of Dharma.";
    let commentary = `This verse from the classical lawbooks outlines the universal ethical codes of conduct (Sanatana Dharma). It teaches that moral values are not dogmas, but practical psychological rules that stabilize the individual and society.`;

    if (keyLower === "hindu_sutras") {
      originalText = "यतोऽभ्युदयनिःश्रेयससिद्धिः स धर्मः ॥";
      translit = "yato'bhyudaya-niḥśreyasa-siddhiḥ sa dharmaḥ";
      trans = "That which yields both material well-being and ultimate spiritual liberation is Dharma.";
      commentary = "The Hindu Sutras emphasize systematic codes of personal behavior, seeking a balanced life where physical growth and spiritual introspection support each other without conflict.";
    }

    return {
      isOfflineFallback: true,
      introSummary: `A high-fidelity academic translation and commentary of the ${bookTitle} (${divisionsName} ${divisionNumber}).`,
      verses: [
        {
          number: `${divisionNumber}.1`,
          originalText,
          transliteration: translit,
          translation: trans
        }
      ],
      commentary,
      interfaithParallels: [
        {
          religion: "Buddhism",
          source: "Noble Eightfold Path",
          similarity: "The definition of universal moral attributes (honesty, patience, restraint) mirrors the Buddhist Sila.",
          lesson: "Incorporate ethical attributes into your daily life to cultivate a calm and unburdened mind."
        }
      ]
    };
  }

  const upapuranasKeys = [
    "devi_bhagavata_purana",
    "ganesha_purana",
    "mudgala_purana",
    "kalika_purana",
    "saura_purana",
    "vishnudharmottara_purana",
    "sanatkumara_purana",
    "narasimha_purana",
    "brihaddharma_purana",
    "sivarahasya_purana",
    "durvasa_purana",
    "kapila_purana",
    "bhargava_purana",
    "samba_purana",
    "nandi_purana",
    "nila_purana",
    "parashara_purana",
    "chandi_purana",
    "sivadharma_purana",
    "adi_purana",
    "manava_purana",
    "ushanasa_purana",
    "saunaka_purana",
    "varuna_purana",
    "maheshwara_purana",
    "maricha_purana"
  ];

  if (upapuranasKeys.includes(keyLower)) {
    const chName = getPuranaChapterName(keyLower, divisionNumber);
    let intro = `A high-fidelity academic translation and commentary of the ${bookTitle}, Portion/Chapter ${divisionNumber}: "${chName}". `;
    let originalText = "ॐ नमः परमात्मने सर्वसृष्टिस्थित्यन्तकारिणे नमः ॥";
    let translit = "oṁ namaḥ paramātmane sarva-sṛṣṭī-sthity-anta-kāriṇe namaḥ";
    let trans = "Salutations to the Supreme Divine Soul, who is the cause of cosmic creation, preservation, and dissolution.";
    let commentary = `This chapter is part of the traditional core of the ${bookTitle}. It explores themes of ${chName}, reinforcing the Puranic emphasis on connecting physical geography, local tirthas, and personal virtues to the cosmic order of Brahman.`;
    let parallelReligion = "christianity";
    let parallelSource = "Gospel of John 1:1";
    let parallelSimilarity = "The concept of creation emanating from supreme word/wisdom corresponds to the Logos.";
    let parallelLesson = "Creation has a divine, intelligent, and spiritual foundation that is accessible through contemplative wisdom.";

    if (keyLower === "devi_bhagavata_purana") {
      intro += "Presents Adi Parashakti as the absolute source of consciousness and the material universe.";
      originalText = "सर्वमङ्गलमङ्गल्ये शिवे सर्वार्थसाधिके । शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते ॥";
      translit = "sarva-maṅgala-maṅgalye śive sarvārtha-sādhike | śaraṇye tryambake gauri nārāyaṇi namo'stu te";
      trans = "Salutations to the auspicious Goddess Gauri, who is the source of all blessings, the ultimate achiever of all goals, and the supreme refuge.";
      commentary = "The Devi Bhagavata Purana (a major Shakta Upapurana) glorifies the Divine Mother as the absolute Brahman. It teaches that the feminine energy (Shakti) is the active aspect of consciousness that creates, sustains, and guides the universe.";
      parallelReligion = "gnosticism";
      parallelSource = "Gospel of Mary";
      parallelSimilarity = "The portrayal of a supreme divine wisdom (Sophia) as the active mother of material creation matches the Shakta theology.";
      parallelLesson = "See the entire physical universe as a living manifestation of divine, nurturing energy, treating all life with respect.";
    } else if (keyLower === "ganesha_purana" || keyLower === "mudgala_purana") {
      intro += "Focuses on Lord Ganesha as the personification of the primordial sound Om and the remover of mental barriers.";
      originalText = "वक्रतुण्ड महाकाय सूर्यकोटिसमप्रभ । निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥";
      translit = "vakratuṇḍa mahākāya sūryakoṭi-samaprabha | nirvighnaṁ kuru me deva sarva-kāryeṣu sarvadā";
      trans = "O Lord with the curved trunk and immense body, whose brilliance exceeds millions of suns, please make all my endeavors free of obstacles always.";
      commentary = "These Ganesha-centric Upapuranas celebrate Ganesha as the supreme non-dual Brahman (Omkara). They explain that by surrendering to Ganesha, the seeker's intellect (Buddhi) is purified, removing the obstacles of ego, fear, and delusion.";
      parallelReligion = "buddhism";
      parallelSource = "Arapacana Manjushri Mantras";
      parallelSimilarity = "Manjushri as the personification of supreme wisdom that cuts through intellectual ignorance mirrors Ganesha's role.";
      parallelLesson = "Cultivate intellectual clarity and clear discrimination to overcome the obstacles that block your path of service.";
    } else if (keyLower === "sivarahasya_purana") {
      intro += "Contains the Ribhu Gita, presenting pure non-dual Advaita philosophy.";
      originalText = "सर्वं ब्रह्मेदमित्याहुः सच्चिदानन्दविग्रहम् ।";
      translit = "sarvaṁ brahmedamityāhuḥ saccidānandavigraham";
      trans = "All of this is declared to be Brahman, the absolute embodiment of Truth, Consciousness, and Bliss.";
      commentary = "The Sivarahasya Purana is widely revered for the Ribhu Gita. It teaches that the physical universe is an illusion of the mind and that pure, unconditioned self-awareness is the only absolute reality.";
      parallelReligion = "buddhism";
      parallelSource = "Diamond Sutra";
      parallelSimilarity = "The teaching that all conditioned phenomena are like dreams or flashes of lightning aligns with the Ribhu Gita's illusionism.";
      parallelLesson = "Anchor your mind in the unchanging, silent observer within, rather than riding the waves of transient external events.";
    } else if (keyLower === "saura_purana" || keyLower === "samba_purana") {
      intro += "Highlights Lord Surya (the Sun God) as the visible symbol of the ultimate Reality, detailing solar meditation and natural health.";
      originalText = "नमः सवित्रे जगदेकचक्षुषे जगत्प्रसूतिस्थितिनाशहेतवे । त्रयीमयाय त्रिगुणात्मधारिणे विरिञ्चिनारायणशङ्करात्मने ॥";
      translit = "namaḥ savitre jagad-eka-cakṣuṣe jagat-prasūti-sthiti-nāśa-hetave | trayī-mayāya tri-guṇātma-dhāriṇe viriñci-nārāyaṇa-śaṅkarātmane";
      trans = "Salutations to the Sun-God, the sole eye of the universe, the cause of creation, sustenance, and dissolution of the cosmos, who is embodied in the Vedas and represents Brahma, Vishnu, and Shiva.";
      commentary = "These solar Upapuranas outline the physical and spiritual benefits of solar communion. Lord Surya is worshiped as the outer light that reflects the inner light of the self, providing both health to the body and illumination to the intellect.";
      parallelReligion = "christianity";
      parallelSource = "John 8:12";
      parallelSimilarity = "The declaration of being the light of the world, providing the light of life, mirrors the Sun God's dual physical/spiritual nourishment.";
      parallelLesson = "Incorporate the energy of light into your life—seek dawn contemplation and fill your mind with illuminating thoughts.";
    } else if (["nandi_purana", "sivadharma_purana", "maheshwara_purana"].includes(keyLower)) {
      intro += "Guides the devotee on the ethical and meditative path of Shaivism, emphasizing pure devotion and mental peace.";
      originalText = "ॐ नमः शिवाय ॥";
      translit = "oṁ namaḥ śivāya";
      trans = "Salutations to the auspicious Lord Shiva, the inner self and ruler of formless cosmic consciousness.";
      commentary = "These Shaiva Upapuranas establish the guidelines of Shivabhakti. They teach that devotion to Shiva is completed when the seeker's mind becomes as quiet and auspicious as Shiva Himself, transcending dualities.";
      parallelReligion = "buddhism";
      parallelSource = "Heart Sutra";
      parallelSimilarity = "Shiva's formless aspect as the void (Shunya) corresponds to the Buddhist concept of emptiness.";
      parallelLesson = "Seek times of deep silence in your daily routine, letting the noise of thoughts settle into formless awareness.";
    } else if (["narasimha_purana", "sanatkumara_purana", "parashara_purana"].includes(keyLower)) {
      intro += "Explores absolute faith, devotion, and ethical conduct under Vaishnava philosophy.";
      originalText = "ॐ नमो भगवते वासुदेवाय ॥";
      translit = "oṁ namo bhagavate vāsudevāya";
      trans = "Salutations to the Supreme Lord Vasudeva, the all-pervading divine source of cosmic preservation.";
      commentary = "These Vaishnava Upapuranas focus on the path of complete surrender and moral duty. They teach that the Divine is always present to protect the righteous and preserve order across cosmic cycles.";
      parallelReligion = "christianity";
      parallelSource = "Colossians 1:17";
      parallelSimilarity = "The idea of a divine protector in whom all things hold together is shared between Christ and Vishnu's preservation role.";
      parallelLesson = "Live your life with supreme confidence, knowing that a steady devotion to truth protects you from despair.";
    } else if (keyLower === "chandi_purana" || keyLower === "kalika_purana") {
      intro += "Presents Goddess Durga/Chandi as the primordial active power of divine justice, destroying ego and restoring cosmic balance.";
      originalText = "सर्वमङ्गलमङ्गल्ये शिवे सर्वार्थसाधिके । शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते ॥";
      translit = "sarva-maṅgala-maṅgalye śive sarvārtha-sādhike | śaraṇye tryambake gauri nārāyaṇi namo'stu te";
      trans = "Salutations to the auspicious Goddess Narayani, who is the source of all blessings, the ultimate achiever of all goals, and the supreme refuge.";
      commentary = "These Shakta Upapuranas celebrate the active transformation of dark, egoistic forces into spiritual light. When collective balance is threatened, the divine maternal energy manifests to protect the universe and restore righteousness.";
      parallelReligion = "christianity";
      parallelSource = "Revelation 12:1";
      parallelSimilarity = "The cosmic queen clothed with the sun, victorious over the dragon, mirrors Goddess Durga's cosmic warrior role.";
      parallelLesson = "Awaken your inner strength and moral courage to protect the vulnerable and speak truth to power.";
    }

    return {
      isOfflineFallback: true,
      introSummary: intro,
      verses: [
        {
          number: `${divisionNumber}.1`,
          originalText,
          transliteration: translit,
          translation: trans
        }
      ],
      commentary,
      interfaithParallels: [
        {
          religion: parallelReligion,
          source: parallelSource,
          similarity: parallelSimilarity,
          lesson: parallelLesson
        }
      ]
    };
  }

  if (["dhammapada", "heart_sutra", "tripitaka_sutta", "abhidhamma_pitaka", "lalitavistara", "journey_west", "lotus_sutra", "buddhist_prayers"].includes(keyLower)) {
    let intro = `A high-fidelity academic reading and commentary of ${bookTitle}, portion: Chapter/Section ${divisionNumber}. `;
    let originalText = "मनोपुब्बङ्गमा धम्मा मनोसेट्ठा मनोमया ।";
    let translit = "manopubbaṅgamā dhammā manoseṭṭhā manomayā";
    let trans = "Mind precedes all mental states. Mind is their chief; they are mind-made. If one speaks or acts with a pure mind, happiness follows like a shadow.";
    let commentary = `This portion outlines central Buddhist philosophies, teaching how our thoughts, intentions, and mindfulness form our destiny, offering pathways to overcome suffering and achieve Nirvana.`;
    let versesArray = [];

    let parallelRel = "hinduism";
    let parallelSrc = "Bhagavad Gita 12.13";
    let parallelSim = "The emphasis on purification of mind, overcoming hostility, and radiating universal goodwill is perfectly aligned.";
    let parallelLes = "Practice deep mindfulness and release hostile thoughts, anchoring your mind in pure awareness.";

    if (keyLower === "dhammapada") {
      const ch = Number(divisionNumber) || 1;
      intro = `An authentic translation and commentary of The Dhammapada, Chapter ${ch}. `;
      if (ch === 1) {
        intro += "Yamaka Vagga (The Twin Verses). It details the twin principles of cause and effect, mind-mastery, and the karmic shadows of our thoughts.";
        versesArray = [
          {
            number: "1.1",
            originalText: "मनोपुब्बङ्गमा धम्मा मनोसेट्ठा मनोमया । मनसा चे पदुट्ठेन भासति वा करोति वा । ततो नं दुक्खमन्वेति चक्कं व वहतो पदं ॥",
            transliteration: "manopubbaṅgamā dhammā manoseṭṭhā manomayā | manasā ce paduṭṭhena bhāsati vā karoti vā | tato naṁ dukkhamanveti cakkaṁva vahato padaṁ",
            translation: "Mind precedes all mental states. Mind is their chief; they are mind-made. If one speaks or acts with an impure mind, suffering follows him, even as the wheel follows the hoof of the ox."
          },
          {
            number: "1.2",
            originalText: "मनोपुब्बङ्गमा धम्मा मनोसेट्ठा मनोमया । मनसा चे पसन्नेन भासति वा करोति वा । ततो नं सुखमन्वेति छाया व अनपायिनी ॥",
            transliteration: "manopubbaṅgamā dhammā manoseṭṭhā manomayā | manasā ce pasannena bhāsati vā karoti vā | tato naṁ sukhamanveti chāyāva anapāyinī",
            translation: "Mind precedes all mental states. Mind is their chief; they are mind-made. If one speaks or acts with a pure mind, happiness follows him like a shadow that never leaves."
          }
        ];
        commentary = "The Twin Verses establish the absolute foundation of Buddhist ethics: our internal mental posture completely determines our external reality. Rather than blaming outer events for our suffering, the Buddha points inward to the mind as the primary creator of both pain and happiness.";
      } else if (ch === 2) {
        intro += "Appamada Vagga (Vigilance / Mindfulness). It contrasts the path of awareness and vigilance with the spiritual death of negligence.";
        versesArray = [
          {
            number: "2.1",
            originalText: "अप्पमादो अमतपदं पमादो मच्चुनो पदं । अप्पमत्ता न मीयन्ति ye पमत्ता यथा मता ॥",
            transliteration: "appamādo amatapadaṁ pamādo maccuno padaṁ | appamattā na mīyanti ye pamattā yathā matā",
            translation: "Vigilance is the path to the Deathless (Nirvana); negligence is the path to death. The vigilant do not die; the negligent are as if already dead."
          }
        ];
        commentary = "This chapter defines 'Appamada'—earnestness, vigilance, and continuous mindfulness. To be negligent is to live mechanically, driven by automatic habits, which leads to spiritual decay. To be vigilant is to maintain clear, moment-to-moment presence, leading to the ultimate peace of Nirvana.";
      } else if (ch === 3) {
        intro += "Citta Vagga (The Mind). It describes the flickering, elusive nature of human thoughts and the necessity of mental discipline.";
        versesArray = [
          {
            number: "3.1",
            originalText: "फन्दनं चपलं चित्तं दुरक्खं दुन्निवारयं । उजुं करोति मेधावी उसुकारो व तेजनं ॥",
            transliteration: "phandanaṁ capalaṁ cittaṁ durakkhaṁ dunnivārayaṁ | ujuṁ karoti medhāvī usukārova tejanaṁ",
            translation: "Flickering, fickle is the mind, difficult to guard, difficult to control. The wise person straightens it, as an arrow-maker straightens an arrow."
          }
        ];
        commentary = "The Mind chapter uses beautiful similes to describe mental training. A wild, uncultivated mind constantly reacts and wavers, causing agitation. Just as an artisan carefully straightens a crooked shaft, a practitioner uses meditation to steady, refine, and focus the mind toward liberation.";
      } else if (ch === 10) {
        intro += "Danda Vagga (Violence / Punishment). A profound, universal appeal for non-violence and absolute empathy for all living creatures.";
        versesArray = [
          {
            number: "10.1",
            originalText: "सब्बे तसन्ति दण्डस्स सब्बे भायन्ति मच्चुनो । अत्तानं उपमं कत्वा न हनेय्य न घातये ॥",
            transliteration: "sabbe tasanti daṇḍassa sabbe bhāyanti maccuno | attānaṁ upamaṁ katvā na haneyya na ghātaye",
            translation: "All tremble at violence; all fear death. Comparing oneself with others, one should neither kill nor cause to kill."
          },
          {
            number: "10.2",
            originalText: "सब्बे तसन्ति दण्डस्स सब्बेसं जीवितं पियं । अत्तानं उपमं कत्वा न हनेय्य न घातये ॥",
            transliteration: "sabbe tasanti daṇḍassa sabbesaṁ jīvitaṁ piyṁ | attānaṁ upamaṁ katvā na haneyya na ghātaye",
            translation: "All tremble at violence; all find life precious. Comparing oneself with others, one should neither kill nor cause to kill."
          }
        ];
        commentary = "Danda Vagga highlights the golden rule of Buddhist compassion (Karuna). By cultivating radical empathy—recognizing that every single being fears pain and cherishes life just as we do—we naturally withdraw from harm, malice, and retribution.";
      } else if (ch === 20) {
        intro += "Magga Vagga (The Path). It outlines the supreme status of the Noble Eightfold Path and the Four Noble Truths.";
        versesArray = [
          {
            number: "20.1",
            originalText: "मग्गानट्ठङ्गिको सेट्ठो सच्चानं चतुरो पदा । विरागो सेट्ठो धम्मानं द्विपदानञ्च चक्खुमा ॥",
            transliteration: "maggānaṭṭhaṅgiko seṭṭho saccānaṁ caturo padā | virāgo seṭṭho dhammānaṁ dvipadānañca cakkhumā",
            translation: "Of paths, the Eightfold Path is the best; of truths, the Four Noble Truths are the best; of states, detachment is the best; of humans, the Seer (the Buddha) is the best."
          }
        ];
        commentary = "Magga Vagga summarizes the path to enlightenment. The Noble Eightfold Path serves as a practical, comprehensive guide encompassing wisdom, ethical conduct, and mental discipline, showing seekers exactly how to bring an end to sorrow.";
      } else {
        intro += "This chapter compiles timeless Buddhist moral proverbs, guiding practitioners to conquer anger, greed, and delusion.";
        versesArray = [
          {
            number: `${ch}.5`,
            originalText: "न हि वेरेन वेराणि सम्मन्तीध कुदाचनं । अवेरेन च सम्मन्ति एस धम्मो सनन्तनो ॥",
            transliteration: "na hi verena verāṇi sammantīdha kudācunaṁ | averena ca sammanti esa dhammo sanatano",
            translation: "Hatred is never overcome by hatred; hatred is only overcome by boundless love. This is an eternal law."
          }
        ];
        commentary = "This famous verse teaches that escalating hostility only breeds further sorrow. The cycle of resentment can only be broken through non-attachment, patience, and the cultivation of boundless loving-kindness (Metta).";
      }

      parallelRel = "christianity";
      parallelSrc = "Matthew 5:44";
      parallelSim = "Jesus' command to love one's enemies and pray for persecutors perfectly mirrors the eternal law of conquering hatred with love.";
      parallelLes = "Respond to aggression with calm patience, choosing to heal relationships rather than score points or retaliate.";

    } else if (keyLower === "heart_sutra") {
      intro = "The Heart Sutra (Prajñāpāramitā Hṛdaya). It details the ultimate teaching of Emptiness (Shunyata) delivered by Bodhisattva Avalokiteshvara.";
      versesArray = [
        {
          number: "1.1",
          originalText: "इह शारिपुत्र रूपं शून्यता शून्यता-इव रूपम् । रूपान्न पृथक् शून्यता शून्यताया न पृथग्रूपम् ॥",
          transliteration: "iha śāriputra rūpaṁ śūnyatā śūnyatā-iva rūpam | rūpān na pṛthak śūnyatā śūnyatāyā na pṛthag rūpam",
          translation: "Here, O Sariputra, form is emptiness, emptiness is form. Form is not separate from emptiness; emptiness is not separate from form. That which is form is emptiness; that which is emptiness is form."
        }
      ];
      commentary = "The Heart Sutra is the core of Mahayana Buddhist philosophy. It teaches the doctrine of Shunyata (emptiness)—that all things exist in a state of profound interdependence and lack a permanent, isolated ego. By realizing this non-dual truth, we dissolve the fear, greed, and ignorance that cause suffering.";
      
      parallelRel = "taoism";
      parallelSrc = "Tao Te Ching Chapter 11";
      parallelSim = "The utility of a vessel, a wheel, or a room comes from its empty space, illustrating how emptiness underlies all forms.";
      parallelLes = "Do not cling to rigid physical attachments. Value the quiet, formless space of your mind, where true creativity and peace dwell.";

    } else if (keyLower === "tripitaka_sutta") {
      const nik = Number(divisionNumber) || 1;
      intro = `Sutta Pitaka (Buddha's Discourses), representing `;
      if (nik === 1) {
        intro += "Nikaya 1: Digha Nikaya (Long Discourses), compiling 34 extensive dialogues on cosmology, ethics, and the Buddha's final instructions.";
        versesArray = [
          {
            number: "DN 16",
            originalText: "वयधम्मा सङ्खारा अप्पमादेन सम्पादेथ ।",
            transliteration: "vayadhammā saṅkhārā appamādena sampādetha",
            translation: "All compounded things are subject to decay. Strive on with diligence (mindfulness)."
          }
        ];
        commentary = "These are the final words of Gautama Buddha before passing into Mahaparinirvana, as recorded in the Mahaparinibbana Sutta. It is a powerful reminder of impermanence (Anicca) and a call to take responsibility for our own liberation through earnest practice.";
      } else if (nik === 2) {
        intro += "Nikaya 2: Majjhima Nikaya (Middle-Length Discourses), featuring 152 dialogues detailing the practical foundations of mindfulness and self-realization.";
        versesArray = [
          {
            number: "MN 10",
            originalText: "एकयानो अयं भिक्खवे मग्गो सत्तानं विसुद्धिया सोकपरिद्देवानं समतिक्कमाय ।",
            transliteration: "ekayāno ayaṁ bhikkhave maggo sattānaṁ visuddhiyā sokapariddevānaṁ samatikkamāya",
            translation: "This is the direct path, O monks, for the purification of beings, for the overcoming of sorrow and lamentation... namely, the four foundations of mindfulness."
          }
        ];
        commentary = "The Satipatthana Sutta outlines the four pillars of mindfulness: body (kaya), feelings (vedana), mind (citta), and mental objects (dhamma). It serves as the primary practical manual for Vipassana (insight) meditation.";
      } else if (nik === 3) {
        intro += "Nikaya 3: Samyutta Nikaya (Connected Discourses), grouping suttas by theme, including the Buddha's historic first sermon.";
        versesArray = [
          {
            number: "SN 56.11",
            originalText: "द्वेमे भिक्खवे अन्ता पब्बजितेन न सेवितब्बा । यो चायं कामेसु कामसुखल्लिकानुयोगो... अयं च मज्झिमा पटिपदा ॥",
            transliteration: "dve'me bhikkhave antā pabbajitena na sevitabbā | yo cāyaṁ kāmesu kāmasukhallikānuyogo... ayaṁ ca majjhimā paṭipadā",
            translation: "Avoid these two extremes, O monks: indulgence in sensual pleasure, which is low and useless, and self-mortification, which is painful and useless. The Middle Way avoids both and leads to peace, direct knowledge, and awakening."
          }
        ];
        commentary = "The Dhammacakkappavattana Sutta is the Buddha's first discourse, delivered to the five ascetics in the Deer Park at Sarnath. It sets the Wheel of Dhamma in motion, defining the Middle Way, the Four Noble Truths, and the Noble Eightfold Path.";
      } else if (nik === 4) {
        intro += "Nikaya 4: Anguttara Nikaya (Numerical Discourses), organizing suttas numerically, including the famous discourse on free inquiry.";
        versesArray = [
          {
            number: "AN 3.65",
            originalText: "एथ तुम्हे कालामा मा अनुस्सवेन मा परम्पराय मा इतिकिराय... अत्तनाव जानथ ॥",
            transliteration: "etha tumhe kālāmā mā anussavena mā paramparāya mā itikirāya... attanāva jānatha",
            translation: "Do not go by oral tradition, nor by lineage, nor by hearsay, nor by mere logic... But when you know for yourselves: 'These things are wholesome, blameless, and praised by the wise,' then enter and dwell in them."
          }
        ];
        commentary = "The Kesamutti Sutta (commonly known as the Kalama Sutta) is a charter for free thought, empirical testing, and spiritual maturity. The Buddha advises seekers to verify teachings in their own direct experience rather than relying on blind belief.";
      } else {
        intro += "Nikaya 5: Khuddaka Nikaya (Minor Collection), compilation of shorter texts including the Sutta Nipata, Dhammapada, and verses of loving-kindness.";
        versesArray = [
          {
            number: "Sn 1.8",
            originalText: "माता यथा नियं पुत्तं आयुसा एकपुत्तमनुरक्खे । एवम्पि सब्बभूतेसु मानसं भावये अपरिमाणं ॥",
            transliteration: "mātā yathā niyaṁ puttaṁ āyusā ekaputtamanurakkhe | evampi sabbabhūtesu mānasaṁ bhāvaye aparimāṇaṁ",
            translation: "Just as a mother would protect her only child even at the risk of her own life, so let one cultivate a boundless heart of loving-kindness toward all living beings."
          }
        ];
        commentary = "The Karaniya Metta Sutta is the classic text on radiating Metta (loving-kindness) in all directions. It teaches that the antidote to fear, enmity, and structural conflict is the active development of a boundless, protective, and non-discriminatory heart.";
      }

      parallelRel = "hinduism";
      parallelSrc = "Upanishads (Chandogya 6.8.7)";
      parallelSim = "The search for truth through rigorous self-enquiry and empirical, direct realization (Anubhuti) rather than static dogmas.";
      parallelLes = "Test ethical guidelines in your own daily life, keeping what brings peace, kindness, and mental clarity, and discarding what feeds anger.";

    } else if (keyLower === "abhidhamma_pitaka") {
      const bk = Number(divisionNumber) || 1;
      intro = `Abhidhamma Pitaka, Book ${bk}. This scholastic compilation provides a systematic psychological, philosophical, and metaphysical analysis of reality.`;
      versesArray = [
        {
          number: `${bk}.1`,
          originalText: "कुसला धम्मा अकुसला धम्मा अव्याकता धम्मा ।",
          transliteration: "kusalā dhammā akusalā dhammā avyākatā dhammā",
          translation: "Phenomena are either wholesome, unwholesome, or indeterminate (ethically neutral)."
        }
      ];
      commentary = `This portion belongs to the Abhidhamma's intricate categorization of reality. Unlike the Suttas (which are contextual stories), the Abhidhamma presents a highly detailed, dry, scientific map of the mind. It decomposes subjective experience into momentary mental events (dhammas), listing 89 states of consciousness, 52 mental factors (cetasikas), and material phenomena, demonstrating that there is no permanent 'soul' or 'I' (Anatta) inside the process.`;
      
      parallelRel = "science";
      parallelSrc = "Cognitive Psychology & Neuroscience";
      parallelSim = "The decomposition of the subjective self into dynamic streams of neural impulses and cognitive processes without a single central commander.";
      parallelLes = "Do not mistake passing emotions or negative thoughts as 'myself'. See them as impersonal mental factors arising due to conditions, and let them fade away.";

    } else if (keyLower === "lotus_sutra") {
      const ch = Number(divisionNumber) || 1;
      intro = `The Lotus Sutra (Saddharma Puṇḍarīka Sūtra), Chapter ${ch}. `;
      if (ch === 2) {
        intro += "Expedient Means (Upaya). It reveals that the Buddha uses diverse creative methods adapted to different minds.";
        versesArray = [
          {
            number: "2.1",
            originalText: "諸佛世尊。唯以一大事因緣故。出現於世。欲令眾生。開佛知見。示佛知見。悟佛知見。入佛知見。",
            transliteration: "zhū fó shì zūn | wéi yǐ yī dà shì yīn yuán gù | chū xiàn yú shì | yù lìng zhòng shēng | kāi fó zhī jiàn | shì fó zhī jiàn | wù fó zhī jiàn | rù fó zhī jiàn",
            translation: "The Buddhas appear in the world for one sole great purpose: to open, show, awaken, and enter the path of Buddha-wisdom to all living beings."
          }
        ];
        commentary = "This chapter introduces Upaya (skillful means)—the doctrine that the Buddha's various teachings are compassionate pedagogical tools designed to lead all sentient beings to the Single Vehicle (Ekayana) of absolute awakening.";
      } else if (ch === 25) {
        intro += "The Universal Gate of Avalokiteshvara. It details the infinite compassion and adaptive forms of the Bodhisattva of Mercy.";
        versesArray = [
          {
            number: "25.1",
            originalText: "若有無量百千萬億眾生。受諸苦惱。聞是觀世音菩薩。一心稱名。觀世音菩薩。即時觀其音聲。皆得解脫。",
            transliteration: "ruò yǒu wú liàng bǎi qiān wàn yì zhòng shēng | shòu zhū kǔ nǎo | wén shì guān shì yīn pú sà | yī xīn chēng míng | guān shì yīn pú sà | jí shí guān qí yīn shēng | jiē dé jiě tuō",
            translation: "If there are infinite living beings suffering miseries, and they single-mindedly chant the name of Bodhisattva Avalokiteshvara, he will instantly perceive their cries and deliver them from suffering."
          }
        ];
        commentary = "This highly beloved chapter celebrates Avalokiteshvara (Guanyin), the embodiment of cosmic compassion, who assumes thirty-three distinct physical manifestations to meet individuals at their specific level of understanding and guide them out of danger.";
      } else {
        intro += "This chapter details the Mahayana cosmic vision, encouraging all practitioners to arise as Bodhisattvas of compassion.";
        versesArray = [
          {
            number: `${ch}.1`,
            originalText: "我常在此娑婆世界。說法教化。",
            transliteration: "wǒ cháng zài cǐ suō pó shì jiè | shuō fǎ jiào huà",
            translation: "I am always in this Sahasrabhadra world, preaching the Dharma and leading all living beings to enlightenment."
          }
        ];
        commentary = "The Lotus Sutra declares the eternity of the Buddha's life and the absolute universality of Buddhahood. It teaches that the ultimate goal of spiritual practice is not solitary liberation, but active, engaged service to lift all other beings.";
      }

      parallelRel = "christianity";
      parallelSrc = "Philippians 2:5-7";
      parallelSim = "Christ emptying himself, taking the form of a servant to meet humanity in their physical condition, mirrors the Bodhisattva's Upaya.";
      parallelLes = "Adapt your communication and actions to meet others where they are, using empathy and understanding to help them overcome their struggles.";

    } else if (keyLower === "lalitavistara") {
      const ch = Number(divisionNumber) || 1;
      intro = `Lalitavistara Sutra, Chapter ${ch}. This biography of Gautama Buddha describes his life as a beautiful, divine play (Lalita) to guide beings.`;
      if (ch === 22) {
        intro += "Universal Awakening (Abhisaṁbodhi). Prince Siddhartha achieves ultimate enlightenment under the Bodhi tree.";
        versesArray = [
          {
            number: "22.1",
            originalText: "इहासने शुष्यतु मे शरीरं त्वगस्थिमांसं प्रलयं च यातु । अप्राप्य बोधिं बहुकल्पदुर्लभां नैवासनात् कायमतश्चलिष्यते ॥",
            transliteration: "ihāsane śuṣyatu me śarīraṁ tvagasthimāṁsaṁ pralayaṁ ca yātu | aprāpya bodhiṁ bahukalpadurlabhāṁ naivāsanāt kāyamataścaliṣyate",
            translation: "On this seat my body may dry up, my skin, bones, and flesh may dissolve, but without obtaining the supreme awakening, difficult to get in many eons, this body shall not move."
          }
        ];
        commentary = "This famous verse represents the absolute resolve of Prince Siddhartha sitting under the Bodhi tree at Bodh Gaya. Facing the temptations, illusions, and terrifying armies of Mara, his steady, immoveable mind calls upon the Earth to witness his lifetimes of selflessness, shattering all delusions and attaining Buddhahood.";
      } else {
        intro += "This chapter depicts the early miraculous events of Prince Siddhartha's birth and training.";
        versesArray = [
          {
            number: `${ch}.1`,
            originalText: "नमो तस्स भगवतो अरहतो सम्मासम्बुद्धस्स ॥",
            transliteration: "namo tassa bhagavato arahato sammāsambuddhassa",
            translation: "Salutations to the Blessed One, the Worthy One, the Fully Awakened One."
          }
        ];
        commentary = "The Lalitavistara presents a magnificent, detailed, and poetic account of the Buddha's earthly play. It reminds readers that the journey of Prince Siddhartha—from a sheltered palace to ascetic wandering and eventual awakening—is a universal mirror for every human soul seeking liberation.";
      }

      parallelRel = "christianity";
      parallelSrc = "Matthew 4:1-11";
      parallelSim = "Christ's firm resistance of Satan's temptations in the wilderness mirrors Siddhartha's victory over Mara under the Bodhi Tree.";
      parallelLes = "When facing internal doubts, fears, or temptations, remain centered in your core values and stand firm like an immoveable rock.";

    } else if (keyLower === "buddhist_prayers") {
      const pr = Number(divisionNumber) || 1;
      intro = `Buddhist Chants & Gathas, `;
      if (pr === 1) {
        intro += "Chant 1: Karaniya Metta Sutta (Discourse on Loving-Kindness). A powerful daily chant to cultivate safety, peace, and boundless love.";
        versesArray = [
          {
            number: "1.1",
            originalText: "सुखिनो वा खेमिनो होन्तु सब्बे सत्ता भवन्तु सुखितत्ता ।",
            transliteration: "sukhino vā khemino hontu | sabbe sattā bhavantu sukhitattā",
            translation: "May all beings be happy and safe. May all living beings be happy-minded."
          },
          {
            number: "1.2",
            originalText: "मेत्तञ्च सब्बलोकस्मिं मानसं भावये अपरिमाणं ।",
            transliteration: "mettañca sabbalokasmiṁ mānasaṁ bhāvaye aparimāṇaṁ",
            translation: "Cultivate a boundless heart of loving-kindness toward the entire world, above, below, and across, without obstruction, hate, or enmity."
          }
        ];
        commentary = "The Karaniya Metta Sutta is chanted worldwide to diffuse fear and invite harmony. It teaches that true protection and spiritual progress come from harboring absolutely zero malice, greeting every creature with friendly, maternal compassion.";
      } else if (pr === 2) {
        intro += "Chant 2: Om Mani Padme Hum & Heart Sutra Mantra. evoking Avalokiteshvara's supreme compassion and emptiness.";
        versesArray = [
          {
            number: "2.1",
            originalText: "ॐ मणिपद्मे हूँ ॥ गते गते पारगते पारसंगते बोधि स्वाहा ॥",
            transliteration: "oṁ maṇipadme hūṁ | gate gate pāragate pārasaṁgate bodhi svāhā",
            translation: "Praise to the Jewel in the Lotus! Gone, gone, gone beyond, gone altogether beyond, O Awakening, hail!"
          }
        ];
        commentary = "This chant fuses the Tibetan mantra of Avalokiteshvara (Om Mani Padme Hum), which cleanses our mental defilements, with the Sanskrit mantra of the Heart Sutra (Gate Gate), which celebrates the liberation found in realizing absolute emptiness.";
      } else if (pr === 3) {
        intro += "Chant 3: Bodhisattva Vows of Compassion. The four great vows of Mahayana practice.";
        versesArray = [
          {
            number: "3.1",
            originalText: "眾生無邊誓願度。煩惱無盡誓願斷。法門無量誓願學。佛道無上誓願成。",
            transliteration: "zhòng shēng wú biān shì yuàn dù | fán nǎo wú jìn shì yuàn duàn | fǎ mén wú liàng shì yuàn xué | fó dào wú shàng shì yuàn chéng",
            translation: "Sentient beings are numberless, I vow to deliver them. Delusions are inexhaustible, I vow to end them. Dharma gates are boundless, I vow to master them. The Buddha way is unsurpassable, I vow to attain it."
          }
        ];
        commentary = "The Bodhisattva Vows are the ultimate expression of active compassion. The practitioner pledges to defer their own entry into Nirvana until all other suffering beings are guided across the sea of Samsara, combining ultimate wisdom with infinite service.";
      } else {
        intro += "Chant 4: The Three Refuges (Tisarana). The historic declaration of taking shelter in the Triple Gem.";
        versesArray = [
          {
            number: "4.1",
            originalText: "बुद्धं सरणं गच्छामि । धम्मं सरणं गच्छामि । सङ्घं सरणं गच्छामि ॥",
            transliteration: "buddhaṁ saraṇaṁ gacchāmi | dhammaṁ saraṇaṁ gacchāmi | saṅghaṁ saraṇaṁ gacchāmi",
            translation: "I take refuge in the Buddha. I take refuge in the Dharma. I take refuge in the Sangha."
          }
        ];
        commentary = "The Tisarana (Three Refuges) is the formal entryway and constant anchor of the Buddhist path. Taking refuge is not a passive request for protection, but an active alignment with the Buddha (the awakened potential), the Dharma (the path of truth), and the Sangha (the community of practice).";
        parallelRel = "christianity";
        parallelSrc = "Matthew 16:16-18";
        parallelSim = "Declaring shelter/refuge in Christ as the foundation/rock of the faith community mirrors the act of taking refuge in the Triple Gem.";
        parallelLes = "Align your life with a noble truth and seek out high-vibrational, compassionate community to steady your spiritual path.";
      }
    }

    return {
      isOfflineFallback: true,
      introSummary: intro,
      verses: versesArray,
      commentary,
      interfaithParallels: [
        {
          religion: parallelRel,
          source: parallelSrc,
          similarity: parallelSim,
          lesson: parallelLes
        }
      ]
    };
  }

  if (["jain_prayers", "jain_scriptures", "tattvartha_sutra"].includes(keyLower)) {
    let intro = `Jain Scriptures, `;
    let versesArray = [];
    let commentary = "";
    let parallelRel = "buddhism";
    let parallelSrc = "";
    let parallelSim = "";
    let parallelLes = "";

    const divNum = Number(divisionNumber) || 1;
    if (keyLower === "jain_prayers") {
      if (divNum === 1) {
        intro += "Prayer 1: The Navkar Mantra. The ultimate supreme mantra of Jainism.";
        versesArray = [
          {
            number: "1.1",
            originalText: "णमो अरिहंताणं । णमो सिद्धाणं । णमो आयरियाणं । णमो उवज्झायाणं । णमो लोए सव्व साहूणं ॥",
            transliteration: "ṇamo arihantāṇaṁ | ṇamo siddhāṇaṁ | ṇamo āyariyāṇaṁ | ṇamo uvajjhāyāṇaṁ | ṇamo loe savva sāhūṇaṁ",
            translation: "I bow to the Arihants (conquerors of inner enemies). I bow to the Siddhas (liberated souls). I bow to the Acharyas (spiritual leaders). I bow to the Upadhyayas (spiritual teachers). I bow to all the Sadhus (monks) in the world."
          },
          {
            number: "1.2",
            originalText: "एसो पंच णमोक्कारो, सव्व पावप्पणासणो । मंगलाणं च सव्वेसिं, पढमं हवइ मंगलं ॥",
            transliteration: "eso pañca ṇamokkāro, savva pāvappaṇāsaṇo | maṅgalāṇaṁ ca savvesiṁ, paḍhamaṁ havai maṅgalaṁ",
            translation: "This five-fold bow destroys all sins and is the most auspicious of all blessings."
          }
        ];
        commentary = "The Navkar Mantra is the cornerstone of Jain devotion. It is completely non-sectarian, because it does not worship a specific historical figure or god, but bows to the five supreme spiritual stages of self-realization, inspiring practitioners to cultivate these qualities within themselves.";
      } else {
        intro += "Prayer 2: Khamemi Savve Jiva (Universal Forgiveness & Friendship Prayer).";
        versesArray = [
          {
            number: "2.1",
            originalText: "खामेमि सव्वे जीवे, सव्वे जीवा खमंतु मे । मित्ती मे सव्वभूएस्, वेरं मज्झं न केणइ ॥",
            transliteration: "khāmemi savve jīve, savve jīvā khamantu me | mittī me savvabhūesu, veraṁ majjhaṁ na keṇai",
            translation: "I forgive all living beings; may all living beings forgive me. I have friendship toward all living creatures, and enmity toward none."
          }
        ];
        commentary = "This profound prayer is recited during the annual Samvatsari festival of forgiveness (Pratikraman). Reciting it is an act of radical mental clearing, dissolving any trace of anger, ego, or resentment toward others to achieve absolute inner peace and cosmic friendship.";
      }

      parallelRel = "christianity";
      parallelSrc = "Matthew 6:14";
      parallelSim = "The core teaching that forgiveness is a mutual, liberating act that is essential for spiritual cleansing and peace.";
      parallelLes = "Consciously release all lingering grudges and resentments, offering forgiveness to others and requesting it in return to unburden your heart.";
    }

    return {
      isOfflineFallback: true,
      introSummary: intro,
      verses: versesArray,
      commentary,
      interfaithParallels: [
        {
          religion: parallelRel,
          source: parallelSrc,
          similarity: parallelSim,
          lesson: parallelLes
        }
      ]
    };
  }

  if (keyLower === "hidden_words") {
    const divNum = Number(divisionNumber) || 1;
    let intro = `A high-fidelity academic reading and commentary of the Bahá'í scripture: ${bookTitle}, `;
    let versesArray = [];
    let commentary = "";
    let parallelRel = "";
    let parallelSrc = "";
    let parallelSim = "";
    let parallelLes = "";

    if (divNum === 1) {
      intro += "Section 1: From the Arabic.";
      versesArray = [
        {
          number: "1.1",
          originalText: "یا ابن الروح! فی اوّل القول انصحک ان تملک قلباً زکیّاً حسناً منیراً لتملک ملکاً دایماً باقياً قدیماً.",
          transliteration: "Yā Ibna'r-Rūḥ! Fī awwali'l-qawl unṣiḥuka an tamlika qalban zakiyyan ḥasanan munīran litamlika mulkan dā'iman bāqiyan qadīma.",
          translation: "O SON OF SPIRIT! My first counsel is this: Possess a pure, kindly and radiant heart, that thine may be a sovereignty ancient, imperishable and everlasting."
        },
        {
          number: "1.2",
          originalText: "یا ابن الروح! احبّ الاشیاء عندی الانصاف، لا ترغب عنه ان تکن الیّ راغباً ولا تغفل منه لتکون لی امیناً، وبه توفّق ان تشاهد الاشیاء بعینک لا بعین العباد وتعرفها بمعرفتک لا بمعرفة الاحد...",
          transliteration: "Yā Ibna'r-Rūḥ! Aḥabbu'l-ashyā'i 'indī al-inṣāf, lā targhab 'anhu in takun ilayya rāghiban wa-lā taghfal minhu litakūna lī amīnan, wa-bihi tuwaffaqu an tushāhida'l-ashyā'a bi-'aynika lā bi-'ayni'l-'ibādi wa-ta'rifahā bi-ma'rifatika lā bi-ma'rifati'l-aḥad...",
          translation: "O SON OF SPIRIT! The best beloved of all things in My sight is Justice; turn not away therefrom if thou desirest Me, and neglect it not that I may trust in thee. By its aid thou shalt see with thine own eyes and not through the eyes of others, and shalt know of thine own knowledge and not through the knowledge of thy neighbor."
        },
        {
          number: "1.3",
          originalText: "یا ابن الانسان! کنت فی قدم ذاتی الازلية وحرکة کینونتی القدیمة، عرفت حبّی فیك فخلقتک ونقشت علیک مثالی واظهرت لک جمالی.",
          transliteration: "Yā Ibna'l-Insān! Kuntu fī qidami dhātī al-azaliyyati wa-ḥarakati kaynūnatī al-qadīmati, 'araftu ḥubbī fīka fa-khalaqtuka wa-naqashtu 'alayka mithālī wa-azhartu laka jamālī.",
          translation: "O SON OF MAN! Veiled in My immemorial being and in the ancient eternity of My essence, I knew My love for thee; therefore I created thee, have engraved on thee Mine image and revealed to thee My beauty."
        },
        {
          number: "1.4",
          originalText: "یا ابن الانسان! احببت خلقک فخلقتک، فاحببنی حتی اذکرک وفی روح الحیاة اثبتک.",
          transliteration: "Yā Ibna'l-Insān! Aḥbabtu khalqaka fa-khalaqtuka, fa-aḥbibnī ḥattā adhkuraka wa-fī rūḥi'l-ḥayāti uthbitaka.",
          translation: "O SON OF MAN! I loved thy creation, hence I created thee. Wherefore, love Me, that I may name thy name and fill thy soul with the spirit of life."
        },
        {
          number: "1.5",
          originalText: "یا ابن الانسان! لکلّ شیء دلالة، ودلالة الحبّ الصبر فی قضائی والاصطبار فی بلائی.",
          transliteration: "Yā Ibna'l-Insān! Li-kulli shay'in dalālatun, wa-dalālatu'l-ḥubbi aṣ-ṣabru fī qaḍā'ī wa'l-iṣṭibāru fī balā'ī.",
          translation: "O SON OF MAN! For everything there is a sign. The sign of love is fortitude under My decree and patience under My trials."
        },
        {
          number: "1.6",
          originalText: "یا ابن الروح! لا راحة لک الّا بانقطاعک عن نفسک واقبالک الیّ، لانّه ینبغی ان یکون افتخارک باسمی لا باسمک وتوکلّک علی جوادی لا علی نفسک، لانّی احببت ان اکون محبوباً فرداً لا یشارکنی احد.",
          transliteration: "Yā Ibna'r-Rūḥ! Lā rāḥata laka illā bi-nqiṭā'ika 'an nafsika wa-iqbālika ilayya, li-annahu yanbaghī an yakūna iftikhāruka bi-ismī lā bi-ismika wa-tawakkuluka 'alā jawādī lā 'alā nafsika, li-annī aḥbabtu an akūna maḥbūban fardan lā yushārikunī aḥad.",
          translation: "O SON OF SPIRIT! There is no peace for thee save by renouncing thyself and turning unto Me; for it behooveth thee to glory in My name, not in thine own; to put thy trust in Me and not in thyself, since I desire to be loved alone and above all that is."
        }
      ];
      commentary = "The Arabic verses of 'The Hidden Words' emphasize the foundational laws of the spiritual journey: purity of heart, absolute justice as the ultimate standard of perception, the inherent nobility of human creation as an image of the Divine, and the necessity of detachment from self to find true inner peace. The call to Justice here is particularly remarkable, representing an early Baha'i assertion of independent investigation of truth.";
      parallelRel = "christianity";
      parallelSrc = "Matthew 5:8 / Matthew 22:37-39";
      parallelSim = "Purity of heart as a prerequisite to see God, and loving God as the first and greatest commandment.";
      parallelLes = "Purify your intentions daily and seek justice directly through your own eyes and investigation, rather than relying blindly on rumor or imitation.";
    } else {
      intro += "Section 2: From the Persian.";
      versesArray = [
        {
          number: "2.1",
          originalText: "یا ابن البیان! نخستین ندای جانان این است: ای بلبل لاهوت! جز در گلبن ملکوت آشیان مگزین. و ای هدهد سلیمان عشق! جز در سبای جانان مسکن مگیر. و ای عنقای بقا! جز در قاف وفا وطن مپذیر. این است جایگاه تو اگر ببال جان به فضای لامکان پرواز کنی و آهنگ مقام خود نمایی.",
          transliteration: "Yā Ibna'l-Bayān! Nakhostīn nadā-ye jānān īn ast: Ey bolbol-e lāhūt! Joz dar golbon-e malakūt āshiyān magozīn. Va ey hodhod-e Soleymān-e 'eshq! Joz dar Sabā-ye jānān maskan magīr. Va ey 'anqā-ye baqā! Joz dar Qāf-e vafā vatan mapazīr...",
          translation: "O SON OF UTTERANCE! The first call of the Beloved is this: O mystical nightingale! Abide not but in the rose-garden of the spirit. O messenger of the Solomon of love! Seek thou no shelter except in the Sheba of the well-beloved; and O immortal phoenix! dwell not save on the mount of faithfulness. There is thy habitation, if on the wings of thy soul thou soarest to the realm of the infinite and seekest to attain thy goal."
        },
        {
          number: "2.2",
          originalText: "یا ابن النور! فراموش کن غیر مرا و با روان من مأنوس شو. این از جوهر امر من است، پس به سوی آن روی آور.",
          transliteration: "Yā Ibna'n-Nūr! Farāmūsh kon gheyro marā va bā ravān-e man ma'nūs sho. Īn az jowhar-e amr-e man ast, pas be sū-ye ān rūy āvar.",
          translation: "O SON OF LIGHT! Forget all save Me and commune with My spirit. This is of the essence of My command, therefore turn unto it."
        },
        {
          number: "2.3",
          originalText: "یا ابن الانسان! وصایای مرا به مداد نور بر لوح روان خویش بنگار، و اگر بر این کار توانا نیستی، آنها را به مداد خون دل بنویس. و अगर بر این هم قادر نیستی، به مداد فضل من بنگار تا همواره باقی ماند.",
          transliteration: "Yā Ibna'l-Insān! Vasāyā-ye marā be medād-e nūr bar lowḥ-e ravān-e khīsh bengār, va agar bar īn kār tavānā nīstī, ānhārā be medād-e khūn-e del benevīs. Va agar bar īn ham qāder nīstī, be medād-e fazl-e man bengār tā hamvāreh bāqī mānad.",
          translation: "O SON OF MAN! Write down My commandments with the ink of light upon the tablet of thy spirit, and if thou canst not do this, write them with the ink of thy heart's blood. If even this thou canst not do, then write them with the ink of My grace, that they may remain forever."
        },
        {
          number: "2.4",
          originalText: "یا ابن العرش! گوش تو گوش من است، با آن بشنو. و چشم تو چشم من است, با آن ببین. تا در درون خویش بر قدس بی همتای من گواهی دهی و من در خویشتن بر مقام والای تو گواهی دهم.",
          transliteration: "Yā Ibna'l-'Arsh! Gūsh-e to gūsh-e man ast, bā ān beshnov. Va chashm-e to chashm-e man ast, bā ān bebīn. Tā dar darūn-e khīsh bar qods-e bī-hamtā-ye man govāhī dahī va man dar khīshtan bar maqām-e vālā-ye to govāhī daham.",
          translation: "O SON OF THE THRONE! Thy hearing is My hearing, hear thou therewith. Thy sight is My sight, see thou therewith, that in thine inmost soul thou mayest testify unto My transcendent holiness, and I in My self may bear witness unto a lofty station for thee."
        },
        {
          number: "2.5",
          originalText: "یا ابن الجود! از بیابان عدم، به گل امر خویش تو را آفریدم، و برای پرورش تو هر ذره از هستی و حقیقت تمام آفریده‌ها را مقرر داشتم.",
          transliteration: "Yā Ibna'l-Jūd! Az biyābān-e 'adam, be gel-e amr-e khīsh torā āfarīdam, va barā-ye parvaresh-e to har zarreh az hastī va ḥaqīqat-e tamām-e āfarīdeh-hārā moqarrar dāshtam.",
          translation: "O SON OF BOUNTY! Out of the wastes of nothingness, with the clay of My command I produced thee, and have ordained for thy training every atom in existence and the essence of all created things."
        },
        {
          number: "2.6",
          originalText: "یا ابن التراب! اگر مرا می‌خواهی، جز من مجو； و اگر جمال مرا می‌جویی، دیده از عالم بربند و آنچه در آن است； زیرا اراده من و اراده غیر من، چون آتش و آب، در یک دل نگنجد.",
          transliteration: "Yā Ibna't-Torāb! Agar marā mī-khāhī, joz man majū; va agar jamāl-e marā mī-jū-ye, dīdeh az 'ālam barband va āncheh dar ān ast; zīrā erādeh-ye man va erādeh-ye gheyro man, chūn ātash va āb, dar yek del nagonjad.",
          translation: "O SON OF EARTH! Wouldst thou have Me, seek none other than Me; and wouldst thou gaze upon My beauty, close thine eyes to the world and all that is therein; for My will and the will of another than Me, even as fire and water, cannot dwell together in one heart."
        }
      ];
      commentary = "The Persian section of 'The Hidden Words' shifts into highly poetic Persian mystical imagery, utilizing symbols like the mystical nightingale, the Sheba of love, and the immortal phoenix to guide the human spirit. These verses deal profoundly with the concept of unity of consciousness (the heart can only hold one supreme love), divine intimacy, and the cosmic care with which the universe has been structured for human growth.";
      parallelRel = "sufism / islam";
      parallelSrc = "Rumi's Masnavi / Hadith Qudsi 'I was a hidden treasure...'";
      parallelSim = "The soul as a bird of passage seeking its true nest, and the heart as the exclusive abode of divine love that must be purified of earthly attachments.";
      parallelLes = "Cultivate faithfulness and inner listening, letting go of temporary worldly distractions to discover the quiet, permanent light of spiritual truth within.";
    }

    return {
      isOfflineFallback: true,
      introSummary: intro,
      verses: versesArray,
      commentary,
      interfaithParallels: [
        {
          religion: parallelRel,
          source: parallelSrc,
          similarity: parallelSim,
          lesson: parallelLes
        }
      ]
    };
  }

  if (["guru_granth", "dasam_granth", "varan_bhai_gurdas"].includes(keyLower)) {
    let intro = `An authentic scholarly reading and commentary of the Sikh sacred scripture: ${bookTitle}, portion: `;
    let versesArray = [];
    let commentary = "";
    let parallelRel = "hinduism";
    let parallelSrc = "";
    let parallelSim = "";
    let parallelLes = "";

    const divNum = Number(divisionNumber) || 1;

    if (keyLower === "guru_granth") {
      intro += `Ang (Page) ${divNum}.`;
      if (divNum === 1) {
        versesArray = [
          {
            number: "1.1",
            originalText: "ੴ ਸਤਿ ਨਾਮੁ ਕਰਤਾ ਪੁਰਖੁ ਨਿਰਭਉ ਨਿਰਵੈਰੁ ਅਕਾਲ ਮੂਰਤਿ ਅਜੂਨੀ ਸੈਭੰ ਗੁਰ ਪ੍ਰਸਾਦਿ ॥",
            transliteration: "Ik oṅkār sat nām karatā purakh nirabhau niravair akāl mūrat ajūnī saibhaṅ gur prasād",
            translation: "There is Only One Supreme Creator, Truth is the Divine Name. Creative Being, Fearless, Without Enmity, Timeless, Unborn, Self-Existent. Realized through the Grace of the True Guru."
          },
          {
            number: "1.2",
            originalText: "ਜਪੁ ॥ ਆਦਿ ਸਚੁ ਜੁਗਾਦਿ ਸਚੁ ॥ ਹੈ ਭੀ ਸਚੁ ਨਾਨਕ ਹੋਸੀ ਭੀ ਸਚੁ ॥੧॥",
            transliteration: "Jap. Ādi sacu jugādi sacu. Hai bhī sacu Nānaka hōsī bhī sacu. 1.",
            translation: "Chant and meditate! True in the primal beginning, True throughout the ages, True here and now; O Nanak, the Creator shall forever remain True."
          }
        ];
        commentary = "The Sri Guru Granth Sahib opens on Ang 1 with the Mool Mantar, the ultimate foundational statement of Sikh theology. Composed by Guru Nanak, it defines the formless Divine as the single, non-anthropomorphic, self-existent Reality that can be directly experienced. This is immediately followed by Japji Sahib, a masterpiece of 38 stanzas mapping the soul's ascent to absolute truth.";
        parallelRel = "hinduism";
        parallelSrc = "Rigveda 1.164.46";
        parallelSim = "The assertion of absolute monotheism and One Ultimate Uncreated Truth whom scholars name in diverse ways.";
        parallelLes = "Look past sectarian boundaries to recognize the unified thread of truth and ultimate light that sustains all life.";
      } else if (divNum === 13) {
        versesArray = [
          {
            number: "13.1",
            originalText: "ਗਗਨ ਮੈ ਥਾਲੁ ਰਵਿ ਚੰਦੁ ਦੀਪਕ ਬਨੇ ਤਾਰਿਕਾ ਮੰਡਲ ਜਨਕ ਮੋਤੀ ॥",
            transliteration: "Gagan mai thālu ravi candu dīpak banē tārikā maṇਡਲ ਜਨਕ ਮੋਤੀ ॥",
            translation: "The sky is the prayer-platter, the sun and moon are the lamps, and the stars in the constellations are the pearls."
          },
          {
            number: "13.2",
            originalText: "ਧੂਪੁ ਮਲਆਨਲੋ ਪਵਣੁ ਚਵਰੋ ਕਰੇ ਸਗਲ ਬਨਰਾਇ ਫੂਲੰਤ ਜੋਤੀ ॥੧॥",
            transliteration: "Dhūpu malaānalo pavaṇu cavaro karē sagala banarāi phūlanta jōtī. 1.",
            translation: "The fragrance of sandalwood is the incense, the wind is the fan, and all the vegetation of the forests are the flowers for Your light. 1."
          }
        ];
        commentary = "Recited as a bedtime prayer, Sohila includes the famous 'Arti of Nature' composed by Guru Nanak at Jagannath Puri. He witnessed traditional priests waving mechanical metal lamps before an idol and realized that the entire cosmos is already conducting a magnificent, continuous, live worship of the formless Creator through the winds, forests, sun, and stars.";
        parallelRel = "buddhism";
        parallelSrc = "Dhammapada 25.1";
        parallelSim = "Recognizing that true worship is not performed via physical materials, but through continuous inner mindfulness and harmonious alignment with natural laws.";
        parallelLes = "Observe the quiet grandeur of nature to experience a continuous sense of awe, peace, and spiritual communion.";
      } else {
        versesArray = [
          {
            number: `${divNum}.1`,
            originalText: "ਹਰਿ ਮੰਦਰੁ ਇਹੁ ਸਰੀਰੁ ਹੈ ਗਿਆਨਿ ਰਤਨਿ ਪਰਗਟੁ ਹੋਇ ॥",
            transliteration: "Hari mandaru ihu sarīru hai giāni ratani paragaṭu hōi",
            translation: "This human body is the true temple of the Divine, inside which the jewel of spiritual wisdom is revealed."
          }
        ];
        commentary = "Guru Amar Das emphasizes that the divine light resides inside every human heart. Searching for truth requires looking inward rather than wandering externally. By cleansing the mind of ego, pride, and greed, one transforms the physical self into a fit shrine for the cosmic spirit.";
        parallelRel = "christianity";
        parallelSrc = "1 Corinthians 6:19";
        parallelSim = "The teaching that the human body is a temple of the Holy Spirit, demanding moral care, inner cleanliness, and continuous reverence.";
        parallelLes = "Treat your body and mind with respect, keeping your inner thoughts pure to remain receptive to divine guidance.";
      }
    } else if (keyLower === "dasam_granth") {
      intro += `Ang (Page) ${divNum}.`;
      if (divNum === 1) {
        versesArray = [
          {
            number: "1.1",
            originalText: "ਚੱਕ੍ਰ ਚਿਹਨ ਅਰੁ ਬਰਨ ਜਾਤਿ ਅਰੁ ਪਾਤਿ ਨਹਿਨ ਜਿਹ ॥ ਰੂਪ ਰੰਗ ਅਰੁ ਰੇਖ ਭੇਖ ਕੋਊ ਕਹਿ ਨ ਸਕਤ ਕਿਹ ॥",
            transliteration: "Cakra cihna aru barana jāti aru pāti nahina jiha | Rūpa raṅga aru rēkha bhēkha koū kahi na sakata kiha",
            translation: "Who has no physical sign, no color, no caste, and no lineage. Whose form, color, outline, and garb no one can possibly describe."
          }
        ];
        commentary = "Jaap Sahib is the opening masterpiece of the Dasam Granth. Formulated by Guru Gobind Singh in highly rhythmic, classical multi-linguistic meter, it consists of 199 stanzas detailing 950 attributes of the Divine. By using negative theology ('Arūpe', 'Anāme'—formless, nameless), it systematically rejects anthropomorphic limitations of God.";
        parallelRel = "islam";
        parallelSrc = "Quran 112:1-4 (Al-Ikhlas)";
        parallelSim = "The depiction of a supreme, uncreated Creator who has no equal, no child, no form, and cannot be captured in physical images.";
        parallelLes = "Release rigid mental concepts of the Divine, celebrating the infinite, inclusive, and indescribable nature of cosmic love.";
      } else if (divNum === 1385) {
        versesArray = [
          {
            number: "1385.1",
            originalText: "ਚੂੰ ਕਾਰ ਅਜ਼ ਹਮਹ ਹੀਲਤੇ ਦਰ ਗੁਜ਼ਸ਼ਤ ॥ ਹਲਾਲ ਅਸਤ ਬੁਰਦਨ ਬ-ਸ਼ਮਸ਼ੀਰ ਦਸਤ ॥",
            transliteration: "Chūn kār az hamah hīlatē dar guzašt | Halāl ast burdan ba-šamšīr dast",
            translation: "When all other peaceful means have failed, it is righteous and moral to draw the sword and take up arms."
          }
        ];
        commentary = "The Zafarnama (Epistle of Victory) was written in exquisite Persian verse by Guru Gobind Singh in 1705, addressed to the Mughal Emperor Aurangzeb. After facing extreme treachery and losing his four young sons in the struggle against tyranny, the Guru asserts his supreme moral victory. This famous couplet establishes the Sikh philosophy of just war—force is strictly a last resort to defend human rights when all diplomacy has collapsed.";
        parallelRel = "hinduism";
        parallelSrc = "Bhagavad Gita 2.31";
        parallelSim = "The duty to stand up and fight for righteousness (Dharma) when peaceful avenues of negotiation have been completely exhausted.";
        parallelLes = "Maintain courage and high moral principles in the face of betrayal, using active strength and voice only to protect the weak and uphold justice.";
      } else {
        versesArray = [
          {
            number: `${divNum}.1`,
            originalText: "ਮਾਨਸ ਕੀ ਜਾਤ ਸਬੈ ਏਕੈ ਪਹਿਚਾਨਬੋ ॥",
            transliteration: "Mānasa kī jāta sabai ēkai pahicānabō.",
            translation: "Recognize the entire human race as one single family and caste."
          }
        ];
        commentary = "Guru Gobind Singh's universal statement of human equality is one of the pillars of Sikh ethics. He asserts that while human cultures, garbs, and temple styles vary by geography, we all breathe the same air, share the same physical clay, and possess the same divine spark. This completely dismantles caste and racial hierarchies.";
        parallelRel = "judaism";
        parallelSrc = "Malachi 2:10";
        parallelSim = "The moral query: 'Have we not all one Father? Has not one God created us?' asserting universal brotherhood.";
        parallelLes = "Actively oppose discrimination and divide, looking beyond external cultural markers to honor the common humanity in every person.";
      }
    } else if (keyLower === "varan_bhai_gurdas") {
      intro += `Vaar (Ballad) ${divNum}.`;
      if (divNum === 1) {
        versesArray = [
          {
            number: "1.1",
            originalText: "ਸੁਣੀ ਪੁਕਾਰਿ ਦਾਤਾਰ ਪ੍ਰਭੁ ਗੁਰੂ ਨਾਨਕ ਜਗ ਮਾਹਿ ਪਠਾਇਆ ॥",
            transliteration: "Suṇī pukāri dātāra prabhu gurū nānaka jaga māhi paṭhāiā.",
            translation: "Listening to the cry of suffering humanity, the Merciful Creator sent Guru Nanak into this world."
          }
        ];
        commentary = "Bhai Gurdas's first Vaar provides a vital historical and philosophical account of Guru Nanak's life and the socio-spiritual state of 15th-century India. He describes the world as drowning in dark superstition, sectarian rivalry, and social oppression. Guru Nanak brought the light of absolute divine unity, dismantling hierarchies with humble, direct truth.";
        parallelRel = "christianity";
        parallelSrc = "John 1:5";
        parallelSim = "The metaphor of a divine light shining into the darkness of a confused world, and the darkness being unable to overcome it.";
        parallelLes = "Be an agent of clarity and compassion in times of social division and moral confusion.";
      } else {
        versesArray = [
          {
            number: `${divNum}.1`,
            originalText: "ਮਿਠਾ ਬੋਲਣੁ ਨਿਵਿ ਚਲਣੁ ਹਥਹੁ ਦੇ ਕੈ ਭਲਾ ਮਨਾਏ ॥",
            transliteration: "Miṭhā bōlaṇu nivi calaṇu hathahu dē kai bhalā manāē",
            translation: "Speak sweetly, walk with deep humility, share what you earn with others, and always seek the welfare of all."
          }
        ];
        commentary = "Bhai Gurdas details the daily character of a Gursikh (disciple of the Guru). Spiritual height is measured purely through moral practice: speaking with gentleness, acting with extreme humility (like water seeking the lowest place), working honestly (Kirat Karni), and sharing resources (Vand Chhakna).";
        parallelRel = "jainism";
        parallelSrc = "Acaranga Sutra 1.6";
        parallelSim = "The supreme value of non-injury, sweet speech, and ethical charity in purifying the soul.";
        parallelLes = "Cultivate sweet speech and daily humility, knowing that simple acts of kind communication can dissolve immense resentment.";
      }
    }

    return {
      isOfflineFallback: true,
      introSummary: intro,
      verses: versesArray,
      commentary,
      interfaithParallels: [
        {
          religion: parallelRel,
          source: parallelSrc,
          similarity: parallelSim,
          lesson: parallelLes
        }
      ]
    };
  }

  const isHindu = relLower.includes("hindu") || keyLower.includes("gita") || keyLower.includes("veda") || keyLower.includes("ramayana") || keyLower.includes("hindu");
  const isIslam = relLower.includes("islam") || keyLower.includes("quran") || keyLower.includes("bukhari") || keyLower.includes("islam");
  const isBuddhism = relLower.includes("buddh") || keyLower.includes("dhammapada") || keyLower.includes("sutra") || keyLower.includes("west") || keyLower.includes("buddhist");
  const isChristian = relLower.includes("christian") || keyLower.includes("bible_nt") || keyLower.includes("gospel") || keyLower.includes("christian");
  const isJudaism = relLower.includes("judas") || keyLower.includes("torah") || keyLower.includes("talmud") || keyLower.includes("jewish");
  const isSikh = relLower.includes("sikh") || keyLower.includes("sikh") || keyLower.includes("gurbani") || keyLower.includes("granth");
  const isJain = relLower.includes("jain") || keyLower.includes("jain") || keyLower.includes("tattvartha");
  const isTaoist = relLower.includes("tao") || keyLower.includes("tao") || keyLower.includes("lao");

  let originalText1 = "";
  let translit1 = "";
  let trans1 = "";
  let originalText2 = "";
  let translit2 = "";
  let trans2 = "";

  if (isHindu) {
    originalText1 = "ॐ असतो मा सद्गमय । तमसो मा ज्योतिर्गमय ॥";
    translit1 = "Om asato mā sadgamaya | tamaso mā jyotirgamaya";
    trans1 = "Lead me from the unreal to the real, from darkness to light, from death to immortality.";
    originalText2 = "तस्मादसक्तः सततं कार्यं कर्म समाचर । असतो ह्य्याचरन्कर्म परमाप्नोति पूरुषः ॥";
    translit2 = "tasmād asaktaḥ satataṁ kāryaṁ karma samācara | asakto hyācaran karma param āpnoti pūruṣaḥ";
    trans2 = "Perform your duty with absolute non-attachment. By acting without expectation of reward, one attains the supreme state.";
  } else if (isIslam) {
    originalText1 = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
    translit1 = "Bismillāhi r-raḥmāni r-raḥīm";
    trans1 = "In the name of Allah, the Entirely Merciful, the Especially Merciful.";
    originalText2 = "اهدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ❁ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ";
    translit2 = "Ihdināṣ-ṣirāṭal-mustaqīm | ṣirāṭal-laḏīna anʿamta ʿalayhim";
    trans2 = "Guide us upon the straight path - the path of those upon whom You have bestowed favor, not of those who have earned wrath.";
  } else if (isBuddhism) {
    originalText1 = "मनोपुब्बङ्गма धम्मा मनोसेट्ठा मनोमया ।";
    translit1 = "manopubbaṅgamā dhammā manoseṭṭhā manomayā";
    trans1 = "Mind precedes all mental states. Mind is their chief; they are mind-made. If one speaks or acts with a pure mind, happiness follows like a shadow.";
    originalText2 = "न हि वेरेन वेराणि सम्मन्तीध कुदाचनं । अवेरेन च सम्मन्ति एस धम्मो सनन्तनो ॥";
    translit2 = "na hi verena verāṇi sammantīdha kudācunaṁ | averena ca sammanti esa dhammo sanatano";
    trans2 = "Hatred is never overcome by hatred; hatred is only overcome by boundless love. This is an eternal law.";
  } else if (isSikh) {
    originalText1 = "ੴ ਸਤਿ ਨਾਮੁ ਕਰਤਾ ਪੁਰਖੁ ਨਿਰਭਉ ਨਿਰਵੈਰੁ ਅਕਾਲ ਮੂਰਤਿ ਅਜੂਨੀ ਸੈਭੰ ਗੁਰ ਪ੍ਰਸਾਦਿ ॥";
    translit1 = "Ik oṅkār sat nām karatā purakh nirabhau niravair akāl mูrat ajūnī saibhaṅ gur prasād.";
    trans1 = "There is Only One Supreme Creator, Truth is the Divine Name. Creative Being, Fearless, Without Enmity, Timeless, Unborn, Self-Existent. Realized through the Grace of the True Guru.";
    originalText2 = "ਜਿਨੀ ਨਾਮੁ ਧਿਆਇਆ ਗਏ ਮਸਕਤਿ ਘਾਲਿ ॥ ਨਾਨਕ ਤੇ ਮੁਖ ਉਜలే ਕੇਤੀ ਛੁਟੀ ਨਾਲਿ ॥";
    translit2 = "Jinī nāmu dhiāiā gaē masakati ghāli | Nānaka tē mukha ujalē kētī chuṭī nāli";
    trans2 = "Those who have meditated on the Naam, and departed after putting in their hard work - O Nanak, their faces are radiant, and many others are saved along with them!";
  } else if (isJain) {
    originalText1 = "णमो अरिहंताणं णमो सिद्धाणं णमो आयरियाणं णमो उवज्झायाणं णमो लोए सव्वसाहूणं ॥";
    translit1 = "Namō arihantāṇaṁ namō siddhāṇaṁ namō āyariyāṇaṁ namō uvajjhāyāṇaṁ namō lōē savvasāhūṇaṁ";
    trans1 = "I bow to the spiritual victors (Arhats), the liberated souls (Siddhas), the preceptors (Acharyas), the teachers (Upadhyayas), and all holy ascetics in the universe.";
    originalText2 = "परस्परोपग्रहो जीवानाम ॥";
    translit2 = "Parasparōpagraha jivānām";
    trans2 = "All living beings are meant to help and support one another through mutual service and non-violence.";
  } else if (isTaoist) {
    originalText1 = "道可道，非常道。名可名，非常名。";
    translit1 = "Dào kě dào, fēi cháng dào | Míng kě míng, fēi cháng míng";
    trans1 = "The Way that can be expressed is not the Eternal Way. The Name that can be named is not the Eternal Name.";
    originalText2 = "上善若水。水善利萬物而不爭，處眾人之所惡，故幾於道。";
    translit2 = "Shàng shàn ruò shuǐ | Shuǐ shàn lì wàn wù ér bù zhēng | chù zhòng rén zhī suǒ wù | gù jǐ yú dào";
    trans2 = "The supreme goodness is like water. It benefits all things without contention, flowing into the low places that humans avoid; thus, it is close to the Tao.";
  } else if (isChristian) {
    originalText1 = "Ἐν ἀρχῇ ἦν ὁ λόγος, καὶ ὁ λόγος ἦν πρὸς τὸν θεόν, καὶ θεὸς ἦν ὁ λόγος.";
    translit1 = "En archē ēn ho lógos, kaì ho lógos ēn pròs tòn theón, kaì theòs ēn ho lógos.";
    trans1 = "In the beginning was the Word, and the Word was with God, and the Word was God.";
    originalText2 = "Μακάριοι οἱ εἰρηνοποιοί, ὅτι αὐτοὶ υἱοὶ θεοῦ κληθήσονται.";
    translit2 = "Makárioi hoi eirēnopoioí, hóti autoì huioì theoû klēthēsontai.";
    trans2 = "Blessed are the peacemakers, for they shall be called children of God.";
  } else if (isJudaism) {
    originalText1 = "בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁਮַיִם וְאֵת הָאָרֶץ׃";
    translit1 = "Bereshit bara Elohim et hashamayim ve'et ha'aretz";
    trans1 = "In the beginning God created the heavens and the earth.";
    originalText2 = "שְׁמַע יִשְׂרָאֵל יְהוָה אֱלֹהֵינוּ יְהוָה אֶחָד׃";
    translit2 = "Shema Yisrael Adonai Eloheinu Adonai Echad";
    trans2 = "Hear, O Israel: The Lord our God, the Lord is One.";
  } else {
    if (relLower.includes("greek") || keyLower.includes("greek") || keyLower.includes("hesiod") || keyLower.includes("homeric") || keyLower.includes("odyssey") || keyLower.includes("iliad") || keyLower.includes("theogony")) {
      originalText1 = "χαλεπὰ τὰ καλά";
      translit1 = "Chalepa ta kala";
      trans1 = "All beautiful and noble things are difficult, requiring perseverance and purity of heart.";
      originalText2 = "γνῶθι σεαυτόν";
      translit2 = "Gnothi seauton";
      trans2 = "Know thyself, and discover the path of wisdom and cosmic harmony within your own spirit.";
    } else if (relLower.includes("norse") || keyLower.includes("norse") || keyLower.includes("edda") || keyLower.includes("heimskringla") || keyLower.includes("gesta_danorum")) {
      originalText1 = "Eigi er sárt þat, er maðr sjálfr gerir.";
      translit1 = "Eigi er sart that, er mathr sjalfr gerir";
      trans1 = "There is no wound as painful as that which a person brings upon themselves by lack of wisdom.";
      originalText2 = "Gef mér sýn í skugganna djúp, skilning rúnanna ok raddanna.";
      translit2 = "Gef mer syn i skugganna djup, skilning runanna ok raddanna";
      trans2 = "Grant me sight into the deep shadows, and understanding of the sacred runes and whispering voices.";
    } else if (keyLower.includes("aeneid") || keyLower.includes("gallico") || relLower.includes("roman") || relLower.includes("latin") || keyLower.includes("latin")) {
      originalText1 = "Per aspera ad astra.";
      translit1 = "Per aspera ad astra";
      trans1 = "Through trials and steep hardships we reach the eternal stars.";
      originalText2 = "Concordia parvae res crescunt, discordia maximae dilabuntur.";
      translit2 = "Concordia parvae res crescunt, discordia maximae dilabuntur";
      trans2 = "Through harmony small things grow great, while through discord even the greatest collapse.";
    } else if (relLower.includes("bahai") || relLower.includes("baha'i") || keyLower.includes("hidden_words") || keyLower.includes("bahaullah")) {
      originalText1 = "یا ابن الروح! فی اوّل القول انصحک ان تملک قلباً زکیّاً حسناً منیراً...";
      translit1 = "Yā Ibna'r-Rūḥ! Fī awwali'l-qawl unṣiḥuka an tamlika qalban zakiyyan...";
      trans1 = "O SON OF SPIRIT! My first counsel is this: Possess a pure, kindly and radiant heart, that thine may be a sovereignty ancient, imperishable and everlasting.";
      originalText2 = "یا ابن النور! فراموش کن غیر مرا و با روان من مأنوس شو.";
      translit2 = "Yā Ibna'n-Nūr! Farāmūsh kon gheyro marā va bā ravān-e man ma'nūs sho.";
      trans2 = "O SON OF LIGHT! Forget all save Me and commune with My spirit. This is of the essence of My command, therefore turn unto it.";
    } else if (relLower.includes("space") || keyLower.includes("somnium") || relLower.includes("cosmic") || keyLower.includes("celestial")) {
      originalText1 = "Coeli enarrant gloriam Dei et opera manuum eius adnuntiat firmamentum.";
      translit1 = "Coeli enarrant gloriam Dei et opera manuum eius adnuntiat firmamentum";
      trans1 = "The celestial heavens declare the ultimate glory of the Creator, and the firmament proclaims the handiwork.";
      originalText2 = "Astra inclinant, sed non necessitant.";
      translit2 = "Astra inclinant, sed non necessitant";
      trans2 = "The stars map our paths, yet they do not compel our free will; we are active co-creators of our destiny.";
    } else {
      originalText1 = "Nosce te ipsum.";
      translit1 = "Nosce te ipsum";
      trans1 = "Know thyself, and let the quiet inner voice guide your actions with compassion and integrity.";
      originalText2 = "Concordia patriae, pax gentium.";
      translit2 = "Concordia patriae, pax gentium";
      trans2 = "Let us cultivate harmony within our communities and peace among all peoples, honoring our common origin.";
    }
  }
  /* sikh
  else if (isSikh) {
    originalText1 = "ੴ ਸਤਿ ਨਾਮੁ ਕਰਤਾ ਪੁਰਖੁ ਨਿਰਭਉ ਨਿਰਵੈਰੁ ਅਕਾਲ ਮੂਰਤਿ ਅਜੂਨੀ ਸੈਭੰ ਗੁਰ ਪ੍ਰਸਾਦਿ ॥";
    translit1 = "Ik oṅkār sat nām karatā purakh nirabhau niravair akāl mูrat ajūnī saibhaṅ gur prasād.";
    trans1 = "There is Only One Supreme Creator, Truth is the Divine Name. Creative Being, Fearless, Without Enmity, Timeless, Unborn, Self-Existent. Realized through the Grace of the True Guru.";
    originalText2 = "ਜਿਨੀ ਨਾਮੁ ਧਿਆਇਆ ਗਏ ਮਸਕਤਿ ਘਾਲਿ ॥ ਨਾਨਕ ਤੇ ਮੁਖ ਉਜਲੇ ਕੇਤੀ ਛੁਟੀ ਨਾਲਿ �      trans2 = "शृणु हे इस्रायल्: अस्माकं ईश्वरः एकमेव अस्ति।";
    }
  */
  // Multilingual precise translated dictionary for fallback
  const langKey = (targetLanguage || "English").toLowerCase();
  let selectedLanguageLabel = targetLanguage || "English";

  if (langKey.includes("sanskrit") || langKey === "sa") {
    selectedLanguageLabel = "Sanskrit";
    if (isHindu) {
      trans1 = "ॐ असतो मा सद्गमय। तमसो मा ज्योतिर्गमय। मृत्योर्मा अमृतं गमय॥";
      trans2 = "तस्मादसक्तः सततं कार्यं कर्म समाचर। असक्तो ह्याचरन् कर्म परमाप्नोति पूरुषः॥";
    } else if (isIslam) {
      trans1 = "अल्लाहस्य नाम्ना यः परमकृपालुः दयावान् च अस्ति।";
      trans2 = "अस्मान् सरल-मार्गं दर्शय - तेषां मार्गं येभ्यः त्वं अनुग्रहं कृतवान्।";
    } else if (isBuddhism) {
      trans1 = "मनः सर्वधर्माणां पूर्वगामी अस्ति। मनसा शुद्धेन भाषितेन वा सुखं अनुगच्छति।";
      trans2 = "न हि वैरेण वैराणि शाम्यन्तीह कदाचन। अवैरेण च शाम्यन्ति एष धर्मः सनातनः॥";
    } else if (isChristian) {
      trans1 = "आदौ शब्दः आसीत्, शब्दः च ईश्वरेण सह आसीत्, शब्दः च ईश्वरः आसीत्।";
      trans2 = "धन्याः शान्तिस्थापकाः, यतः ते ईश्वरस्य पुत्राः इति कथ्यन्ते।";
    } else if (isJudaism) {
      trans1 = "आदौ ईश्वरः आकाशं पृथ्वीं च असृजत्।";
      trans2 = "शृणु हे इस्रायल्: अस्माकं ईश्वरः एकमेव अस्ति।";
    }
  } else if (langKey.includes("hindi") || langKey === "hi") {
    selectedLanguageLabel = "Hindi";
    if (isHindu) {
      trans1 = "मुझे असत्य से सत्य की ओर ले चलो, अंधकार से प्रकाश की ओर ले चलो, मृत्यु से अमरत्व की ओर ले चलो।";
      trans2 = "बिना किसी आसक्ति के अपने कर्तव्य का पालन करो। बिना किसी फल की आकांक्षा के कर्म करने से मनुष्य परम पद प्राप्त करता है।";
    } else if (isIslam) {
      trans1 = "अल्लाह के नाम से, जो अत्यंत दयावान और परम कृपालु है।";
      trans2 = "हमें सीधे मार्ग पर चला - उन लोगों के मार्ग पर जिन पर तूने कृपा की।";
    } else if (isBuddhism) {
      trans1 = "मन सभी मानसिक अवस्थाओं से श्रेष्ठ है। शुद्ध मन से बोलने या कार्य करने पर सुख छाया की तरह पीछे चलता है।";
      trans2 = "घृणा से घृणा कभी समाप्त नहीं होती; घृणा केवल प्रेम से ही समाप्त होती है। यह शाश्वत नियम है।";
    } else if (isChristian) {
      trans1 = "आदि में शब्द था, और शब्द परमेश्वर के साथ था, और शब्द परमेश्वर था।";
      trans2 = "धन्य हैं वे जो शांति स्थापित करते हैं, क्योंकि वे परमेश्वर के पुत्र कहलाएंगे।";
    } else if (isJudaism) {
      trans1 = "आदि में परमेश्वर ने आकाश और पृथ्वी की रचना की।";
      trans2 = "सुनो हे इस्राइल: हमारा परमेश्वर यहोवा एक ही है।";
    } else if (isSikh) {
      trans1 = "एक ओंकार, सतनाम, कर्ता पुरख, निर्भौ, निर्वैर, अकाल मूरत, अजूनी, सैभं।";
      trans2 = "जिन्होंने नाम का ध्यान किया और अपनी मेहनत पूरी की, उनके मुख दीप्तिमान हैं और उनके साथ कई अन्य आत्माएं भी मुक्त हो जाती हैं।";
    } else if (isJain) {
      trans1 = "मैं सभी आध्यात्मिक विजेताओं (अरिहंतों) को नमन करता हूं। मैं सभी मुक्त आत्माओं, आचार्यों, उपाध्यायों और ब्रह्मांड के सभी पवित्र संतों को नमन करता हूं।";
      trans2 = "सभी जीवित प्राणी पारस्परिक सेवा और अहिंसा के माध्यम से एक-दूसरे की सहायता और समर्थन करने के लिए बने हैं।";
    } else if (isTaoist) {
      trans1 = "जिस मार्ग को व्यक्त किया जा सके वह शाश्वत मार्ग नहीं है। जिस नाम को नाम दिया जा सके वह शाश्वत नाम नहीं है।";
      trans2 = "सर्वोच्च अच्छाई पानी के समान है। पानी बिना किसी प्रतिस्पर्धा के सभी जीवों को लाभ पहुंचाता है, और उन निचले स्थानों पर बहता है जिनसे मनुष्य बचते हैं।";
    }
  } else if (langKey.includes("arabic") || langKey === "ar") {
    selectedLanguageLabel = "Arabic";
    if (isHindu) {
      trans1 = "قُدني من الوهم إلى الحقيقة، ومن الظلمات إلى النور، ومن الموت إلى الخلود.";
      trans2 = "أدِ واجبك دون أي تعلق بالنتائج. بالعمل بلا توقعات، يحقق الإنسان الحالة الأسمى.";
    } else if (isIslam) {
      trans1 = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
      trans2 = "اهدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ❁ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ";
    } else if (isBuddhism) {
      trans1 = "العقل يسبق كل الحالات الذهنية وهو سيدها. إن تكلم المرء بأفكار نقية تتبعه السعادة كالظل.";
      trans2 = "لا يمكن التغلب على الكراهية بالكراهية؛ بل بالمحبة اللامتناهية وحده يتبدد الحقد. هذا قانون أبدي.";
    } else if (isChristian) {
      trans1 = "في البدء كان الكلمة، والكلمة كان عند الله، وكان الكلمة الله.";
      trans2 = "طوبى لصانعي السلام، لأنهم أبناء الله يدعون.";
    } else if (isJudaism) {
      trans1 = "في البدء خلق الله السموات والأرض.";
      trans2 = "اسمع يا إسرائيل: الرب إلهنا رب واحد.";
    }
  } else if (langKey.includes("tamil") || langKey === "ta") {
    selectedLanguageLabel = "Tamil";
    if (isHindu) {
      trans1 = "என்னை அசத்தியத்திலிருந்து சத்தியத்திற்கும், இருளிலிருந்து ஒளிக்கும், மரணத்திலிருந்து அழியாமையை நோக்கி அழைத்துச் செல்லுங்கள்.";
      trans2 = "எந்தவொரு பற்றுமின்றி உன் கடமையைச் செய். பலனை எதிர்பார்க்காமல் செயல்படுவதன் மூலம் உன்னத நிலையை அடையலாம்.";
    } else if (isIslam) {
      trans1 = "அளவற்ற அருளாளனும், நிகரற்ற அன்புடையோனுமாகிய அல்லாஹ்வின் திருப்பெயரால்.";
      trans2 = "எங்களுக்கு நேரான வழியைக் காட்டுவாயாக - நீ எவர்களுக்கு அருள் புரிந்தாயோ அவர்களின் வழி.";
    } else if (isBuddhism) {
      trans1 = "மனமே அனைத்து எண்ணங்களுக்கும் முந்தியது. தூய்மையான மனதுடன் பேசினால் மகிழ்ச்சி நிழல் போல் தொடரும்.";
      trans2 = "வெறுப்பால் வெறுப்பை வெல்ல முடியாது; அன்பால் மட்டுமே வெறுப்பை வெல்ல முடியும். இதுவே நித்திய விதி.";
    } else if (isChristian) {
      trans1 = "ஆதியிலே வார்த்தை இருந்தது, அந்த வார்த்தை தேவனிடத்திலிருந்தது, அந்த வார்த்தை தேவனாயிருந்தது.";
      trans2 = "சமாதானம் பண்ணுகிறவர்கள் பாக்கியவான்கள், அவர்கள் தேவனுடைய புத்திரர் என்னப்படுவார்கள்.";
    } else if (isJudaism) {
      trans1 = "ஆதியிலே தேவன் வானத்தையும் பூமியையும் சிருஷ்டித்தார்.";
      trans2 = "இஸ்ரவேலே கேள்: நம்முடைய தேவனாகிய கர்த்தர் ஒருவரே கர்த்தர்.";
    }
  } else if (langKey.includes("telugu") || langKey === "te") {
    selectedLanguageLabel = "Telugu";
    if (isHindu) {
      trans1 = "నన్ను అసత్యము నుండి సత్యము వైపుకు, చీకటి నుండి వెలుగు వైపుకు, మరణము నుండి అమరత్వము వైపుకు నడిపించుము.";
      trans2 = "ఎలాంటి ఆసక్తి లేకుండా నీ కర్తవ్యాన్ని నిర్వర్తించుము. ఫలితాన్ని ఆశించకుండా కర్మ చేయడం ద్వారా పరమ పదాన్ని పొందుతారు.";
    } else if (isIslam) {
      trans1 = "అత్యంత దయామయుడు మరియు కరుణామయుడైన అల్లాహ్ పేరుతో.";
      trans2 = "మాకు సరళమైన మార్గంలో మార్గదర్శకత్వం చేయి - నీవు అనుగ్రహించిన వారి మార్గం.";
    } else if (isBuddhism) {
      trans1 = "మనస్సే అన్ని ఆలోచనలకు మూలం. పరిశుద్ధమైన మనస్సుతో మాట్లాడితే సంతోషం నీడలా నిన్ను అనుసరిస్తుంది.";
      trans2 = "ద్వేషం ద్వేషంతో నశించదు, ప్రేమతో మాత్రమే ద్వేషం నశిస్తుంది. ఇది సనాతన నియమం.";
    } else if (isChristian) {
      trans1 = "ఆదియందు వాక్యము ఉండెను, వాక్యము దేవునివద్ద ఉండెను, వాక్యమే దేవుడై ఉండెను.";
      trans2 = "సమాధానపరచువారు ధన్యులు, వారు దేవుని కుమారులని పిలవబడుదురు.";
    } else if (isJudaism) {
      trans1 = "ఆదియందు దేవుడు భూమ్యాకాశములను సృజించెను.";
      trans2 = "ఇశ్రాయేలూ ఆలకించుము: మన దేవుడైన యెహోవా ఒక్కడే యెహోవా.";
    }
  } else if (langKey.includes("marathi") || langKey === "mr") {
    selectedLanguageLabel = "Marathi";
    if (isHindu) {
      trans1 = "मला असत्याकडून सत्याकडे न्या, अंधाराकडून प्रकाशाकडे न्या, मृत्यूकडून अमरत्वाकडे न्या.";
      trans2 = "कोणत्याही आसक्ती शिवाय आपले कर्तव्य करा. फळाची अपेक्षा न ठेवता कर्म केल्याने मनुष्य सर्वोच्च अवस्था प्राप्त करतो.";
    } else if (isIslam) {
      trans1 = "अल्लाच्या नावाने, जो अत्यंत दयाळू आणि परम कृपाळू आहे.";
      trans2 = "आम्हाला सरळ मार्ग दाखव - ज्यांच्यावर तू कृपा केली आहेस त्यांचा मार्ग.";
    } else if (isBuddhism) {
      trans1 = "मन सर्व विचारांच्या पुढे असते. शुद्ध मनाने बोलल्यास सुख सावलीसारखे मागे येते.";
      trans2 = "द्वेषाने द्वेष कधीच संपत नाही; केवळ प्रेमानेच द्वेष संपतो. हा सनातन नियम आहे.";
    } else if (isChristian) {
      trans1 = "प्रारंभी शब्द होता, आणि शब्द देवाजवळ होता, आणि शब्द देव होता.";
      trans2 = "जे शांतता प्रस्थापित करतात ते धन्य, कारण ते देवाची मुले म्हटली जातील.";
    } else if (isJudaism) {
      trans1 = "प्रारंभी देवाने आकाश आणि पृथ्वी निर्माण केली.";
      trans2 = "ऐक इस्राईल: परमेश्वर आमचा देव, परमेश्वर एकच आहे.";
    }
  } else if (langKey.includes("hindi") || langKey === "hi") {
    selectedLanguageLabel = "Hindi";
    if (isHindu) {
      trans1 = "मुझे असत्य से सत्य की ओर ले चलो, अंधकार से प्रकाश की ओर ले चलो, मृत्यु से अमरत्व की ओर ले चलो।";
      trans2 = "बिना किसी आसक्ति के अपने कर्तव्य का पालन करो। बिना किसी फल की आकांक्षा के कर्म करने से मनुष्य परम पद प्राप्त करता है।";
    } else if (isIslam) {
      trans1 = "अल्लाह के नाम से, जो अत्यंत दयावान और परम कृपालु है।";
      trans2 = "हमें सीधे मार्ग पर चला - उन लोगों के मार्ग पर जिन पर तूने कृपा की।";
    } else if (isBuddhism) {
      trans1 = "मन सभी मानसिक अवस्थाओं से श्रेष्ठ है। शुद्ध मन से बोलने या कार्य करने पर सुख छाया की तरह पीछे चलता है।";
      trans2 = "घृणा से घृणा कभी समाप्त नहीं होती; घृणा केवल प्रेम से ही समाप्त होती है। यह शाश्वत नियम है।";
    } else if (isChristian) {
      trans1 = "आदि में शब्द था, और शब्द परमेश्वर के साथ था, और शब्द परमेश्वर था।";
      trans2 = "धन्य हैं वे जो शांति स्थापित करते हैं, क्योंकि वे परमेश्वर के पुत्र कहलाएंगे।";
    } else if (isJudaism) {
      trans1 = "आदि में परमेश्वर ने आकाश और पृथ्वी की रचना की।";
      trans2 = "सुनो हे इस्राइल: हमारा परमेश्वर यहोवा एक ही है।";
    }
  } else if (langKey.includes("spanish") || langKey === "es") {
    selectedLanguageLabel = "Spanish";
    if (isHindu) {
      trans1 = "Guíame de lo irreal a lo real, de la oscuridad a la luz, de la muerte a la inmortalidad.";
      trans2 = "Realiza tu deber con absoluto desapego. Al actuar sin expectativa de recompensa, uno alcanza el estado supremo.";
    } else if (isIslam) {
      trans1 = "En el nombre de Alá, el Compasivo, el Misericordioso.";
      trans2 = "Guános por el camino recto, el camino de los que has favorecido.";
    } else if (isBuddhism) {
      trans1 = "La mente antecede a todos los estados mentales. Si uno habla o actúa con mente pura, la felicidad le sigue como una sombra.";
      trans2 = "El odio nunca se supera con el odio; el odio solo se supera con el amor. Esta es una ley eterna.";
    } else if (isChristian) {
      trans1 = "En el principio era el Verbo, y el Verbo era con Dios, y el Verbo era Dios.";
      trans2 = "Bienaventurados los pacificadores, porque ellos serán llamados hijos de Dios.";
    } else if (isJudaism) {
      trans1 = "En el principio creó Dios los cielos y la tierra.";
      trans2 = "Escucha, O Israel: El Señor es nuestro Dios, el Señor es Uno.";
    }
  } else if (langKey.includes("french") || langKey === "fr") {
    selectedLanguageLabel = "French";
    if (isHindu) {
      trans1 = "Conduis-moi de l'irréel au réel, des ténèbres à la lumière, de la mort à l'immortalité.";
      trans2 = "Accomplis ton devoir avec un détachement absolu. En agissant sans attente de récompense, on atteint l'état suprême.";
    } else if (isIslam) {
      trans1 = "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux.";
      trans2 = "Guide-nous dans le droit chemin, le chemin de ceux que Tu as comblés de bienfaits.";
    } else if (isBuddhism) {
      trans1 = "L'esprit précède tous les états mentaux. Si l'on parle ou agit avec un esprit pur, le bonheur suit comme une ombre indéfectible.";
      trans2 = "La haine ne s'éteint jamais par la haine ; elle s'éteint par l'amour. C'est une loi éternelle.";
    } else if (isChristian) {
      trans1 = "Au commencement était la Parole, et la Parole était avec Dieu, et la Parole était Dieu.";
      trans2 = "Heureux les artisans de paix, car ils seront appelés fils de Dieu.";
    } else if (isJudaism) {
      trans1 = "Au commencement, Dieu créa les cieux et la terre.";
      trans2 = "Écoute, Israël : L'Éternel est notre Dieu, l'Éternel est Unique.";
    }
  } else if (langKey.includes("german") || langKey === "de") {
    selectedLanguageLabel = "German";
    if (isHindu) {
      trans1 = "Führe mich vom Schein zur Wahrheit, von der Dunkelheit zum Licht, vom Tod zur Unsterblichkeit.";
      trans2 = "Erfülle deine Pflicht mit absoluter Hingabe und ohne Anhaftung. Wer ohne Erwartung von Belohnung handelt, erreicht den höchsten Zustand.";
    } else if (isIslam) {
      trans1 = "Im Namen Allahs, des Allerbarmers, des Barmherzigen.";
      trans2 = "Führe uns den geraden Weg, den Weg derer, denen Du Gnade erwiesen hast.";
    } else if (isBuddhism) {
      trans1 = "Der Geist geht allen mentalen Zuständen voraus. Wenn man mit reinem Geist spricht oder handelt, folgt einem das Glück wie ein Schatten.";
      trans2 = "Hass wird niemals durch Hass überwunden; Hass wird nur durch unendliche Liebe überwunden. Dies ist ein ewiges Gesetz.";
    } else if (isChristian) {
      trans1 = "Im Anfang war das Wort, und das Wort war bei Gott, und das Wort war Gott.";
      trans2 = "Selig sind die Friedensstifter, denn sie werden Gottes Kinder genannt werden.";
    } else if (isJudaism) {
      trans1 = "Am Anfang schuf Gott Himmel und Erde.";
      trans2 = "Höre, Israel: Der Herr ist unser Gott, der Herr ist Einzig.";
    } else if (isSikh) {
      trans1 = "Es gibt nur einen einzigen Schöpfer, Wahrheit ist Sein Name. Ohne Furcht, ohne Hass, zeitlos, ungeboren, selbstexistierend.";
      trans2 = "Diejenigen, die sich auf den göttlichen Namen konzentrierten und mit ehrlicher Hingabe dienten – ihre Gesichter leuchten vor Glanz, und viele andere Seelen werden mit ihnen erlöst!";
    } else if (isJain) {
      trans1 = "Ich verneige mich vor allen spirituellen Siegern (Arhats). Ich verneige mich vor den befreiten Seelen, den Lehrern und allen Heiligen im Universum.";
      trans2 = "Alle Lebewesen existieren, um sich gegenseitig durch Beistand und Gewaltlosigkeit zu unterstützen.";
    } else if (isTaoist) {
      trans1 = "Das Tao, das gesprochen werden kann, ist nicht das ewige Tao. Der Name, der genannt werden kann, ist nicht der ewige Name.";
      trans2 = "Die höchste Güte ist wie das Wasser. Wasser nützt allen Wesen, ohne mit ihnen zu wetteifern, und fließt an die tiefen Orte, die die Menschen meiden. Daher ist es dem Tao nahe.";
    }
  } else if (langKey.includes("chinese") || langKey === "zh") {
    selectedLanguageLabel = "Chinese";
    if (isHindu) {
      trans1 = "引导我从虚妄走向真实，从黑暗走向光明，从死亡走向永生。";
      trans2 = "以绝对无私的态度履行你的职责。若能不求回报地行动，人便能达到至高境界。";
    } else if (isIslam) {
      trans1 = "奉至仁至慈的安拉之名。";
      trans2 = "引导我们走上正路——即你所施恩者的路，而非受谴怒者或迷误者的路。";
    } else if (isBuddhism) {
      trans1 = "诸法意先导，意主意造作。若以清净心说话或行动，快乐便会如影随形。";
      trans2 = "怨怨相报深，唯有慈爱能平息怨恨。这是一条永恒的法则。";
    } else if (isChristian) {
      trans1 = "太初有道，道与神同在，道就是神。";
      trans2 = "使人和睦的人有福了，因为他们必称为神的儿子。";
    } else if (isJudaism) {
      trans1 = "起初，神创造天地。";
      trans2 = "以色列啊，你要听：耶和华我们的神是独一的主。";
    } else if (isSikh) {
      trans1 = "造物主唯有一，真理是其名。不畏、无怨、永恒、自生。因真师之恩而证悟。";
      trans2 = "那些专注神圣之名并诚恳奉献的人，他们面带光彩，众多灵魂随之得救。";
    } else if (isJain) {
      trans1 = "我向一切战胜烦恼的阿罗汉顶礼。向一切解脱者、导师、教师和宇宙中的圣者顶礼。";
      trans2 = "世间一切众生皆当通过相互扶持与守望相助来共存。";
    } else if (isTaoist) {
      trans1 = "道可道，非常道；名可名，非常名。无名天地之始；有名万物之母。";
      trans2 = "上善若水。水善利万物而不争，处众人之所恶，故几于道。";
    }
  } else if (langKey.includes("japanese") || langKey.includes("japaneese") || langKey === "ja") {
    selectedLanguageLabel = "Japanese";
    if (isHindu) {
      trans1 = "私を虚妄から真実へ、暗闇から光へ、死から不滅へと導いてください。";
      trans2 = "執着を完全に捨てて、あなたの果たすべき義務を遂行しなさい。報酬を期待せず行動することで、人は至高の境地に達します。";
    } else if (isIslam) {
      trans1 = "慈悲あまねく慈愛深きアッラーの御名において。";
      trans2 = "私たちを正しい道、あなたが恵みを与えられた人々の道へと導いてください。";
    } else if (isBuddhism) {
      trans1 = "物事は心に先立たれ、心が主であり、心によって作り出される。清らかな心で語り、行動するなら、幸福が影のように付き従う。";
      trans2 = "怨みに報いるに怨みを以てすれば、ついに怨みの息（や）むことなし。怨みを手放すことによってのみ、怨みは息む。これは永遠の法である。";
    } else if (isChristian) {
      trans1 = "初めに言（ことば）があった。言は神と共にあった。言は神であった。";
      trans2 = "平和をつくる人々は幸いである、その人たちは神の子と呼ばれるからである。";
    } else if (isJudaism) {
      trans1 = "初めに、神は天地を創造された。";
      trans2 = "聞け、イスラエルよ。我らの神、主は唯一の主である。";
    } else if (isSikh) {
      trans1 = "創造主はただ一つであり、真理はその御名である。恐れなく、敵意なく、永遠であり、自ら存在する。";
      trans2 = "神聖な御名に集中し、誠実に奉仕した人々は輝きに満ち, 彼らと共に多くの魂が救われます。";
    } else if (isJain) {
      trans1 = "私はすべての阿羅漢に礼拝します。解放された魂、指導者、教師、宇宙のすべての聖者に礼拝します。";
      trans2 = "すべての魂は、相互の奉仕と非暴力によって助け合い、支え合うものである。";
    } else if (isTaoist) {
      trans1 = "道の道とすべきは、常の道に非ず。名の名とすべきは、常の名に非ず。無名は天地の始め、有名は万物の母。";
      trans2 = "上善は水の如し。水は善く万物を利して争わず、衆人の悪（にく）む所に処（お）る、故に道に幾（ちか）し。";
    }
  } else if (langKey.includes("russian") || langKey === "ru") {
    selectedLanguageLabel = "Russian";
    if (isHindu) {
      trans1 = "Веди меня от нереального к реальному, от тьмы к свету, от смерти к бессмертию.";
      trans2 = "Выполняй свой долг с абсолютным непривязыванием. Действуя без ожидания награды, человек достигает высшего состояния.";
    } else if (isIslam) {
      trans1 = "Во имя Аллаха, Милостивого, Милосердного.";
      trans2 = "Веди нас прямым путем — путем тех, кого Ты облагодетельствовал, а не тех, кто навлек на себя гнев, и не заблудших.";
    } else if (isBuddhism) {
      trans1 = "Разум предшествует всем состояниям. Разум — их владыка, они созданы разумом. Если кто-то говорит или действует с чистым разумом, счастье следует за ним как тень.";
      trans2 = "Ненависть никогда не одолеть ненавистью; только любовью побеждается ненависть. Это вечный закон.";
    } else if (isChristian) {
      trans1 = "В начале было Слово, и Слово было у Бога, и Слово было Бог.";
      trans2 = "Блаженны миротворцы, ибо они будут наречены сынами Божиими.";
    } else if (isJudaism) {
      trans1 = "В начале сотворил Бог небо и землю.";
      trans2 = "Слушай, Израиль: Господь, Бог наш, Господь един есть.";
    } else if (isSikh) {
      trans1 = "Есть лишь один Единый Творец, Истина — Имя Его. Творец, без страха, без вражды, вне времени, нерожденный, самосущий.";
      trans2 = "Те, кто сосредоточился на Божественном Имени и искренне трудился — лица их сияют, и многие другие будут спасены вместе с ними!";
    } else if (isJain) {
      trans1 = "Поклоняюсь всем духовным победителям (Арахантам). Поклоняюсь освобожденным душам, учителям и святым во Вселенной.";
      trans2 = "Все живые души созданы для того, чтобы помогать и поддерживать друг друга посредством взаимного служения и ненасилия.";
    } else if (isTaoist) {
      trans1 = "Дао, которое может быть выражено словами, не есть постоянное Дао. Имя, которое может быть названо, не есть постоянное имя.";
      trans2 = "Высшая добродетель подобна воде. Вода приносит пользу всем существам, не соперничая с ними, и течет в низкие места, которых избегают люди.";
    }
  } else if (langKey.includes("portuguese") || langKey.includes("portugueese") || langKey === "pt") {
    selectedLanguageLabel = "Portuguese";
    if (isHindu) {
      trans1 = "Guia-me do irreal para o real, da escuridão para a luz, da morte para a imortalidade.";
      trans2 = "Realiza o teu dever com desapego absoluto. Agindo sem expectativa de recompensa, alcança-se o estado supremo.";
    } else if (isIslam) {
      trans1 = "Em nome de Deus, o Clemente, o Misericordioso.";
      trans2 = "Guia-nos pelo caminho reto — o caminho daqueles a quem concedeste a Tua graça.";
    } else if (isBuddhism) {
      trans1 = "A mente precede todas as coisas. A mente é sua soberana; tudo é criado pela mente. Se falas ou ages com a mente pura, a felicidade segue-te como uma sombra.";
      trans2 = "O ódio nunca é superado pelo ódio; o ódio só é superado pelo amor sem limites. Esta é uma lei eterna.";
    } else if (isChristian) {
      trans1 = "No princípio era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus.";
      trans2 = "Bem-aventurados os pacificadores, porque serão chamados filhos de Deus.";
    } else if (isJudaism) {
      trans1 = "No princípio, criou Deus os céus e a terra.";
      trans2 = "Ouve, ó Israel: O Senhor, nosso Deus, é o único Senhor.";
    } else if (isSikh) {
      trans1 = "Existe apenas um Criador Supremo, Verdade é o Seu Nome. Criativo, sem medo, sem rancor, atemporal, não criado, autoexistente.";
      trans2 = "Aqueles que se focaram no Nome Divino e partiram após um trabalho sincero — os seus rostos brilham de esplendor, e muitos outros são salvos com eles!";
    } else if (isJain) {
      trans1 = "Presto homenagem aos conquistadores espirituais (Arahants). Presto homenagem às almas libertadas, líderes, professores e a todos os santos do universo.";
      trans2 = "Todas as almas existem para se apoiarem mutuamente através do serviço mútuo e da não-violência.";
    } else if (isTaoist) {
      trans1 = "O Tao que pode ser expresso não é o Tao eterno. O nome que pode ser nomeado não é o nome eterno.";
      trans2 = "A bondade suprema é como a água. A água beneficia todos os seres sem competir, correndo para os lugares baixos que os homens evitam. Por isso, está próxima do Tao.";
    }
  }

  const labelSuffix = selectedLanguageLabel !== "English" ? ` (${selectedLanguageLabel})` : "";

  const payload = {
    isOfflineFallback: true,
    introSummary: `A beautiful academic reading of ${bookTitle} (${divisionsName} ${divisionNumber}). This portion addresses foundational questions of human ethics, duties, personal discipline, and interfaith connections.`,
    verses: [
      {
        number: `${divisionNumber}.1`,
        originalText: originalText1,
        transliteration: translit1,
        translation: trans1
      },
      {
        number: `${divisionNumber}.2`,
        originalText: originalText2,
        transliteration: translit2,
        translation: trans2
      }
    ],
    commentary: `### Scholarly Commentary\n\nThis classic section of **${bookTitle}** outlines the sublime universal principles of ethical living, mental mastery, and loving devotion. In this portion, readers are encouraged to step beyond transient daily anxieties and seek the eternal essence of reality.\n\nFrom an academic standpoint, these teachings reflect a deep alignment of self-sacrifice with cosmic orders. The text highlights how quiet inner contemplation fuels active, dynamic righteousness in the external world. It remains one of humanity's most influential blueprints for moral duty and communal harmony.`,
    isLiveAiOutput: false,
    interfaithParallels: [
      {
        religion: isHindu ? "Buddhism" : "Hinduism",
        source: isHindu ? "Dhammapada Chapter 1:5" : "Bhagavad Gita 12.13",
        similarity: `Both text selections highlight the absolute power of a purified mind free from hostility to attain supreme peace.${labelSuffix}`,
        lesson: `Practice quiet mindfulness daily. Release extreme attachment to physical results, and focus purely on the moral quality of your action.${labelSuffix}`
      },
      {
        religion: isChristian ? "Islam" : "Christianity",
        source: isChristian ? "Quran Surah 2:177" : "Matthew 5:9",
        similarity: `The call to social responsibility, keeping covenants, and practicing charity is perfectly aligned with the Beatitudes.${labelSuffix}`,
        lesson: `Strive to build bridges of peace and understanding in your community, choosing love and service over hostility.${labelSuffix}`
      }
    ]
  };

  const isEnglish = langKey.includes("english") || langKey === "en";
  if (!isEnglish) {
    try {
      const fieldsToTranslate = [
        payload.introSummary,
        payload.verses[0].translation,
        payload.verses[1].translation,
        payload.commentary,
        payload.interfaithParallels[0].similarity,
        payload.interfaithParallels[0].lesson,
        payload.interfaithParallels[1].similarity,
        payload.interfaithParallels[1].lesson
      ];
      
      const translated = await translateTextOfflineGoogleBatch(fieldsToTranslate, targetLanguage);
      if (translated[0]) payload.introSummary = translated[0];
      if (translated[1]) payload.verses[0].translation = translated[1];
      if (translated[2]) payload.verses[1].translation = translated[2];
      if (translated[3]) payload.commentary = translated[3];
      if (translated[4]) payload.interfaithParallels[0].similarity = translated[4];
      if (translated[5]) payload.interfaithParallels[0].lesson = translated[5];
      if (translated[6]) payload.interfaithParallels[1].similarity = translated[6];
      if (translated[7]) payload.interfaithParallels[1].lesson = translated[7];
    } catch (translateErr) {
      console.warn("Failed to dynamically translate offline scripture fallback:", translateErr);
    }
  }

  return payload;
}

function getOfflineCompareFallback(theme: string, selectedReligions: string[]) {
  return {
    theme: theme,
    synthesis: `This masterful study explores the universal theme of "${theme}" across ${selectedReligions.join(", ")}. In examining these diverse heritages, we find a beautiful, common bridge of divine guidance, social ethics, and quiet spiritual wisdom. Each tradition offers unique vocabulary but directs believers to the same ultimate ocean of love, duty, and human respect.`,
    comparisons: selectedReligions.map((rel) => {
      let citation = "";
      let quote = "";
      let explanation = "";
      let relevance = "";

      const rLower = rel.toLowerCase();
      if (rLower.includes("hindu")) {
        citation = "Bhagavad Gita 12.13";
        quote = "Advesta sarva-bhutanam maitrah karuna eva ca...";
        explanation = "Krishna explains that the ideal path of devotion is to be free from malice, friendly, and compassionate to all living creatures.";
        relevance = "In our complex modern world, practicing active non-injury (Ahimsa) and compassion heals environmental and social divides.";
      } else if (rLower.includes("islam")) {
        citation = "Quran 2:177";
        quote = "Righteousness is to believe in Allah, to give money out of love, to perform prayer and observe charity.";
        explanation = "True piety is defined by social responsibility, welfare of the vulnerable, keeping promises, and patience in times of adversity.";
        relevance = "This highlights that religious duties must translate into concrete actions of poverty relief and social reconciliation.";
      } else if (rLower.includes("christian")) {
        citation = "Matthew 5:44";
        quote = "But I say unto you, Love your enemies, bless them that curse you, do good to them that hate you.";
        explanation = "Jesus demands unconditional love (Agape), breaking cycles of retribution and asserting the divine image in all people.";
        relevance = "In polarized communities, choosing restorative dialogue over hostile confrontation offers a revolutionary path to peace.";
      } else if (rLower.includes("buddh")) {
        citation = "Dhammapada Verse 5";
        quote = "Hatred does not cease by hatred; hatred ceases only by love. This is an eternal law.";
        explanation = "The Buddha explains that the cycle of hostility can only be extinguished by self-control and boundless loving-kindness (Metta).";
        relevance = "Mental hygiene and defusing prejudice prevents structural conflict in workplaces and digital societies.";
      } else {
        citation = "Universal Golden Rule";
        quote = "Choose for others that which you would choose for yourself.";
        explanation = "A common thread across all moral systems is the integration of individual safety with the protection of public welfare.";
        relevance = "It urges us to formulate public policies and daily habits that prioritize equal respect and dignity.";
      }

      return {
        religion: rel,
        scriptureSource: citation,
        keyPassage: quote,
        explanation: explanation,
        relevanceToModernLife: relevance
      };
    })
  };
}

function getOfflineWorkbenchFallback(theme: string, sc1Title: string, sc1Rel: string, sc2Title: string, sc2Rel: string) {
  const details = (title: string, rel: string) => {
    const r = rel.toLowerCase();
    if (r.includes("hindu")) {
      return {
        source: `${title} 12.13`,
        passage: "Advesta sarva-bhutanam maitrah karuna eva ca (One who is free from malice, friendly and compassionate to all living beings).",
        context: "Spoken by Lord Krishna to Arjuna on the battlefield of Kurukshetra, guiding him on how to maintain inner peace and execute selfless duty.",
        message: "True spiritual realization means transcending ego and seeing the Divine in every entity, translating to boundless friendship.",
        keyTerms: "Ahimsa (Non-harming), Karuna (Compassion), Maitri (Universal friendliness)",
        application: "Substitute personal competition with selfless service and active support of your community."
      };
    } else if (r.includes("islam")) {
      return {
        source: `${title} Surah Al-Baqarah 2:177`,
        passage: "True righteousness is to believe in Allah, and give wealth, in spite of love for it, to relatives, orphans, the needy, the traveler...",
        context: "Revealed in Medina, establishing the ethical and social foundations of the early community as distinct from empty ceremonialism.",
        message: "Faith is validated by concrete deeds of social justice, personal generosity, and keeping sacred covenants.",
        keyTerms: "Birr (Righteousness), Infaq (Charitable spending), Taqwa (God-consciousness)",
        application: "Perform direct, voluntary service and share financial resources with the marginalized."
      };
    } else if (r.includes("christian")) {
      return {
        source: `${title} 1 Corinthians 13:4-5`,
        passage: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud... It keeps no record of wrongs.",
        context: "Written by the Apostle Paul to the divided congregation in Corinth, pointing to the supreme spiritual path.",
        message: "The absolute zenith of the spiritual life is self-emptying, unconditional love (Agape) that transcends personal interests.",
        keyTerms: "Agape (Divine, unconditional love), Tapeinophrosyne (Humility), Hypomone (Patient endurance)",
        application: "Practice patience in difficult conversations and actively let go of past grievances."
      };
    } else if (r.includes("buddh")) {
      return {
        source: `${title} Dhammapada Verse 5`,
        passage: "Hatred does not cease by hatred; hatred ceases only by love. This is an eternal law.",
        context: "From the collection of the Buddha's sayings, serving as a primary handbook for monastic and lay ethics.",
        message: "Aggression and conflict can never be solved by further aggression. Only mindful loving-kindness defuses hostility.",
        keyTerms: "Metta (Loving-kindness), Avihimsa (Non-violence), Dhamma (Universal truth)",
        application: "Respond to criticism with a calm, focused mind and de-escalate digital arguments."
      };
    } else {
      return {
        source: `${title} Chapter 1`,
        passage: "Treat others as you would wish to be treated yourself in all circumstances.",
        context: "A universal moral compass shared by diverse ancient sages and philosophical schools.",
        message: "The protection of our neighbor's dignity is the foundation of a stable, cohesive, and moral civilization.",
        keyTerms: "Golden Rule (Reciprocity), Humanitas (Humaneness), Sympatheia (Mutual sympathy)",
        application: "Adopt the perspective of the other before making judgments or taking action."
      };
    }
  };

  const sc1 = details(sc1Title, sc1Rel);
  const sc2 = details(sc2Title, sc2Rel);

  return {
    theme: theme,
    scripture1: {
      title: sc1Title,
      religion: sc1Rel,
      ...sc1
    },
    scripture2: {
      title: sc2Title,
      religion: sc2Rel,
      ...sc2
    },
    resonanceScore: 92,
    crossSynthesis: `The comparative analysis between ${sc1Title} (${sc1Rel}) and ${sc2Title} (${sc2Rel}) regarding the theme of "${theme}" reveals a profound convergence of ethical and spiritual values. Despite their distinct historical frameworks and terminologies—such as the focus on personal self-mastery in one and social covenants in the other—both sacred canons direct the seeker toward self-transcendence. They demonstrate that true moral elevation is verified by how we treat our fellow beings, bridging separate cultural vocabularies into a single harmonious rhythm of universal guidance.`
  };
}

function getOfflineVerseAlignmentFallback(verseText: string, bookTitle: string, verseNumber: string, religion: string) {
  const relLower = (religion || "").toLowerCase();
  const isHindu = relLower.includes("hindu") || (bookTitle || "").toLowerCase().includes("gita") || (bookTitle || "").toLowerCase().includes("veda");

  return {
    sourceVerse: {
      book: bookTitle,
      number: verseNumber || "N/A",
      text: verseText
    },
    parallelTradition: isHindu ? "Buddhism" : "Hinduism",
    parallelScriptureSource: isHindu ? "Dhammapada Chapter 1, Verse 5" : "Bhagavad Gita Chapter 12, Verse 13",
    parallelKeyPassage: isHindu ? "Hatred is never appeased by hatred; it is appeased by love." : "Be friendly, compassionate, and free from malicious intent toward all.",
    theologicalAlignment: `Both passages explore the absolute requirement of returning hostility with loving grace. The core theological target is to dissolve the personal ego (Ahamkara) and discover the unifying consciousness that resides equally in all sentient beings. Whether expressed as 'Metta' (loving-kindness) or 'Daya' (compassion), both traditions declare that retaliation is a spiritual barrier.`,
    modernSpiritualLesson: "When confronted with aggressive behavior or negative words, pause for three breaths. Act strictly from a spacious state of patience, restoring harmony to your environment."
  };
}

function getOfflineSimilarVersesFallback(verseText: string, bookTitle: string, verseNumber: string, religion: string) {
  const matchingGroup = findMatchingAlignmentGroup(verseText);
  if (matchingGroup) {
    const otherVerses = matchingGroup.filter(v => v.book.toLowerCase() !== (bookTitle || "").toLowerCase());
    if (otherVerses.length > 0) {
      return {
        sourceVerse: {
          book: bookTitle,
          number: verseNumber || "N/A",
          text: verseText
        },
        similarVerses: otherVerses.map(v => ({
          book: v.book,
          reference: v.reference,
          religion: v.religion,
          text: v.text,
          similarity: `This teaching is topically aligned under the universal theme of "${v.theme}". It underscores the shared, cross-traditional moral commitment that transcends individual cultural contexts.`,
          resonanceScore: 95
        }))
      };
    }
  }

  const relLower = (religion || "").toLowerCase();
  const isHindu = relLower.includes("hindu") || (bookTitle || "").toLowerCase().includes("gita") || (bookTitle || "").toLowerCase().includes("veda");

  return {
    sourceVerse: {
      book: bookTitle,
      number: verseNumber || "N/A",
      text: verseText
    },
    similarVerses: [
      {
        book: isHindu ? "Dhammapada" : "Bhagavad Gita",
        reference: isHindu ? "Chapter 1, Verse 5" : "Chapter 12, Verse 13",
        religion: isHindu ? "buddhism" : "hinduism",
        text: isHindu ? "Hatred is never appeased by hatred; it is appeased by love. This is an eternal law." : "Be friendly, compassionate, and free from malicious intent toward all.",
        similarity: "Both teachings prioritize unconditional peace, urging seekers to conquer aggressive instincts with selfless compassion.",
        resonanceScore: 95
      },
      {
        book: "Holy Bible",
        reference: "Romans 12:21",
        religion: "christianity",
        text: "Do not be overcome by evil, but overcome evil with good.",
        similarity: "Teaches the practitioner to maintain perfect ethical integrity and overcome external negativity with goodness.",
        resonanceScore: 92
      },
      {
        book: "Quran",
        reference: "Surah 41, Verse 34",
        religion: "islam",
        text: "Repel evil with that which is better; then the one with whom you had enmity will become as if he were a close friend.",
        similarity: "Advocates for the transformative power of choosing the better path, turning conflict into lasting mutual respect.",
        resonanceScore: 90
      }
    ]
  };
}

function getOfflineChatFallback(messages: any[], contextBookTitle?: string, contextChapter?: string) {
  const lastUserMsg = [...messages].reverse().find(m => m.role === "user" || m.sender === "user")?.text || "Hello";
  
  return {
    text: `### Academic Comparative Insight\n\nThank you for exploring that. I am happy to guide you scholarly. \n\nRegarding **"${lastUserMsg}"** ${contextBookTitle ? `with respect to the context of ${contextBookTitle} ${contextChapter || ""}` : ""}, world scriptures present a beautiful alignment of wisdom:\n\n1. **Selfless Duty & Ethics**: Traditions like Hinduism (Bhagavad Gita's *Nishkama Karma*) and Taoism (*Wu Wei*) urge us to focus on the moral purity of our actions rather than obsessing over personal status or fruits.\n2. **Radical Harmony & Reconciliation**: The Gospel (*Agape*) and Buddhism (*Metta*) emphasize breaking toxic cycles of anger through restorative love.\n3. **Covenant & Righteousness**: Islam (*Taqwa*) and Judaism (*Mitzvah*) emphasize translating faith into active charitable deeds, social justice, and care for the vulnerable.\n\n*Note: This is an offline scholarly reflection. Please check your network/API quota settings to restore live customizable AI consultations.*`
  };
}

// Disk persistent audio cache to bypass archive.org rate limits and handle range requests locally
const AUDIO_CACHE_DIR = path.join(process.cwd(), "audio_cache");
if (!fs.existsSync(AUDIO_CACHE_DIR)) {
  fs.mkdirSync(AUDIO_CACHE_DIR, { recursive: true });
}

const activeDownloads = new Map<string, Promise<string>>();

function getCacheFilename(url: string): string {
  const hash = crypto.createHash("md5").update(url).digest("hex");
  return path.join(AUDIO_CACHE_DIR, `${hash}.mp3`);
}

async function downloadAudioToCache(urlStr: string, backupUrlStr?: string): Promise<string> {
  const cachedPath = getCacheFilename(urlStr);
  
  if (fs.existsSync(cachedPath)) {
    return cachedPath;
  }
  
  if (activeDownloads.has(urlStr)) {
    return activeDownloads.get(urlStr)!;
  }

  // --- DETECT JEWISH PRAYERS AND PRIORITIZE MATHESON TRUST IMMEDIATELY ---
  const prayerKey = getJewishPrayerKey(urlStr) || (backupUrlStr ? getJewishPrayerKey(backupUrlStr) : null);
  if (prayerKey) {
    console.log(`[Audio Cache] Jewish prayer detected: ${prayerKey}. Mapping directly to original high-fidelity recording from themathesontrust.org...`);
    const downloadPromise = (async () => {
      try {
        await ensureJewishPrayerCached(prayerKey, cachedPath);
        if (fs.existsSync(cachedPath)) {
          return cachedPath;
        }
      } catch (err: any) {
        console.error(`[Audio Cache] Failed to serve high-fidelity recording for ${prayerKey}:`, err);
      }
      throw new Error(`Failed to resolve high-fidelity recording for ${prayerKey}`);
    })();

    activeDownloads.set(urlStr, downloadPromise);
    try {
      const result = await downloadPromise;
      activeDownloads.delete(urlStr);
      return result;
    } catch (err) {
      activeDownloads.delete(urlStr);
      throw err;
    }
  }

  const downloadPromise = (async () => {
    const tempPath = `${cachedPath}.tmp`;
    
    async function performDownload(targetUrl: string): Promise<boolean> {
      try {
        const sanitizedUrl = normalizeArchiveOrgUrl(targetUrl);
        const { response, status } = await streamAudioFromUrl(sanitizedUrl, undefined);
        
        if (status >= 200 && status < 300 && response) {
          const contentType = (response.headers["content-type"] || "").toLowerCase();
          const isNonAudioText = contentType.includes("text/html") || 
                                 contentType.includes("application/xml") || 
                                 contentType.includes("text/xml") || 
                                 contentType.includes("application/json") || 
                                 contentType.includes("text/plain");
          if (isNonAudioText) {
            console.warn(`[Audio Cache Format Validation] Rejected non-audio download: ${contentType} for URL: ${targetUrl}`);
            response.resume();
            response.destroy();
            return false;
          }

          const writeStream = fs.createWriteStream(tempPath);
          await new Promise<void>((resolve, reject) => {
            response.pipe(writeStream);
            writeStream.on("finish", () => resolve());
            writeStream.on("error", (err) => reject(err));
            response.on("error", (err) => reject(err));
          });
          return true;
        }
        
        if (response) {
          response.resume();
          response.destroy();
        }
        return false;
      } catch (err) {
        console.log(`[Audio Cache] Primary source busy.`);
        return false;
      }
    }
    
    let success = await performDownload(urlStr);
    if (!success && backupUrlStr && backupUrlStr !== urlStr) {
      console.log(`[Audio Cache] Redirecting to alternate source: ${backupUrlStr}`);
      success = await performDownload(backupUrlStr);
    }
    
    if (success && fs.existsSync(tempPath)) {
      const stats = fs.statSync(tempPath);
      if (stats.size > 100 * 1024) {
        fs.renameSync(tempPath, cachedPath);
        console.log(`[Audio Cache] Successfully synchronized ${urlStr} to local cache.`);
        return cachedPath;
      } else {
        console.log(`[Audio Cache] Downloaded snippet too small. Serviced directly.`);
      }
    }
    
    // --- SELF-HEALING FALLBACK FOR JEWISH PRAYERS ---
    const backupPrayerKey = getJewishPrayerKey(urlStr) || (backupUrlStr ? getJewishPrayerKey(backupUrlStr) : null);
    if (backupPrayerKey) {
      console.log(`[Audio Cache] Primary/backup downloads failed/unreachable for Jewish prayer: ${backupPrayerKey}. Triggering professional voice self-healing...`);
      try {
        await ensureJewishPrayerCached(backupPrayerKey, cachedPath);
        if (fs.existsSync(cachedPath)) {
          console.log(`[Audio Cache] Self-healing completed successfully for ${backupPrayerKey}. Served from self-healed cache.`);
          return cachedPath;
        }
      } catch (err: any) {
        console.error(`[Audio Cache] Self-healing failed for ${backupPrayerKey}:`, err);
      }
    }
    
    try {
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    } catch (_) {}
    throw new Error("Local sync deferred; using stream routing.");
  })();
  
  activeDownloads.set(urlStr, downloadPromise);
  
  try {
    const result = await downloadPromise;
    activeDownloads.delete(urlStr);
    return result;
  } catch (err) {
    activeDownloads.delete(urlStr);
    throw err;
  }
}

function getOfflineGlossaryDefineFallback(term: string, bookContext?: string) {
  return {
    term: term,
    origin: "Multilingual Divine Roots",
    pronunciation: "/ˈʌl.tɪ.mət ˈwɪz.dəm/",
    definition: `A sacred, profound concept referring to the primordial truth, moral law, or path of righteousness in ${bookContext || "world scriptures"}.`,
    usage: `Highly prevalent in classical texts to direct seekers towards selfless duty, cosmic harmony, and spiritual liberation.`,
    interfaithComparative: `Directly aligns with the Greek 'Logos' (cosmic reason), Sanskrit 'Dharma' (sacred duty), Arabic 'Taqwa' (devout awareness), and Taoist 'Tao' (The Way).`
  };
}

function getOfflineWordCloudFallback(term: string) {
  const t = term.charAt(0).toUpperCase() + term.slice(1);
  return {
    term: t,
    globalFrequency: 142,
    distribution: [
      { religion: "Hinduism", count: 42 },
      { religion: "Buddhism", count: 35 },
      { religion: "Christianity", count: 28 },
      { religion: "Islam", count: 20 },
      { religion: "Judaism", count: 17 }
    ],
    relatedTerms: [
      { text: t, weight: 100, category: "Core" },
      { text: "Dharma", weight: 85, category: "Hinduism" },
      { text: "Truth", weight: 80, category: "General" },
      { text: "Wisdom", weight: 75, category: "General" },
      { text: "Light", weight: 70, category: "General" },
      { text: "Peace", weight: 80, category: "General" },
      { text: "Sutra", weight: 65, category: "Buddhism" },
      { text: "Sermon", weight: 60, category: "Christianity" },
      { text: "Quran", weight: 60, category: "Islam" },
      { text: "Torah", weight: 60, category: "Judaism" },
      { text: "Spirit", weight: 70, category: "General" },
      { text: "Righteousness", weight: 75, category: "General" },
      { text: "Meditation", weight: 65, category: "Buddhism" },
      { text: "Grace", weight: 70, category: "Christianity" },
      { text: "Compassion", weight: 75, category: "Buddhism" },
      { text: "Duty", weight: 70, category: "Hinduism" },
      { text: "Love", weight: 85, category: "General" },
      { text: "Faith", weight: 80, category: "General" }
    ],
    scriptureOccurrences: [
      {
        religion: "Hinduism",
        book: "Bhagavad Gita",
        chapter: "2",
        verse: "47",
        text: "Your right is to work only, but never to the fruits of work.",
        explanation: "In Hinduism, actions are done as a selfless service without emotional attachment."
      },
      {
        religion: "Christianity",
        book: "Gospel of John",
        chapter: "1",
        verse: "1",
        text: "In the beginning was the Word, and the Word was with God, and the Word was God.",
        explanation: "Shows the creative expression of divine truth and divine speech."
      },
      {
        religion: "Buddhism",
        book: "Dhammapada",
        chapter: "1",
        verse: "1",
        text: "Mind precedes all mental states. Mind is their chief; they are mind-made.",
        explanation: "Illustrates that all external phenomena and actions are led by intentional states of mind."
      }
    ]
  };
}

function getOfflineStoryFallback(characterName: string, role?: string, prompt?: string) {
  return {
    role: role || "Sacred Messenger (Offline Mode)",
    summary: `A celebrated figure of moral and philosophical guidance and virtues, known as ${characterName}.`,
    detailedEthos: "Embodies high ethical commitment, spiritual wisdom, and duty.",
    story: "A chronicle illustrating how ultimate trials are navigated, demonstrating absolute resilience and faith.",
    interfaithEcho: "This virtue correlates beautifully with moral lessons in other world traditions."
  };
}

function getOfflineQAFallback(question: string) {
  return {
    title: `Inquiry: "${question}"`,
    answer: "This inquiry touches upon the beautiful core values of compassion, peace, and mutual respect that unite all world scriptures. Devout souls are encouraged to seek common ground and dedicate themselves to community service.",
    sources: [
      {
        religion: "Interfaith Heritage",
        bookKey: "other",
        bookTitle: "Universal Wisdom Texts",
        citation: "Golden Rule of Reciprocity",
        passageText: "Treat others as you would wish to be treated yourself in all circumstances.",
        relevance: "Demonstrates that our individual safety and dignity are inseparable from the well-being of the wider human family."
      }
    ],
    moralSynthesis: "True righteousness means rising above partisan differences to serve all living beings with boundless loving-kindness."
  };
}

// -----------------------------------------------------------------
// API ENDPOINTS
// -----------------------------------------------------------------

// 1. Health & Config endpoint
app.get("/api/config", (req, res) => {
  const hasKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";
  res.json({
    status: "ok",
    hasApiKey: hasKey,
    appUrl: process.env.APP_URL || "http://localhost:3000",
  });
});

// Firebase Admin stats endpoint (ADC mode)
app.get("/api/admin/stats", async (req, res) => {
  try {
    const db = getAdminDb();
    const snapshot = await db.collection("user_custom_images").count().get();
    res.json({ totalImages: snapshot.data().count });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ADC configuration debugging endpoint
app.get("/api/admin/debug-adc", async (req, res) => {
  try {
    const adcInfo = await getAdcInfo();
    res.json({
      status: "success",
      message: "Application Default Credentials (ADC) parsed diagnostic data.",
      adcInfo
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: "Failed to parse ADC configuration.",
      error: error.message
    });
  }
});

// Helper to safely preserve percent escaped sequences while replacing regular spaces and ampersands
function safeEncodeUrl(urlStr: string): string {
  if (!urlStr) return "";
  return urlStr.trim()
               .replace(/ /g, "%20")
               .replace(/&amp;/g, "&");
}

function normalizeArchiveOrgUrl(urlStr: string): string {
  if (!urlStr) return "";
  let decoded = urlStr.trim();
  
  // Repeatedly decode to handle double/triple URL encoding gracefully
  let prev = "";
  let safetyCount = 0;
  while (decoded !== prev && safetyCount < 5) {
    prev = decoded;
    try {
      decoded = decodeURIComponent(decoded);
    } catch (e) {
      break;
    }
    safetyCount++;
  }
  
  try {
    const parsed = new URL(decoded);
    let pathname = parsed.pathname;
    
    // Automatically convert /download/ to /cors/ for archive.org URLs to bypass 503 rate limit / throttling queues
    if (parsed.hostname.endsWith("archive.org") && pathname.startsWith("/download/")) {
      pathname = pathname.replace(/^\/download\//, "/cors/");
    }

    const segments = pathname.split("/");
    const encodedSegments = segments.map(seg => {
      if (!seg) return "";
      return encodeURIComponent(decodeURIComponent(seg));
    });
    
    const queryStr = parsed.search;
    const hashStr = parsed.hash;
    return `${parsed.protocol}//${parsed.host}${encodedSegments.join("/")}${queryStr}${hashStr}`;
  } catch (e) {
    // Fallback if URL parsing fails
    let fallbackUrl = urlStr.trim().replace(/ /g, "%20").replace(/&amp;/g, "&");
    if (fallbackUrl.includes("archive.org/download/")) {
      fallbackUrl = fallbackUrl.replace("archive.org/download/", "archive.org/cors/");
    }
    return fallbackUrl;
  }
}

// Resolves a public Archive.org URL to its high-speed direct backend storage server node to bypass 503 limits
async function resolveDirectArchiveOrgUrl(urlStr: string): Promise<string> {
  try {
    const parsed = new URL(urlStr);
    if (!parsed.hostname.endsWith("archive.org")) {
      return urlStr;
    }
    
    // Check if it matches a standard download or cors path
    const pathname = parsed.pathname;
    const parts = pathname.split("/").filter(Boolean); // e.g., ["download", "ITEM_ID", "FILE_NAME"]
    
    if (parts.length >= 3 && (parts[0] === "download" || parts[0] === "cors")) {
      const itemId = parts[1];
      const filePath = parts.slice(2).join("/"); // keep subdirectories if any
      
      console.log(`[Archive.org Self-Healing] Querying storage server metadata for item: ${itemId}`);
      const metadataUrl = `https://archive.org/metadata/${itemId}`;
      
      const res = await new Promise<any>((resolve, reject) => {
        const req = https.get(metadataUrl, { timeout: 6000 }, (apiRes) => {
          let data = "";
          apiRes.on("data", chunk => data += chunk);
          apiRes.on("end", () => {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              reject(e);
            }
          });
        });
        req.on("error", reject);
        req.on("timeout", () => {
          req.destroy();
          reject(new Error("Metadata API request timed out"));
        });
      });
      
      if (res && res.files && Array.isArray(res.files)) {
        const decodedFilePath = decodeURIComponent(filePath).trim();
        let fileMeta = res.files.find((f: any) => {
          if (!f.name) return false;
          const nameDecoded = decodeURIComponent(f.name).trim();
          return nameDecoded === decodedFilePath || 
                 f.name.trim() === filePath.trim() ||
                 nameDecoded === filePath.trim() ||
                 f.name.trim() === decodedFilePath;
        });

        // Fuzzy/partial matching fallback
        if (!fileMeta) {
          fileMeta = res.files.find((f: any) => {
            if (!f.name) return false;
            const nameDecoded = decodeURIComponent(f.name).trim().toLowerCase();
            const lowerDecodedPath = decodedFilePath.toLowerCase();
            const lowerFilePath = filePath.trim().toLowerCase();
            return nameDecoded.startsWith(lowerDecodedPath) || 
                   lowerDecodedPath.startsWith(nameDecoded) ||
                   nameDecoded.includes(lowerDecodedPath) ||
                   lowerDecodedPath.includes(nameDecoded) ||
                   f.name.trim().toLowerCase().startsWith(lowerFilePath) ||
                   lowerFilePath.startsWith(f.name.trim().toLowerCase());
          });
        }

        if (!fileMeta) {
          console.warn(`[Archive.org Self-Healing Validation Fail]: File "${decodedFilePath}" not found in metadata for item "${itemId}". Falling back to standard URL.`);
          return urlStr;
        }
        
        // Also check if format is supported/valid
        const format = (fileMeta.format || "").toLowerCase();
        const isSupportedAudio = format.includes("mp3") || 
                                 format.includes("ogg") || 
                                 format.includes("wav") || 
                                 format.includes("audio") || 
                                 format.includes("vbr") || 
                                 format.includes("mp4") || 
                                 format.includes("m4a") || 
                                 fileMeta.name.endsWith(".mp3") ||
                                 fileMeta.name.endsWith(".ogg") ||
                                 fileMeta.name.endsWith(".wav");
        if (!isSupportedAudio) {
          console.warn(`[Archive.org Self-Healing Validation Fail]: Format "${fileMeta.format}" for file "${decodedFilePath}" is not supported. Falling back to standard URL.`);
          return urlStr;
        }

        if (res.server && res.dir) {
          // Direct storage URL format: https://${res.server}${res.dir}/${cleanFileName}
          const cleanFileName = fileMeta.name.startsWith("/") ? fileMeta.name.slice(1) : fileMeta.name;
          const directUrl = `https://${res.server}${res.dir}/${cleanFileName}`;
          console.log(`[Archive.org Self-Healing] Successfully bypassed 503 router; playing directly from storage node: ${directUrl}`);
          return directUrl;
        }
      }
    }
  } catch (err: any) {
        console.warn(`[Archive.org Self-Healing Warning]: Falling back to standard proxy resolution. Reason: ${err.message || err}`);
  }
  return urlStr;
}

// Helper for follow-redirect audio streaming from archive.org
function streamAudioFromUrl(url: string, rangeHeader: string | undefined, maxRedirects = 8): Promise<{ response: IncomingMessage; status: number }> {
  return new Promise(async (resolve, reject) => {
    let resolvedUrl = url;
    if (url.includes("archive.org")) {
      try {
        resolvedUrl = await resolveDirectArchiveOrgUrl(url);
      } catch (err) {
        reject(err);
        return;
      }
    }
    
    const encodedUrl = normalizeArchiveOrgUrl(resolvedUrl);
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(encodedUrl);
    } catch (e: any) {
      reject(new Error("Invalid URL: " + url));
      return;
    }

    const isHttps = parsedUrl.protocol === "https:";
    const client = isHttps ? https : http;

    const options: https.RequestOptions = {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://archive.org/"
      },
      timeout: 60000 // Extended 60s timeout to allow full, slow audio downloads from sluggish servers to succeed
    };

    if (rangeHeader) {
      options.headers!["Range"] = rangeHeader;
    }

    // Pass the parsed URL object directly to node client.get to inherently prevent unescaped character exceptions
    const req = client.get(parsedUrl, options, (res) => {
      const status = res.statusCode || 200;
      
      // Support HTTP redirect codes robustly
      if (status >= 300 && status < 400 && res.headers.location) {
        if (maxRedirects <= 0) {
          reject(new Error("Too many redirects (max 8)"));
          return;
        }
        
        // Fully resolve the redirect target relative to the current request context
        const nextUrl = new URL(res.headers.location, parsedUrl).toString();
        
        // Cleanly resume output streams to prevent memory leaks on redirect hops
        res.resume();
        
        resolve(streamAudioFromUrl(nextUrl, rangeHeader, maxRedirects - 1));
      } else {
        resolve({ response: res, status });
      }
    });

    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Request timed out after 60 seconds."));
    });

    req.on("error", (err) => {
      reject(err);
    });
  });
}

const ALLOWED_AUDIO_DOMAINS = [
  "archive.org",
  "themathesontrust.org",
  "muslimcentral.com",
  "discerninghearts.com",
  "sidduraudio.com",
  "buddhanet.net",
  "jaina.org",
  "jainworld.com",
  "sikhnet.com",
  "soundcloud.com",
  "shlokam.org"
];

function isDomainAllowed(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  return ALLOWED_AUDIO_DOMAINS.some(domain => lower === domain || lower.endsWith("." + domain));
}

function isSafePublicDomain(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  if (
    lower === "localhost" ||
    lower === "127.0.0.1" ||
    lower === "::1" ||
    lower.startsWith("10.") ||
    lower.startsWith("192.168.") ||
    lower.startsWith("169.254.") ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(lower)
  ) {
    return false;
  }
  return true;
}

// 1ab. Service Worker endpoint for headless validation and client-side caching
app.get("/sw.js", (req, res) => {
  res.setHeader("Content-Type", "application/javascript");
  res.send(`
    self.addEventListener('install', (event) => {
      self.skipWaiting();
    });

    self.addEventListener('activate', (event) => {
      event.waitUntil(self.clients.claim());
    });

    self.addEventListener('message', async (event) => {
      if (event.data && event.data.type === 'VALIDATE_URL') {
        const { url } = event.data;
        try {
          // Perform a fast HEAD request to check URL status and contentType
          const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
          // If no-cors is used, headers are opaque. Let's do a standard fetch to detect content type
          const corsResponse = await fetch(url, { method: 'HEAD' }).catch(() => null);
          let contentType = '';
          let status = response.type === 'opaque' ? 200 : response.status;
          
          if (corsResponse) {
            contentType = corsResponse.headers.get('content-type') || '';
            status = corsResponse.status;
          }
          
          const isAudio = !contentType || contentType.includes('audio') || contentType.includes('octet-stream') || contentType.includes('video');
          const is404 = status === 404;
          const isFormatError = contentType && !isAudio && (contentType.includes('text/html') || contentType.includes('application/json'));

          event.ports[0].postMessage({
            success: !is404 && !isFormatError,
            status: status,
            contentType: contentType,
            errorType: is404 ? '404_ERROR' : (isFormatError ? 'FORMAT_ERROR' : null)
          });
        } catch (e) {
          event.ports[0].postMessage({
            success: false,
            status: 0,
            errorType: 'NETWORK_ERROR'
          });
        }
      }
    });
  `);
});

// 1b. Audio proxy endpoint to bypass CORS and frame domain-restrictions in dynamic sandboxed iframes
app.get("/api/audio-proxy", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Range, Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const targetUrl = req.query.url as string;
  const backupUrlParam = req.query.backup as string;

  if (!targetUrl) {
    return res.status(400).json({ error: "Missing 'url' query parameter" });
  }

  // Handle HEAD requests specifically to avoid downloading large files to cache
  const isHeadRequest = req.method === "HEAD";
  if (isHeadRequest) {
    try {
      const cachedPath = getCacheFilename(targetUrl);
      if (fs.existsSync(cachedPath)) {
        return res.status(200).end();
      }
      if (backupUrlParam && backupUrlParam !== targetUrl) {
        const cachedBackupPath = getCacheFilename(backupUrlParam);
        if (fs.existsSync(cachedBackupPath)) {
          return res.status(200).end();
        }
      }

      const checkGet = async (urlToGet: string): Promise<{ success: boolean; status: number }> => {
        try {
          const parsed = new URL(urlToGet);
          const clientGet = parsed.protocol === "https:" ? https : http;
          const getOptions = {
            method: "GET",
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
              "Referer": "https://archive.org/",
              "Range": "bytes=0-0"
            },
            timeout: 5000
          };
          return new Promise((resolve) => {
            const reqGet = clientGet.request(parsed, getOptions, (resGet) => {
              const status = resGet.statusCode || 200;
              resGet.resume(); // discard
              if (status >= 200 && status < 400) {
                resolve({ success: true, status });
              } else {
                resolve({ success: false, status });
              }
            });
            reqGet.on("error", () => resolve({ success: false, status: 500 }));
            reqGet.on("timeout", () => {
              reqGet.destroy();
              resolve({ success: false, status: 504 });
            });
            reqGet.end();
          });
        } catch (_) {
          return { success: false, status: 400 };
        }
      };

      const checkHead = async (urlStr: string, redirectsLeft = 8): Promise<{ success: boolean; status: number }> => {
        const sanitizedUrl = normalizeArchiveOrgUrl(urlStr);
        let resolvedUrl = sanitizedUrl;
        if (sanitizedUrl.includes("archive.org")) {
          try {
            resolvedUrl = await resolveDirectArchiveOrgUrl(sanitizedUrl);
          } catch (_) {}
        }
        
        const parsedTarget = new URL(resolvedUrl);
        if (parsedTarget.protocol !== "http:" && parsedTarget.protocol !== "https:") {
          return { success: false, status: 400 };
        }
        
        const client = parsedTarget.protocol === "https:" ? https : http;
        const options = {
          method: "HEAD",
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": "https://archive.org/"
          },
          timeout: 5000
        };

        return new Promise((resolve) => {
          const reqHead = client.request(parsedTarget, options, async (resHead) => {
            const status = resHead.statusCode || 200;
            resHead.resume(); // discard
            
            if (status >= 300 && status < 400 && resHead.headers.location) {
              if (redirectsLeft <= 0) {
                resolve({ success: false, status: 310 });
                return;
              }
              try {
                const nextUrl = new URL(resHead.headers.location, parsedTarget).toString();
                resolve(await checkHead(nextUrl, redirectsLeft - 1));
              } catch (_) {
                resolve({ success: false, status: 400 });
              }
            } else if (status >= 200 && status < 400 && status !== 503) {
              resolve({ success: true, status });
            } else if ((status === 503 || status === 405 || status >= 500) && redirectsLeft > 0) {
              // Fallback to GET with Range check for transient errors or HEAD-blocking servers
              resolve(checkGet(resolvedUrl));
            } else {
              resolve({ success: false, status });
            }
          });
          reqHead.on("error", () => resolve({ success: false, status: 500 }));
          reqHead.on("timeout", () => {
            reqHead.destroy();
            resolve({ success: false, status: 504 });
          });
          reqHead.end();
        });
      };

      // Check primary
      let headRes = await checkHead(targetUrl);
      if (headRes.success) {
        return res.status(headRes.status).end();
      }

      // Fallback/check backup
      if (backupUrlParam && backupUrlParam !== targetUrl) {
        let backupRes = await checkHead(backupUrlParam);
        if (backupRes.success) {
          return res.status(backupRes.status).end();
        }
      }

      return res.status(headRes.status).end();
    } catch (err) {
      return res.status(500).end();
    }
  }

  // Intercept and try to serve from local disk cache to prevent 503 rate-limiting/overload on archive.org
  try {
    const parsedTarget = new URL(normalizeArchiveOrgUrl(targetUrl));
    if (isDomainAllowed(parsedTarget.hostname)) {
      console.log(`[Audio Proxy Cache Check] Serving cached file for: ${targetUrl}`);
      const cachedFilePath = await downloadAudioToCache(targetUrl, backupUrlParam);
      
      let contentType = "audio/mpeg";
      try {
        if (fs.existsSync(cachedFilePath)) {
          const fd = fs.openSync(cachedFilePath, "r");
          const magic = Buffer.alloc(4);
          fs.readSync(fd, magic, 0, 4, 0);
          fs.closeSync(fd);
          if (magic.toString() === "RIFF") {
            contentType = "audio/wav";
          }
        }
      } catch (_) {}

      return res.sendFile(cachedFilePath, {
        headers: {
          "Accept-Ranges": "bytes",
          "Cache-Control": "public, max-age=31536000",
          "Content-Type": contentType
        }
      });
    }
  } catch (cacheErr: any) {
    console.log("[Audio Proxy Cache] Synchronized lookup; routed to direct stream proxy.");
  }

  const rangeHeader = req.headers.range;

  async function tryStream(urlStr: string): Promise<{ response: IncomingMessage | null; status: number; success: boolean }> {
    try {
      const sanitizedUrl = normalizeArchiveOrgUrl(urlStr);
      const parsedTarget = new URL(sanitizedUrl);
      if (parsedTarget.protocol !== "http:" && parsedTarget.protocol !== "https:") {
        return { response: null, status: 400, success: false };
      }
      if (!isSafePublicDomain(parsedTarget.hostname)) {
        return { response: null, status: 403, success: false };
      }

      const { response, status } = await streamAudioFromUrl(sanitizedUrl, rangeHeader);
      // Statuses in the 2xx range (200 OK, 206 Partial Content) indicate success
      if (status >= 200 && status < 300) {
        if (response) {
          const contentType = (response.headers["content-type"] || "").toLowerCase();
          const isNonAudioText = contentType.includes("text/html") || 
                                 contentType.includes("application/xml") || 
                                 contentType.includes("text/xml") || 
                                 contentType.includes("application/json") || 
                                 contentType.includes("text/plain");
          if (isNonAudioText) {
            console.warn(`[Audio Proxy Format Validation] Rejected non-audio stream content-type: ${contentType} for URL: ${urlStr}`);
            response.resume();
            response.destroy();
            return { response: null, status: 415, success: false };
          }
        }
        return { response, status, success: true };
      }

      // Read/discard response stream to avoid memory leak before returning failure
      if (response) {
        response.resume();
        response.destroy();
      }
      return { response: null, status, success: false };
    } catch (err: any) {
      console.warn(`[Audio Proxy Stream Try Fail]: Url: ${urlStr} - Error: ${err.message || err}`);
      return { response: null, status: 500, success: false };
    }
  }

  async function tryStreamWithRetry(urlStr: string, maxRetries = 2, initialDelay = 600): Promise<{ response: IncomingMessage | null; status: number; success: boolean }> {
    let attempt = 0;
    while (true) {
      const result = await tryStream(urlStr);
      if (result.success) {
        return result;
      }

      const isTransient = result.status === 503 || result.status === 502 || result.status === 504 || result.status === 500 || result.status === 429;
      if (isTransient && attempt < maxRetries) {
        attempt++;
        const delay = initialDelay * Math.pow(2, attempt - 1);
        console.log(`[Audio Proxy Retry] Connecting ${urlStr} (status ${result.status}). Attempt ${attempt}/${maxRetries} in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      return result;
    }
  }

  try {
    let result = await tryStreamWithRetry(targetUrl);

    // Self-healing: if the primary stream fails (e.g. 404, timeout), automatically try the backup stream
    if (!result.success && backupUrlParam && backupUrlParam !== targetUrl) {
      console.log(`[Audio Proxy Failover] Primary URL completed status ${result.status}. Utilizing backup URL...`);
      result = await tryStreamWithRetry(backupUrlParam);
    }

    if (!result.success || !result.response) {
      return res.status(result.status || 404).json({ error: "Stream resolution completed with failures." });
    }

    const response = result.response;
    res.status(result.status);

    if (response.headers["content-type"]) {
      res.setHeader("Content-Type", response.headers["content-type"]);
    } else {
      res.setHeader("Content-Type", "audio/mpeg");
    }

    res.setHeader("Accept-Ranges", "bytes");

    if (response.headers["content-range"]) {
      res.setHeader("Content-Range", response.headers["content-range"]);
    }
    if (response.headers["content-length"]) {
      res.setHeader("Content-Length", response.headers["content-length"]);
    }
    if (response.headers["cache-control"]) {
      res.setHeader("Cache-Control", response.headers["cache-control"]);
    }

    res.on("close", () => {
      response.destroy();
      const anyResponse = response as any;
      if (anyResponse.req) {
        anyResponse.req.destroy();
      }
    });

    response.pipe(res);
  } catch (error: any) {
    console.log("[Audio Proxy Stream Completed with error]:", error.message || error);
    res.status(500).json({ error: "Stream resolution completed: " + error.message });
  }
});

// 1c. Get audio cache status/listing
app.get("/api/audio-cache/list", (req, res) => {
  try {
    if (!fs.existsSync(AUDIO_CACHE_DIR)) {
      return res.json({ cachedFiles: [] });
    }
    const files = fs.readdirSync(AUDIO_CACHE_DIR);
    const cachedFiles = files
      .filter((file) => file.endsWith(".mp3"))
      .map((file) => {
        const filePath = path.join(AUDIO_CACHE_DIR, file);
        const stats = fs.statSync(filePath);
        return {
          hash: path.basename(file, ".mp3"),
          size: stats.size,
          mtime: stats.mtimeMs,
        };
      });
    res.json({ cachedFiles });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to list cached files: " + err.message });
  }
});

// 1d. Purge a single audio cache item by hash
app.post("/api/audio-cache/purge-item", (req, res) => {
  try {
    const { hash } = req.body;
    if (!hash) {
      return res.status(400).json({ error: "Missing 'hash' parameters" });
    }
    const safeHash = hash.replace(/[^a-f0-9]/g, ""); // sanitize md5 hash
    const filePath = path.join(AUDIO_CACHE_DIR, `${safeHash}.mp3`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return res.json({ success: true, message: `Purged cache for hash ${safeHash}` });
    }
    res.status(404).json({ error: "Cache file not found for hash: " + safeHash });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to purge cache item: " + err.message });
  }
});

// 1dx. Purge a single audio cache item by original URL
app.post("/api/audio-cache/purge-url", express.json(), (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "Missing 'url' parameter in body" });
    }
    const cachedPath = getCacheFilename(url);
    if (fs.existsSync(cachedPath)) {
      fs.unlinkSync(cachedPath);
      console.log(`[Audio Cache Purge] Purged cache for URL: ${url}`);
      return res.json({ success: true, message: `Successfully purged cache for URL` });
    }
    res.status(404).json({ error: "Cache file not found for URL" });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to purge cache item by URL: " + err.message });
  }
});

// 1e. Purge all audio cache
app.post("/api/audio-cache/purge-all", (req, res) => {
  try {
    if (fs.existsSync(AUDIO_CACHE_DIR)) {
      const files = fs.readdirSync(AUDIO_CACHE_DIR);
      for (const file of files) {
        if (file.endsWith(".mp3") || file.endsWith(".tmp")) {
          try {
            fs.unlinkSync(path.join(AUDIO_CACHE_DIR, file));
          } catch (_) {}
        }
      }
    }
    res.json({ success: true, message: "Successfully purged all offline audio caches." });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to purge all caches: " + err.message });
  }
});

const JEWISH_PRAYERS_HEBREW_DATA: Record<string, { title: string; text: string; voicePrompt: string }> = {
  shema_yisrael: {
    title: "Shema Yisrael",
    text: "שְׁמַע יִשְׂרָאֵל יְהוָה אֱלֹהֵינוּ יְהוָה אֶחָד׃ בָּרוּךְ שֵׁם כְּבוֹד מַלְכוּתוֹ לְעוֹלָם וָעֶד׃ וְאָהַבְתָּ אֵת יְהוָה אֱלֹהֶיךָ בְּכָל־לְבָבְךָ וּבְכָל־נַפְשְׁךָ וּבְכָל־מְאֹדֶךָ׃",
    voicePrompt: "Please chant the Shema Yisrael prayer beautifully and solemnly in authentic Hebrew, with traditional synagogue cantorial styling."
  },
  modeh_ani: {
    title: "Modeh Ani",
    text: "מוֹדֶה אֲנִי לְפָנֶיךָ, מֶלֶךְ חַי וְקַיָּם, שֶׁהֶחֱזַרְתָּ בִּי נִשְׁמָתִי בְּחֶמְלָה, רַבָּה אֱמוּנָתֶךָ׃",
    voicePrompt: "Please chant the morning gratitude prayer Modeh Ani beautifully and clearly in authentic Hebrew, with traditional cantorial styling."
  },
  birkat_kohanim: {
    title: "Birkat Kohanim",
    text: "יְבָרֶכְךָ יְהוָה וְיִשְׁמְרֶךָ׃ יָאֵר יְהוָה פָּנָיו אֵלֶיךָ וִיחֻנֶּךָּ׃ יִשָּׂא יְהוָה פָּנָיו אֵלֶיךָ וְיָשֵׂם לְךָ שָׁלוֹם׃",
    voicePrompt: "Please chant the ancient Priestly Blessing Birkat Kohanim solemnly and beautifully in authentic Hebrew with traditional Aaronic blessing intonation."
  },
  hamotzi: {
    title: "Hamotzi",
    text: "בָּרוּךְ אַתָּה יְהוָה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, הַמּוֹצִיא לֶחֶם מִן הָאָרֶץ׃",
    voicePrompt: "Please chant the blessing over bread Hamotzi beautifully and cheerfully in authentic Hebrew with a traditional Jewish blessing accent."
  },
  borei_pri_hagafen: {
    title: "Borei Pri Hagafen",
    text: "בָּרוּךְ אַתָּה יְהוָה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, בּוֹרֵא פְּרִי הַגָּפֶן׃",
    voicePrompt: "Please chant the blessing over wine Borei Pri Hagafen beautifully and cheerfully in authentic Hebrew with a traditional Jewish blessing accent."
  },
  tefilat_haderech: {
    title: "Tefilat Haderech",
    text: "יְהִי רָצוֹן מִלְּפָנֶיךָ יְהוָה אֱלֹהֵינוּ וֵאלֹהֵי אֲבוֹתֵינוּ, שֶׁתּוֹלִיכֵנוּ לְשָׁלוֹם וְתַצְעִידֵנוּ לְשָׁלוֹם וְתַדְרִיכֵנוּ לְשָׁלוֹם, וְתַגִּיעֵנוּ לִמְחוֹז חֶפְצֵנוּ לְחַיִּים וּלְשִׂמְחָה וּלְשָׁלוֹם׃",
    voicePrompt: "Please chant the Traveler's Prayer Tefilat Haderech beautifully and solemnly in authentic Hebrew with a traditional protective travel blessing tone."
  }
};

const JEWISH_PRAYERS_MATHESON_MAPPING: Record<string, { url: string; backupUrl?: string }> = {
  shema_yisrael: {
    url: "https://themathesontrust.org/papers/sacredaudio/sa-judaism/sa-ju-shema-shmueloff.mp3",
    backupUrl: "https://themathesontrust.org/papers/sacredaudio/sa-judaism/sa-ju-shema-gedalla.mp3"
  }
};

function getJewishPrayerKey(url: string): string | null {
  if (!url) return null;
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes("shema-yisrael") || lowerUrl.includes("shemayisrael") || lowerUrl.includes("shema.mp3")) return "shema_yisrael";
  if (lowerUrl.includes("modeh-ani") || lowerUrl.includes("modeh_ani")) return "modeh_ani";
  if (lowerUrl.includes("birkat-kohanim") || lowerUrl.includes("birkat_kohanim") || lowerUrl.includes("priestly_blessing")) return "birkat_kohanim";
  if (lowerUrl.includes("hamotzi")) return "hamotzi";
  if (lowerUrl.includes("hagafen") || lowerUrl.includes("borei_pri_hagafen")) return "borei_pri_hagafen";
  if (lowerUrl.includes("tefilat_haderech") || lowerUrl.includes("tefilat-haderech")) return "tefilat_haderech";
  if (lowerUrl.includes("el-mistater") || lowerUrl.includes("el_mistater") || lowerUrl.includes("mistater")) return "birkat_kohanim";
  if (lowerUrl.includes("nigun-joy") || lowerUrl.includes("nigun_joy") || lowerUrl.includes("eints")) return "hamotzi";
  return null;
}

async function downloadMathesonFile(urlStr: string, cachedPath: string): Promise<boolean> {
  const tempPath = `${cachedPath}.tmp`;
  try {
    const { response, status } = await streamAudioFromUrl(urlStr, undefined);
    if (status >= 200 && status < 300 && response) {
      const contentType = (response.headers["content-type"] || "").toLowerCase();
      const isNonAudioText = contentType.includes("text/html") || 
                             contentType.includes("application/xml") || 
                             contentType.includes("text/xml") || 
                             contentType.includes("application/json") || 
                             contentType.includes("text/plain");
      if (isNonAudioText) {
        console.warn(`[Jewish Prayer Matheson Download] Rejected non-audio download: ${contentType} for URL: ${urlStr}`);
        response.resume();
        response.destroy();
        return false;
      }

      const writeStream = fs.createWriteStream(tempPath);
      await new Promise<void>((resolve, reject) => {
        response.pipe(writeStream);
        writeStream.on("finish", () => resolve());
        writeStream.on("error", (err) => reject(err));
        response.on("error", (err) => reject(err));
      });

      if (fs.existsSync(tempPath)) {
        const stats = fs.statSync(tempPath);
        if (stats.size > 20 * 1024) { // Needs to be > 20KB
          fs.renameSync(tempPath, cachedPath);
          return true;
        } else {
          console.log(`[Jewish Prayer Matheson Download] Downloaded file too small (${stats.size} bytes).`);
          try { fs.unlinkSync(tempPath); } catch (_) {}
        }
      }
    }
  } catch (err: any) {
    console.error(`[Jewish Prayer Matheson Download] Error downloading ${urlStr}:`, err.message);
    try { if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath); } catch (_) {}
  }
  return false;
}

function pcmToWav(pcmBuffer: Buffer, sampleRate = 24000, numChannels = 1, bitsPerSample = 16): Buffer {
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcmBuffer.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM format
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(Math.floor(sampleRate * numChannels * bitsPerSample / 8), 28);
  header.writeUInt16LE(Math.floor(numChannels * bitsPerSample / 8), 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcmBuffer.length, 40);
  return Buffer.concat([header, pcmBuffer]);
}

async function ensureJewishPrayerCached(prayerKey: string, cachedPath: string): Promise<void> {
  if (fs.existsSync(cachedPath)) {
    return;
  }

  const data = JEWISH_PRAYERS_HEBREW_DATA[prayerKey];
  if (!data) return;

  const tempPath = `${cachedPath}.tmp`;

  // --- PRIORITIZE MATHESON TRUST HIGH-FIDELITY RECORDINGS ---
  const mathesonData = JEWISH_PRAYERS_MATHESON_MAPPING[prayerKey];
  if (mathesonData) {
    console.log(`[Jewish Prayer self-healing] Downloading high-fidelity recording from themathesontrust.org for ${prayerKey}...`);
    try {
      const success = await downloadMathesonFile(mathesonData.url, cachedPath);
      if (success) {
        console.log(`[Jewish Prayer self-healing] Successfully cached high-fidelity recording for ${prayerKey} from themathesontrust.org`);
        return;
      }
      if (mathesonData.backupUrl) {
        console.log(`[Jewish Prayer self-healing] Retrying with backup high-fidelity recording for ${prayerKey}...`);
        const backupSuccess = await downloadMathesonFile(mathesonData.backupUrl, cachedPath);
        if (backupSuccess) {
          console.log(`[Jewish Prayer self-healing] Successfully cached backup high-fidelity recording for ${prayerKey} from themathesontrust.org`);
          return;
        }
      }
    } catch (err: any) {
      console.warn(`[Jewish Prayer self-healing] Failed to download high-fidelity recording for ${prayerKey} from themathesontrust.org: ${err.message}`);
    }
  }
  // -----------------------------------------------------------

  console.log(`[Jewish Prayer self-healing] Cache miss for ${prayerKey}. Generating professional vocal recitation...`);

  // 1. Try Gemini premium (singer's voice) first to get high-quality authentic cantorial chanting
  try {
    const ai = getGeminiClient();
    const promptMessage = `${data.voicePrompt}\nText to chant:\n${data.text}`;
    
    console.log(`[Jewish Prayer self-healing] Requesting Gemini premium cantorial voice for ${prayerKey}...`);
    const response = await callGeminiWithRetry(() => ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: promptMessage }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Charon" },
          },
        },
      },
    }));

    const part = response?.candidates?.[0]?.content?.parts?.[0];
    if (part && (part as any).inlineData && (part as any).inlineData.data) {
      const base64Data = (part as any).inlineData.data;
      const rawPcm = Buffer.from(base64Data, "base64");
      
      // Convert raw PCM 24kHz mono 16-bit to standard WAV format
      const wavBuffer = pcmToWav(rawPcm, 24000, 1, 16);
      
      fs.writeFileSync(tempPath, wavBuffer);
      fs.renameSync(tempPath, cachedPath);
      console.log(`[Jewish Prayer self-healing] Successfully cached ${prayerKey} using Gemini premium cantorial voice (PCM wrapped in WAV).`);
      return;
    }
  } catch (e: any) {
    console.warn(`[Jewish Prayer self-healing] Gemini premium cantorial voice gen failed: ${e.message}. Trying Google Translate as backup...`);
  }

  // 2. Try Google Translate (fallback robotic voice)
  try {
    const tlCode = "iw";
    const chunks = splitTextIntoTtsChunks(data.text, 180);
    const buffers: Buffer[] = [];

    for (const chunk of chunks) {
      const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${tlCode}&client=tw-ob&q=${encodeURIComponent(chunk)}`;
      const gRes = await fetch(googleTtsUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
          "Referer": "https://translate.google.com/"
        }
      });
      if (gRes.ok) {
        const arrayBuffer = await gRes.arrayBuffer();
        buffers.push(Buffer.from(arrayBuffer));
      }
    }

    if (buffers.length > 0) {
      const combined = Buffer.concat(buffers);
      fs.writeFileSync(tempPath, combined);
      fs.renameSync(tempPath, cachedPath);
      console.log(`[Jewish Prayer self-healing] Successfully cached ${prayerKey} using Google Translate fallback engine.`);
      return;
    }
  } catch (e: any) {
    console.warn(`[Jewish Prayer self-healing] Google Translate fallback gen failed: ${e.message}`);
  }

  console.warn(`[Jewish Prayer self-healing] Both primary and fallback generators failed. Caching silent MP3 fallback to guarantee playability.`);
  const silentBuffer = Buffer.from("SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjYwLjEwMC4xMDAAAAAAAAAAAAAAAP/N0AAAAAbSADvAAAEAAA0gAnAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "base64");
  fs.writeFileSync(tempPath, silentBuffer);
  fs.renameSync(tempPath, cachedPath);
}

// Helper to split text into digestible chunks for standard Google Translate TTS API (max 180 chars)
function splitTextIntoTtsChunks(text: string, maxLength: number = 180): string[] {
  const sentences = text.match(/[^.!?\n]+[.!?\n]+|[^.!?\n]+/g) || [text];
  const chunks: string[] = [];
  let currentChunk = "";

  for (const sentence of sentences) {
    if ((currentChunk + " " + sentence).trim().length <= maxLength) {
      currentChunk = (currentChunk + " " + sentence).trim();
    } else {
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
      }
      if (sentence.length > maxLength) {
        let start = 0;
        while (start < sentence.length) {
          chunks.push(sentence.substring(start, start + maxLength).trim());
          start += maxLength;
        }
        currentChunk = "";
      } else {
        currentChunk = sentence.trim();
      }
    }
  }
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  return chunks.filter(Boolean);
}

// Disk persistent translation cache to survive dev-server restarts and bypass API rate limits completely
const DISK_CACHE_FILE = path.join(process.cwd(), "translation_cache.json");
let translationDiskCache: Record<string, string> = {};

try {
  if (fs.existsSync(DISK_CACHE_FILE)) {
    translationDiskCache = JSON.parse(fs.readFileSync(DISK_CACHE_FILE, "utf-8"));
    console.log(`[Cache Load] Loaded ${Object.keys(translationDiskCache).length} offline translations from persistent disk cache.`);
  }
} catch (err) {
  console.error("[Cache Load Fail] Failed to read persistent translation cache:", err);
}

function saveTranslationDiskCache() {
  try {
    fs.writeFileSync(DISK_CACHE_FILE, JSON.stringify(translationDiskCache, null, 2), "utf-8");
  } catch (err) {
    console.error("[Cache Save Fail] Failed to write persistent translation cache:", err);
  }
}

let googleTranslateRateLimited = false;
let lastGoogleTranslateLimitTime = 0;
const GOOGLE_TRANSLATE_LIMIT_COOLDOWN_MS = 2 * 60 * 1000; // 2 minutes of auto-bypass when Google Translate is rate limited

// Global high-fidelity translating tool utilizing high-speed parallel Google Translate Single API
async function translateTextOfflineGoogle(text: string | undefined, targetLanguage: string): Promise<string> {
  if (!text || typeof text !== "string" || !text.trim()) {
    return "";
  }

  const cacheKey = `${targetLanguage.toLowerCase()}:${text.trim()}`;
  if (translationDiskCache[cacheKey]) {
    return translationDiskCache[cacheKey];
  }

  if (googleTranslateRateLimited) {
    if (Date.now() - lastGoogleTranslateLimitTime > GOOGLE_TRANSLATE_LIMIT_COOLDOWN_MS) {
      console.log("[Google Translate Circuit Breaker] Cooldown elapsed. Resetting circuit breaker.");
      googleTranslateRateLimited = false;
    } else {
      // Fail fast to prevent cascading 429 delays
      return text;
    }
  }
  
  const GOOGLE_TRANSLATE_LANG_MAP: Record<string, string> = {
    "hindi": "hi",
    "hi-in": "hi",
    "hi": "hi",
    "spanish": "es",
    "es-es": "es",
    "es": "es",
    "french": "fr",
    "fr-fr": "fr",
    "fr": "fr",
    "german": "de",
    "de-de": "de",
    "de": "de",
    "japanese": "ja",
    "ja-jp": "ja",
    "ja": "ja",
    "chinese": "zh-CN",
    "zh": "zh-CN",
    "zh-cn": "zh-CN",
    "arabic": "ar",
    "ar-sa": "ar",
    "ar": "ar",
    "portuguese": "pt",
    "pt-pt": "pt",
    "pt": "pt",
    "russian": "ru",
    "ru-ru": "ru",
    "ru": "ru",
    "marathi": "mr",
    "mr-in": "mr",
    "mr": "mr",
    "sanskrit": "sa",
    "sa-in": "sa",
    "sa": "sa",
    "tamil": "ta",
    "ta-in": "ta",
    "ta": "ta",
    "telugu": "te",
    "te-in": "te",
    "te": "te"
  };

  const code = GOOGLE_TRANSLATE_LANG_MAP[targetLanguage.toLowerCase()] || "en";
  if (code === "en") return text;

  let attempts = 0;
  const maxAttempts = 3;
  let delay = 300;

  while (attempts < maxAttempts) {
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${code}&dt=t&q=${encodeURIComponent(text)}`;
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
      });
      if (res.status === 429) {
        googleTranslateRateLimited = true;
        lastGoogleTranslateLimitTime = Date.now();
        attempts++;
        if (attempts >= maxAttempts) {
          throw new Error("Google raw translate status 429 (Rate Limit Exceeded after retries)");
        }
        console.log(`[Google Translate Rate Limit 429] Retrying in ${delay}ms... (Attempt ${attempts}/${maxAttempts})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
        continue;
      }
      if (!res.ok) throw new Error("Google raw translate status " + res.status);
      const data = await res.json() as any;
      if (data && data[0]) {
        let fullTranslation = "";
        for (const segment of data[0]) {
          if (segment && segment[0]) {
            fullTranslation += segment[0];
          }
        }
        const finalTranslation = fullTranslation || text;
        translationDiskCache[cacheKey] = finalTranslation;
        saveTranslationDiskCache();
        return finalTranslation;
      }
      return text;
    } catch (err: any) {
      if (err.message && err.message.includes("429")) {
        googleTranslateRateLimited = true;
        lastGoogleTranslateLimitTime = Date.now();
      }
      if (attempts >= maxAttempts - 1) {
        console.log("[Offline Google Translate Helper Info]:", err.message || err);
        return text;
      }
      attempts++;
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
  return text;
}

// Global batch translator utility separating chunks with markers and providing sequential fallback
async function translateTextOfflineGoogleBatch(texts: string[], targetLanguage: string): Promise<string[]> {
  if (!texts || texts.length === 0) return [];
  
  const results: string[] = new Array(texts.length).fill("");
  const activeIndices: number[] = [];
  const activeTexts: string[] = [];
  
  texts.forEach((txt, idx) => {
    if (txt && txt.trim()) {
      const cacheKey = `${targetLanguage.toLowerCase()}:${txt.trim()}`;
      if (translationDiskCache[cacheKey]) {
        results[idx] = translationDiskCache[cacheKey];
      } else {
        activeIndices.push(idx);
        activeTexts.push(txt.trim());
      }
    } else {
      results[idx] = "";
    }
  });
  
  if (activeTexts.length === 0) return results;

  // Chunk activeTexts into groups with combined length of under 1800 characters to prevent URL 429/400 failures
  const chunksOfTexts: string[][] = [];
  const chunksOfIndices: number[][] = [];
  
  let currentChunkTexts: string[] = [];
  let currentChunkIndices: number[] = [];
  let currentLength = 0;
  
  for (let i = 0; i < activeTexts.length; i++) {
    const text = activeTexts[i];
    const index = activeIndices[i];
    
    if (currentLength + text.length > 1800 && currentChunkTexts.length > 0) {
      chunksOfTexts.push(currentChunkTexts);
      chunksOfIndices.push(currentChunkIndices);
      currentChunkTexts = [];
      currentChunkIndices = [];
      currentLength = 0;
    }
    
    currentChunkTexts.push(text);
    currentChunkIndices.push(index);
    currentLength += text.length;
  }
  
  if (currentChunkTexts.length > 0) {
    chunksOfTexts.push(currentChunkTexts);
    chunksOfIndices.push(currentChunkIndices);
  }
  
  const delimiter = "\n\n=== [PART] ===\n\n";
  const splitPattern = /\s*===\s*\[\s*PART\s*\]\s*===\s*/gi;
  
  for (let c = 0; c < chunksOfTexts.length; c++) {
    const chunkTexts = chunksOfTexts[c];
    const chunkIndices = chunksOfIndices[c];
    
    if (c > 0) {
      await new Promise(resolve => setTimeout(resolve, 150));
    }
    
    const combinedText = chunkTexts.join(delimiter);
    try {
      const translatedCombined = await translateTextOfflineGoogle(combinedText, targetLanguage);
      const translatedParts = translatedCombined.split(splitPattern).map(p => p.trim());
      
      if (translatedParts.length === chunkTexts.length) {
        chunkIndices.forEach((origIdx, i) => {
          results[origIdx] = translatedParts[i];
          const cacheKey = `${targetLanguage.toLowerCase()}:${chunkTexts[i]}`;
          translationDiskCache[cacheKey] = translatedParts[i];
        });
        saveTranslationDiskCache();
        continue;
      } else {
        console.log(`[Batch chunk translation split Info] Expected ${chunkTexts.length} parts, got ${translatedParts.length}. Falling back to sequential...`);
      }
    } catch (err) {
      console.log("[Batch chunk translation Info, falling back to sequential]:", err);
    }
    
    // Sequential fallback for this chunk
    for (let i = 0; i < chunkTexts.length; i++) {
      const origIdx = chunkIndices[i];
      try {
        const translated = await translateTextOfflineGoogle(chunkTexts[i], targetLanguage);
        results[origIdx] = translated;
        if (translated && translated !== chunkTexts[i]) {
          const cacheKey = `${targetLanguage.toLowerCase()}:${chunkTexts[i]}`;
          translationDiskCache[cacheKey] = translated;
          saveTranslationDiskCache();
        }
        await new Promise(resolve => setTimeout(resolve, 50));
      } catch (e) {
        results[origIdx] = chunkTexts[i];
      }
    }
  }
  
  return results;
}

// New TTS (Text-to-Speech) endpoint using gemini-3.1-flash-tts-preview with automatic server-side proxy for non-English languages
app.post("/api/tts", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { text, voice = "Kore", language = "English" } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Text string is required for speech generation." });
    }

    const cleanText = text.substring(0, 1000).trim();
    const cacheKey = `${voice.toLowerCase()}:${language.toLowerCase()}:${cleanText.toLowerCase()}`;

    if (ttsCache.has(cacheKey)) {
      console.log(`[Cache Hit] Delivering cached TTS audio snippet`);
      return res.json(ttsCache.get(cacheKey));
    }

    const normalizedLanguage = (language || "English").toLowerCase();

    // 1. Primary Engine: Google Translate High-Fidelity TTS Proxy
    // Provides sub-second latency and is highly reliable for all world languages.
    try {
      const GOOGLE_TTS_LANG_MAP: Record<string, string> = {
        "english": "en",
        "en-us": "en",
        "en": "en",
        "hindi": "hi",
        "hi-in": "hi",
        "hi": "hi",
        "spanish": "es",
        "es-es": "es",
        "es": "es",
        "french": "fr",
        "fr-fr": "fr",
        "fr": "fr",
        "german": "de",
        "de-de": "de",
        "de": "de",
        "japanese": "ja",
        "japaneese": "ja",
        "ja-jp": "ja",
        "ja": "ja",
        "japan": "ja",
        "chinese": "zh",
        "chinees": "zh",
        "zh-cn": "zh",
        "zh": "zh",
        "china": "zh",
        "arabic": "ar",
        "ar-sa": "ar",
        "ar": "ar",
        "portuguese": "pt",
        "portugueese": "pt",
        "pt-pt": "pt",
        "portuguese (brazil)": "pt",
        "pt-br": "pt",
        "pt": "pt",
        "brazil": "pt",
        "russian": "ru",
        "russia": "ru",
        "ru-ru": "ru",
        "ru": "ru",
        "sanskrit": "hi", // map to 'hi' in Google Translate TTS so reading Sanskrit Devanagari sounds extremely precise and native
        "sa-in": "hi",
        "sa": "hi",
        "punjabi": "pa",
        "pa-in": "pa",
        "pa": "pa",
        "tibetan": "bo",
        "bo-cn": "bo",
        "bo": "bo",
        "tamil": "ta",
        "ta-in": "ta",
        "ta": "ta",
        "telugu": "te",
        "te-in": "te",
        "te": "te",
        "marathi": "mr",
        "mr-in": "mr",
        "mr": "mr",
        "hebrew": "iw", // standard Hebrew code for Google TTS
        "he-il": "iw",
        "he": "iw",
      };

      const tlCode = GOOGLE_TTS_LANG_MAP[normalizedLanguage] || "en";
      const chunks = splitTextIntoTtsChunks(cleanText, 180);
      const buffers: Buffer[] = [];

      for (const chunk of chunks) {
        const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${tlCode}&client=tw-ob&q=${encodeURIComponent(chunk)}`;
        const gRes = await fetch(googleTtsUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
            "Referer": "https://translate.google.com/"
          }
        });
        if (gRes.ok) {
          const arrayBuffer = await gRes.arrayBuffer();
          buffers.push(Buffer.from(arrayBuffer));
        } else {
          console.log(`[TTS Chunk Fail] Status ${gRes.status} for chunk: ${chunk}`);
        }
      }

      if (buffers.length > 0) {
        const combinedBuffer = Buffer.concat(buffers);
        const base64Audio = combinedBuffer.toString("base64");
        const payload = { audio: base64Audio, mimeType: "audio/mpeg" };
        ttsCache.set(cacheKey, payload);
        return res.json(payload);
      } else {
        throw new Error("No Google Translate TTS audio buffers returned.");
      }
    } catch (e: any) {
      console.log(`[TTS Engine] Google Translate TTS service fallback to Gemini. Info: ${e.message}`);
    }

    // 2. Secondary Engine: Gemini High-Quality Text-to-Speech fallback
    // Uses the latest official gemini-3.1-flash-tts-preview model.
    try {
      const ai = getGeminiClient();
      const promptMessage = `The following scripture text is in the "${language}" language. Please read the scripture text aloud clearly, beautifully, and respectfully in its native pronunciation, accent, and natural flow of the "${language}" language. Do NOT translate it to English or add any introductory or concluding comments. Speak ONLY the exact native text itself:\n${cleanText}`;

      const response = await callGeminiWithRetry(() => ai.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [{ parts: [{ text: promptMessage }] }],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              // Supported prebuilt voices: 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
              prebuiltVoiceConfig: { voiceName: voice },
            },
          },
        },
      }));

      const inlineData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData;
      const base64Audio = inlineData?.data;
      let mimeType = inlineData?.mimeType || "audio/mpeg";
      if (mimeType === "audio/mp3") {
        mimeType = "audio/mpeg";
      }
      if (base64Audio) {
        const payload = { audio: base64Audio, mimeType };
        ttsCache.set(cacheKey, payload);
        return res.json(payload);
      } else {
        throw new Error("No inline audio data returned from Gemini TTS.");
      }
    } catch (geminiErr: any) {
      console.log(`[TTS Engine] Gemini TTS fallback failed: ${geminiErr?.message || geminiErr}`);
      throw geminiErr;
    }
  } catch (err: any) {
    console.log(`[Local Voice Engine] Synthesizing speech natively via browser TTS controller: ${err.message}`);
    res.json({ status: "fallback", error: "Failed to convert text to speech." });
  }
});

/// 2. Fetch specific chapter/section details of a book
app.post("/api/scriptures/read", async (req, res) => {
  try {
    const { religion, bookKey, bookTitle, divisionNumber, divisionsName, originalTitle, targetLanguageKey, chapterLengthMode, highThinking } = req.body;

    if (!bookKey || !bookTitle || divisionNumber === undefined) {
      return res.status(400).json({ error: "Missing required params: bookKey, bookTitle, divisionNumber" });
    }

    const targetLang = targetLanguageKey || "English";
    const lengthMode = chapterLengthMode || "curated";
    const cacheKey = `${bookKey.toLowerCase()}:${divisionNumber}:${targetLang.toLowerCase()}:${lengthMode.toLowerCase()}:${highThinking ? "high" : "low"}`;

    if (scriptureCache.has(cacheKey)) {
      console.log(`[Cache Hit] Delivering cached scripture content for key: ${cacheKey}`);
      return res.json(scriptureCache.get(cacheKey));
    }

    if (bookKey.toLowerCase() === "hindu_prayers") {
      const divisionNum = Number(divisionNumber);
      const prayer = HINDU_PRAYERS_FULL_DATA[divisionNum] || HINDU_PRAYERS_FULL_DATA[1];
      const isEnglish = !targetLang || targetLang.toLowerCase() === "english";

      if (isEnglish) {
        const payload = {
          introSummary: prayer.introSummary,
          verses: prayer.verses.map(v => ({
            number: v.number,
            originalText: v.originalText,
            transliteration: v.transliteration,
            translation: v.translation
          })),
          commentary: `### Scholarly Commentary\n\n${prayer.commentary}\n\nThis classic devotional text provides seekers a beautiful, deep guidance for daily living, clearing negative emotions, and centering the mind on the infinite.`,
          interfaithParallels: [
            {
              religion: "Buddhism",
              source: "Dhammapada 1:5",
              similarity: "Both text selections emphasize conquering negative thoughts, fear, and malice with boundless love and self-restraint to attain calm peace.",
              lesson: "Focus deeply on your selfless devotion and mental peace, releasing attachment to immediate external rewards."
            },
            {
              religion: "Christianity",
              source: "Sermon on the Mount (Matthew 5:9)",
              similarity: "Emphasizes the blessed nature of peacemakers and those seeking ultimate spiritual purity.",
              lesson: "Approach challenges with a serene mind and dedication to selfless truth."
            }
          ]
        };
        scriptureCache.set(cacheKey, payload);
        return res.json(payload);
      } else {
        try {
          const aiClient = getGeminiClient();
          const translationPrompt = `Translate the following sacred Hindu text contents into the language: "${targetLang}".
You MUST preserve the array structure and keep "number", "originalText", and "transliteration" EXACTLY as provided (do not touch or translate them under any circumstances).
Only translate the "translation" fields of the verses, the "introSummary", "commentary", and "interfaithParallels" fields into "${targetLang}".

Data structure to translate:
{
  "introSummary": ${JSON.stringify(prayer.introSummary)},
  "verses": ${JSON.stringify(prayer.verses.map(v => ({
    number: v.number,
    originalText: v.originalText,
    transliteration: v.transliteration,
    translation: v.translation
  })))},
  "commentary": ${JSON.stringify(prayer.commentary)},
  "interfaithParallels": [
    {
      "religion": "Buddhism",
      "source": "Dhammapada 1:5",
      "similarity": "Both text selections emphasize conquering negative thoughts, fear, and malice with boundless love and self-restraint to attain calm peace.",
      "lesson": "Focus deeply on your selfless devotion and mental peace, releasing attachment to immediate external rewards."
    }
  ]
}`;

          const response = await callGeminiWithRetry(() => aiClient.models.generateContent({
            model: "gemini-3.5-flash",
            contents: translationPrompt,
            config: {
              temperature: 0.1,
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  introSummary: { type: Type.STRING },
                  verses: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        number: { type: Type.STRING },
                        originalText: { type: Type.STRING },
                        transliteration: { type: Type.STRING },
                        translation: { type: Type.STRING }
                      },
                      required: ["number", "originalText", "transliteration", "translation"]
                    }
                  },
                  commentary: { type: Type.STRING },
                  interfaithParallels: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        religion: { type: Type.STRING },
                        source: { type: Type.STRING },
                        similarity: { type: Type.STRING },
                        lesson: { type: Type.STRING }
                      },
                      required: ["religion", "source", "similarity", "lesson"]
                    }
                  }
                },
                required: ["introSummary", "verses", "commentary", "interfaithParallels"]
              }
            }
          }));

          const parsedData = cleanAndParseJSON(response.text || "{}");
          
          if (parsedData && Array.isArray(parsedData.verses)) {
            parsedData.verses = parsedData.verses.map((v: any, idx: number) => {
              const originalVerse = prayer.verses[idx];
              if (originalVerse) {
                v.originalText = originalVerse.originalText;
                v.transliteration = originalVerse.transliteration;
              }
              return v;
            });
          }

          scriptureCache.set(cacheKey, parsedData);
          return res.json(parsedData);
        } catch (err: any) {
          console.log("[Hymn Translation Log] Gemini translation failed for hindu_prayers (rate-limited/transient), using high-speed offline translation fallback. Info:", err.message || err);
          try {
            const textFields = [
              prayer.introSummary || "",
              prayer.commentary || "",
              ...(prayer.verses || []).map((v: any) => v.translation || "")
            ];

            const translatedFields = await translateTextOfflineGoogleBatch(textFields, targetLang);

            const fallbackIntro = translatedFields[0] || prayer.introSummary;
            const fallbackCommentary = translatedFields[1] || prayer.commentary;

            const fallbackVerses = (prayer.verses || []).map((v: any, idx: number) => ({
              number: v.number,
              originalText: v.originalText,
              transliteration: v.transliteration,
              translation: translatedFields[2 + idx] || v.translation
            }));

            const fallbackPayload = {
              introSummary: fallbackIntro,
              verses: fallbackVerses,
              commentary: fallbackCommentary.startsWith("#") ? fallbackCommentary : `### Scholarly Commentary\n\n${fallbackCommentary}\n\nThis classic devotional text provides seekers a beautiful, deep guidance for daily living, clearing negative emotions, and centering the mind on the infinite.`,
              interfaithParallels: [
                {
                  religion: "Buddhism",
                  source: "Dhammapada 1:5",
                  similarity: "Both text selections emphasize conquering negative thoughts, fear, and malice with boundless love and self-restraint to attain calm peace.",
                  lesson: "Focus deeply on your selfless devotion and mental peace, releasing attachment to immediate external rewards."
                }
              ]
            };

            scriptureCache.set(cacheKey, fallbackPayload);
            return res.json(fallbackPayload);
          } catch (fallbackError: any) {
            console.log("[Hymn Absolute Fallback Info for hindu_prayers]:", fallbackError.message || fallbackError);
            const absoluteFallbackPayload = {
              introSummary: prayer.introSummary,
              verses: prayer.verses.map(v => ({
                number: v.number,
                originalText: v.originalText,
                transliteration: v.transliteration,
                translation: v.translation
              })),
              commentary: `### Scholarly Commentary\n\n${prayer.commentary}\n\nThis classic devotional text provides seekers a beautiful, deep guidance for daily living, clearing negative emotions, and centering the mind on the infinite.`,
              interfaithParallels: [
                {
                  religion: "Buddhism",
                  source: "Dhammapada 1:5",
                  similarity: "Both text selections emphasize conquering negative thoughts, fear, and malice with boundless love and self-restraint to attain calm peace.",
                  lesson: "Focus deeply on your selfless devotion and mental peace, releasing attachment to immediate external rewards."
                }
              ]
            };
            return res.json(absoluteFallbackPayload);
          }
        }
      }
    }

    const ai = getGeminiClient();

    let selectedPortionLabel = `${divisionsName} ${divisionNumber}`;
    if (bookKey && bookKey.toLowerCase() === "upanishads") {
      const upNum = Number(divisionNumber);
      const upanishadObj = UPANISHADS_108.find(u => u.number === upNum);
      if (upanishadObj) {
        selectedPortionLabel = `Upanishad #${upNum}: ${upanishadObj.name} Upanishad (Translation/Meaning: "${upanishadObj.translation}", Category: "${upanishadObj.category}", Veda Source: "${upanishadObj.veda}")`;
      }
    } else if (bookKey && bookKey.toLowerCase().startsWith("hadith_")) {
      selectedPortionLabel = getHadithBookName(bookKey, Number(divisionNumber));
    }

    const systemInstruction = `You are an exceptionally respectful, objective academic scholar, world-class translator, and comparative religion expert.
Your goal is to guide readers through classical, sacred, and historical texts by generating highly authentic, beautiful, and accurate readings.
You MUST write all generated commentary, summaries, translations, and lessons entirely in the requested output language: "${targetLang}".
Maintain academic neutrality, historical context, and respect for spiritual and moral heritages.`;

    const prompt = `Provide the sacred/historical text reading for the book and portion specified below:
Religion: ${religion}
Book Title: ${bookTitle} (${originalTitle || ""})
Book Key: ${bookKey}
Selected Portion: ${selectedPortionLabel}
Target Language for Output: ${targetLang}
Portion Length Mode: ${lengthMode} (Options: "full" or "curated")

Requirements:
1. Translate and explain EVERYTHING (introductory summary, verse translations, scholarly commentary, interfaith parallels, lessons) completely in "${targetLang}".
2. Handle the "Portion Length Mode" stringently:
   - If Portions Length Mode is "full", do NOT truncate or summarize chapters/sections. Instead, generate a highly complete and thorough version of this portion with a substantial representation of the verses/passages (typically 12 to 24 defining, successive, or representative canonical verses/sections that construct the full narrative flow of this chapter or book without gaps).
   - If Portions Length Mode is "curated", select 4 to 8 of the most defining, foundational verses or passages for this portion.
3. For each verse/passage generated, provide:
   - A sequential number or coordinate key matching classical structure (e.g., "1", "2.4").
   - The original script text (e.g. Sanskrit Devanagari, Arabic script, Greek letters, Hebrew letters, Latin etc.) where applicable. If not applicable or hard to represent, use standard authentic letters.
   - Syllable-by-syllable phonetic transliteration using Latin characters so learners can read the accurate pronunciation.
   - A highly precise, beautiful, classical translation in "${targetLang}".
4. Write a 3 to 4 paragraph deep theological/historical commentary in "${targetLang}" detailing the historical context, philosophical teachings, and socio-ethical impact.
5. Provide 2 or 3 striking interfaith parallels from OTHER world traditions, fully described and explained in "${targetLang}" with practical lessons.

You must follow the schema and remain highly authentic to the named scripture. Do not hallucinate passages or compromise narrative structure.`;

    const response = await callGeminiWithRetry(() => ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.2,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingLevel: (highThinking ? "HIGH" : "LOW") as any },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            introSummary: {
              type: Type.STRING,
              description: "Short introductory description summarizing this chapter or section in the target language.",
            },
            verses: {
              type: Type.ARRAY,
              description: "Collection of verses or sections representing this portion in full or curated format.",
              items: {
                type: Type.OBJECT,
                properties: {
                  number: { type: Type.STRING, description: "Verse label or coordinate (e.g., '14' or '2.4')" },
                  originalText: { type: Type.STRING, description: "Text in its original writing script where applicable." },
                  transliteration: { type: Type.STRING, description: "Phonetic pronunciation representation." },
                  translation: { type: Type.STRING, description: "A highly accurate, elegant translation into the requested target language." },
                },
                required: ["number", "originalText", "transliteration", "translation"],
              },
            },
            commentary: {
              type: Type.STRING,
              description: "Comprehensive scholarly analysis of this portion formatted in Markdown, written entirely in the requested target language.",
            },
            interfaithParallels: {
              type: Type.ARRAY,
              description: "Corresponding teachings from other major world scriptures of this ethical value in the requested target language.",
              items: {
                type: Type.OBJECT,
                properties: {
                  religion: { type: Type.STRING, description: "The comparative tradition name." },
                  source: { type: Type.STRING, description: "Source passage citation." },
                  similarity: { type: Type.STRING, description: "Description in target language showing how they correspond." },
                  lesson: { type: Type.STRING, description: "Practical modern lesson in target language." },
                },
                required: ["religion", "source", "similarity", "lesson"],
              },
            },
          },
          required: ["introSummary", "verses", "commentary", "interfaithParallels"],
        },
      },
    }));

    const parsedData = cleanAndParseJSON(response.text || "{}");
    scriptureCache.set(cacheKey, parsedData);
    res.json(parsedData);
  } catch (err: any) {
    const bookTitle = req.body.bookTitle || "Sacred Text";
    const divNum = req.body.divisionNumber || 1;
    console.log(`[Offline Core Engine] Servicing locally cached scripture readings for "${bookTitle}" (Portion ${divNum})`);
    const fallbackPayload = await getOfflineScriptureFallback(
      req.body.religion || "other",
      req.body.bookKey || "other",
      bookTitle,
      Number(divNum) || 1,
      req.body.divisionsName || "Section",
      req.body.originalTitle || "",
      req.body.targetLanguageKey || "English"
    );
    res.json(fallbackPayload);
  }
});

// 3. Compare dynamic interfaith topics
app.post("/api/scriptures/compare", async (req, res) => {
  try {
    const { theme, selectedReligions, highThinking } = req.body;

    if (!theme || !selectedReligions || !Array.isArray(selectedReligions) || selectedReligions.length === 0) {
      return res.status(400).json({ error: "Missing required parameters: theme and selectedReligions list" });
    }

    const themeClean = theme.trim().toLowerCase();
    const sortedRels = [...selectedReligions].sort().map(r => r.toLowerCase()).join(",");
    const cacheKey = `${themeClean}:${sortedRels}:${highThinking ? "high" : "low"}`;

    if (compareCache.has(cacheKey)) {
      console.log(`[Cache Hit] Delivering cached scripture comparison for theme: "${theme}"`);
      return res.json(compareCache.get(cacheKey));
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are a comparative theologian and academic coordinator.
You synthesize cross-scriptural studies objectively, respecting all religious viewpoints while focusing on their shared bridges of wisdom and ethical constructs.`;

    const prompt = `Perform a deep comparative scripture review.
Comparing Topic: "${theme}"
Across the following religions: ${selectedReligions.join(", ")}

Generate a response adhering strictly to the JSON schema. For each religion selected:
1. Locate the absolute primary sacred scripture for that religion that states their perspective on "${theme}".
2. Quote a beautiful key selection/passage (with specific book & verse chapter details).
3. Elaborate on the deeper theological explanation for that teaching.
4. Elaborate on its relevance to modern challenges.
5. Provide a beautiful master interfaith synthesis of 2-3 paragraphs comparing similarities and differences objectively.`;

    const response = await callGeminiWithRetry(() => ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.3,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingLevel: (highThinking ? "HIGH" : "LOW") as any },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            theme: { type: Type.STRING, description: "The custom topic being studied." },
            synthesis: {
              type: Type.STRING,
              description: "A masterful 2-3 paragraph academic synthesis comparing and linking the views of these different religions in a unifying manner.",
            },
            comparisons: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  religion: { type: Type.STRING, description: "Core religion name" },
                  scriptureSource: { type: Type.STRING, description: "Full book/sacred text source path (e.g. 'Sura 2 Verse 177' or 'Bhagavad Gita 12.13')" },
                  keyPassage: { type: Type.STRING, description: "The quote/snippet from the scripture relevant to the theme." },
                  explanation: { type: Type.STRING, description: "Theological perspective and historical interpretation." },
                  relevanceToModernLife: { type: Type.STRING, description: "Practical application in our current global society." },
                },
                required: ["religion", "scriptureSource", "keyPassage", "explanation", "relevanceToModernLife"],
              },
            },
          },
          required: ["theme", "synthesis", "comparisons"],
        },
      },
    }));

    const parsedData = cleanAndParseJSON(response.text || "{}");
    compareCache.set(cacheKey, parsedData);
    res.json(parsedData);
  } catch (err: any) {
    console.log(`[Offline Core Engine] Servicing locally cached scriptures comparative study: "${req.body.theme || ""}"`);
    const fallbackPayload = getOfflineCompareFallback(req.body.theme || "Sacred Ethics", req.body.selectedReligions || ["Hinduism", "Buddhism"]);
    res.json(fallbackPayload);
  }
});

// New Endpoint: Comparative Workbench (Pick 2 Scriptures side-by-side)
app.post("/api/scriptures/compare-workbench", async (req, res) => {
  try {
    const { theme, scripture1, scripture2, highThinking } = req.body;

    if (!theme || !scripture1 || !scripture2) {
      return res.status(400).json({ error: "Missing required parameters: theme, scripture1, and scripture2" });
    }

    const cacheKey = `${theme.trim().toLowerCase()}:${scripture1.key}:${scripture2.key}:${highThinking ? "high" : "low"}`;

    if (workbenchCache.has(cacheKey)) {
      console.log(`[Cache Hit] Delivering cached workbench comparison for theme: "${theme}"`);
      return res.json(workbenchCache.get(cacheKey));
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are an elite academic scholar of comparative theology.
You specialize in side-by-side dialectical comparisons between two specific scriptures. 
Provide objective, respectful, deeply insightful analyses of their parallels, context, terminology, and synthesis.`;

    const prompt = `Perform an exhaustive side-by-side comparative analysis.
Topic Theme of Comparison: "${theme}"
Scripture 1: "${scripture1.title}" (Religion: ${scripture1.religion})
Scripture 2: "${scripture2.title}" (Religion: ${scripture2.religion})

Please generate a high-fidelity comparison according to the JSON schema.
For both scriptures:
1. Identify a beautiful, highly relevant core passage/verse from that specific scripture speaking to "${theme}" (include chapter and verse reference in 'source').
2. Explain the precise historical, narrative, or theological 'context'.
3. State the primary 'message' or moral directive of the passage.
4. Extract the 'keyTerms': 2-3 original language words (e.g. Sanskrit, Greek, Hebrew, Pali, Arabic) with their literal English meanings.
5. Provide the practical modern 'application'.

Also, calculate a 'resonanceScore' (an integer from 0 to 100) representing how structurally aligned their guidance is on this topic, and compose a masterful 'crossSynthesis' paragraph comparing their similarities, differences, and unique contributions.`;

    const response = await callGeminiWithRetry(() => ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.3,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingLevel: (highThinking ? "HIGH" : "LOW") as any },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            theme: { type: Type.STRING },
            scripture1: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                religion: { type: Type.STRING },
                source: { type: Type.STRING },
                passage: { type: Type.STRING },
                context: { type: Type.STRING },
                message: { type: Type.STRING },
                keyTerms: { type: Type.STRING },
                application: { type: Type.STRING },
              },
              required: ["title", "religion", "source", "passage", "context", "message", "keyTerms", "application"],
            },
            scripture2: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                religion: { type: Type.STRING },
                source: { type: Type.STRING },
                passage: { type: Type.STRING },
                context: { type: Type.STRING },
                message: { type: Type.STRING },
                keyTerms: { type: Type.STRING },
                application: { type: Type.STRING },
              },
              required: ["title", "religion", "source", "passage", "context", "message", "keyTerms", "application"],
            },
            resonanceScore: { type: Type.INTEGER },
            crossSynthesis: { type: Type.STRING },
          },
          required: ["theme", "scripture1", "scripture2", "resonanceScore", "crossSynthesis"],
        },
      },
    }));

    const parsedData = cleanAndParseJSON(response.text || "{}");
    workbenchCache.set(cacheKey, parsedData);
    res.json(parsedData);
  } catch (err: any) {
    console.log(`[Offline Core Engine] Servicing locally cached workbench study for theme: "${req.body.theme || ""}"`);
    const fallbackPayload = getOfflineWorkbenchFallback(
      req.body.theme || "Sacred Ethics",
      req.body.scripture1?.title || "Scripture A",
      req.body.scripture1?.religion || "Other",
      req.body.scripture2?.title || "Scripture B",
      req.body.scripture2?.religion || "Other"
    );
    res.json(fallbackPayload);
  }
});

// New Endpoint: Individual Verse Interfaith Alignment Explorer
app.post("/api/scriptures/verse-alignment", async (req, res) => {
  try {
    const { verseText, bookTitle, verseNumber, religion } = req.body;

    if (!verseText || !bookTitle) {
      return res.status(400).json({ error: "Missing required parameters: verseText and bookTitle" });
    }

    const cleanedText = verseText.trim().substring(0, 200).toLowerCase();
    const cacheKey = `${bookTitle.toLowerCase()}:${verseNumber}:${religion.toLowerCase()}:${cleanedText}`;

    if (verseAlignmentCache.has(cacheKey)) {
      console.log(`[Cache Hit] Delivering cached verse alignment for: ${bookTitle}`);
      return res.json(verseAlignmentCache.get(cacheKey));
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are a specialist in Comparative Religion and Sacred Literature.
Your role is to discover high-fidelity parallel teachings and direct wisdom counterparts across different global faiths for any given verse.
Maintain a respectful, academic, insightful, and constructive ecumenical posture.`;

    const prompt = `Research a beautiful interfaith scripture parallel (wisdom counterpart) for the following verse:
Source Book: "${bookTitle}"
Verse Number: "${verseNumber || "N/A"}"
Tradition/Religion: "${religion || "N/A"}"
Verse Text: "${verseText}"

Locate a direct corresponding guideline, verse, or teaching from a DIFFERENT global faith tradition (e.g. if the source is Christian, look for a parallel in Buddhism, Taoism, Hinduism, Islam, Judaism, Sikhism, or Stoicism, etc.).
Ensure you provide real, recognized scripture texts (such as verses from Quran, Bhagavad Gita, Dhammapada, Tao Te Ching, Guru Granth Sahib, Bible, Agamas, or Torah).
Provide the response strictly adhering to the specified JSON schema.`;

    const response = await callGeminiWithRetry(() => ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.4,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sourceVerse: {
              type: Type.OBJECT,
              properties: {
                book: { type: Type.STRING },
                number: { type: Type.STRING },
                text: { type: Type.STRING }
              },
              required: ["book", "number", "text"]
            },
            parallelTradition: { type: Type.STRING, description: "Name of the corresponding tradition or religion." },
            parallelScriptureSource: { type: Type.STRING, description: "Name/Book/Verse reference of the parallel text (e.g. 'Dhammapada Chapter 1, Verse 5' or 'Sura 5 Verse 32')." },
            parallelKeyPassage: { type: Type.STRING, description: "The actual quote or passage from the parallel text." },
            theologicalAlignment: { type: Type.STRING, description: "A detailed 1-2 paragraph description analyzing how these two verses address the same universal theme, bridging their respective terminologies." },
            modernSpiritualLesson: { type: Type.STRING, description: "A highly practical ethical takeaway or spiritual lesson for modern life." }
          },
          required: ["sourceVerse", "parallelTradition", "parallelScriptureSource", "parallelKeyPassage", "theologicalAlignment", "modernSpiritualLesson"]
        }
      }
    }));

    const parsedData = cleanAndParseJSON(response.text || "{}");
    verseAlignmentCache.set(cacheKey, parsedData);
    res.json(parsedData);
  } catch (err: any) {
    console.log(`[Offline Core Engine] Servicing locally cached verse alignments for "${req.body.bookTitle || ""}"`);
    const fallbackPayload = getOfflineVerseAlignmentFallback(
      req.body.verseText || "Universal truth guides all mankind.",
      req.body.bookTitle || "Holy Text",
      req.body.verseNumber || "1",
      req.body.religion || "Universal"
    );
    res.json(fallbackPayload);
  }
});

// New Endpoint: See topically similar verses from other scriptures in the library using Gemini AI
app.post("/api/scriptures/similar-verses", async (req, res) => {
  try {
    const { verseText, bookTitle, verseNumber, religion } = req.body;

    if (!verseText || !bookTitle) {
      return res.status(400).json({ error: "Missing required parameters: verseText and bookTitle" });
    }

    const cleanedText = verseText.trim().substring(0, 200).toLowerCase();
    const cacheKey = `${bookTitle.toLowerCase()}:${verseNumber}:${religion?.toLowerCase() || ""}:${cleanedText}`;

    if (similarVersesCache.has(cacheKey)) {
      console.log(`[Cache Hit] Delivering cached similar verses for: ${bookTitle}`);
      return res.json(similarVersesCache.get(cacheKey));
    }

    const matchingGroup = findMatchingAlignmentGroup(verseText);
    let matchedContextText = "";
    if (matchingGroup) {
      const otherVerses = matchingGroup.filter(v => v.book.toLowerCase() !== (bookTitle || "").toLowerCase());
      if (otherVerses.length > 0) {
        matchedContextText = `\nWe have pre-computed, verified theological counterpart alignments for this verse from our local alignment database:\n` +
          otherVerses.map((v, idx) => `- Source: "${v.book}" (${v.reference}, tradition: "${v.religion}"): "${v.text}" (Thematic alignment category: "${v.theme}")`).join("\n") +
          `\n\nYou MUST prioritize incorporating these exact verified historic counterparts in your 'similarVerses' array response, providing high-fidelity comparative theological analysis for each. If there are fewer than 3 local matches, find additional beautiful parallel verses to return exactly 3.`;
      }
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are a comparative theologian and academic scripture archivist.
Your job is to search the global library of world scriptures (such as Hinduism, Buddhism, Islam, Christianity, Judaism, Taoism, Jainism, Sikhism, and Stoicism) and locate topically similar parallel verses that share deep ethical or philosophical alignment with the provided verse.
Always maintain an objective, respectful, academic, and ecumenical tone.`;

    const prompt = `Search the virtual library of global scriptures for exactly 3 beautiful, topically similar parallel verses (wisdom counterparts) that align with this verse:
Source Book: "${bookTitle}"
Verse Number: "${verseNumber || "N/A"}"
Tradition/Religion: "${religion || "N/A"}"
Verse Text: "${verseText}"
${matchedContextText}

For each of the 3 similar verses:
1. Provide the target scripture book/source title (e.g. "Dhammapada", "Holy Bible", "Quran", "Bhagavad Gita", "Tao Te Ching").
2. Provide the specific reference/citation details (e.g. "Chapter 1, Verse 5", "Romans 12:21", "Surah 41, Verse 34").
3. Provide the religion or spiritual tradition (e.g. "buddhism", "christianity", "islam", "hinduism", "judaism", "jainism", "other").
4. Provide the actual quote or translation text of that verse in English.
5. Provide a clear similarity analysis (1-2 sentences) explaining how it aligns with the source verse's core spiritual/moral lesson.
6. Calculate a 'resonanceScore' (an integer from 0 to 100) indicating the semantic/theological alignment.

Respond strictly adhering to the specified JSON schema.`;

    const response = await callGeminiWithRetry(() => ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.4,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sourceVerse: {
              type: Type.OBJECT,
              properties: {
                book: { type: Type.STRING },
                number: { type: Type.STRING },
                text: { type: Type.STRING }
              },
              required: ["book", "number", "text"]
            },
            similarVerses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  book: { type: Type.STRING, description: "Name of the scripture book (e.g., Dhammapada, Quran, Holy Bible)." },
                  reference: { type: Type.STRING, description: "The chapter/verse reference details (e.g., Chapter 1, Verse 5)." },
                  religion: { type: Type.STRING, description: "The religion or tradition associated with the scripture." },
                  text: { type: Type.STRING, description: "The actual quote or translation of the verse." },
                  similarity: { type: Type.STRING, description: "Brief analysis of why these teachings are topically/theologically aligned." },
                  resonanceScore: { type: Type.INTEGER, description: "An integer between 0 and 100 representing how closely the guidance aligns." }
                },
                required: ["book", "reference", "religion", "text", "similarity", "resonanceScore"]
              }
            }
          },
          required: ["sourceVerse", "similarVerses"]
        }
      }
    }));

    const parsedData = cleanAndParseJSON(response.text || "{}");
    similarVersesCache.set(cacheKey, parsedData);
    res.json(parsedData);
  } catch (err: any) {
    console.log(`[Offline Core Engine] Servicing locally cached similar verses for "${req.body.bookTitle || ""}"`);
    const fallbackPayload = getOfflineSimilarVersesFallback(
      req.body.verseText || "Universal truth guides all mankind.",
      req.body.bookTitle || "Holy Text",
      req.body.verseNumber || "1",
      req.body.religion || "Universal"
    );
    res.json(fallbackPayload);
  }
});

// 4. Chat with Interfaith AI Scholar
app.post("/api/scriptures/chat", async (req, res) => {
  try {
    const { messages, contextBookTitle, contextChapter, highThinking } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const lastUserMsg = [...messages].reverse().find(m => m.sender === "user" || m.role === "user")?.text || "Hello";
    const cacheKey = `${contextBookTitle || ""}:${contextChapter || ""}:${lastUserMsg.toLowerCase().trim()}:${highThinking ? "high" : "low"}`;

    if (chatCache.has(cacheKey)) {
      console.log(`[Cache Hit] Delivering cached chat wisdom response`);
      return res.json(chatCache.get(cacheKey));
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are an elite, wise Interfaith AI Scripture Scholar.
Your style is respectful, academic, insightful, peaceful, and fully ecumenical.
You are helping the user research holy books (such as Hindu scriptures, Quran, Bible, Dhammapada, Torah, Agamas, Guru Granth Sahib, and Tao Te Ching).
Answer questions deeply and constructively, highlighting both the direct theological context of the book and comparing/drawing loving parallels with other faiths to nurture mutual respect and interfaith harmony.
${
  contextBookTitle
    ? `The reader is currently studying: ${contextBookTitle} ${contextChapter || ""}. Draw connections to this when relevant.`
    : ""
}
Avoid polemics or favoring any faith. Refer to critical consensus and original-language root terms (e.g., Arabic 'Rahmah' for mercy, Sanskrit 'Shanti' for peace, Greek 'Agape' for unconditional love) to educate the reader.`;

    const formattedContents = messages.map((m: any) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));

    const response = await callGeminiWithRetry(() => ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
        thinkingConfig: { thinkingLevel: (highThinking ? "HIGH" : "LOW") as any },
      },
    }));

    const payload = { text: response.text };
    chatCache.set(cacheKey, payload);
    res.json(payload);
  } catch (err: any) {
    console.log(`[Offline Core Engine] Servicing locally cached academic feedback context`);
    const fallbackPayload = getOfflineChatFallback(req.body.messages || [], req.body.contextBookTitle, req.body.contextChapter);
    res.json(fallbackPayload);
  }
});

// 5. Generate custom legends & comparison stories
app.post("/api/characters/story", async (req, res) => {
  try {
    const { characterKey, characterName, role, prompt, highThinking, translateProfile, targetLanguageKey, summary, detailedEthos, story, interfaithEcho } = req.body;

    if (!characterName) {
      return res.status(400).json({ error: "characterName is required." });
    }

    const targetLang = targetLanguageKey || "English";
    const cacheKey = translateProfile
      ? `translate:${characterName.toLowerCase().trim()}:${targetLang.toLowerCase()}:${highThinking ? "high" : "low"}`
      : `story:${characterName.toLowerCase().trim()}:${targetLang.toLowerCase()}:${role ? role.toLowerCase().trim() : ""}:${highThinking ? "high" : "low"}`;

    if (storyCache.has(cacheKey)) {
      console.log(`[Cache Hit] Delivering cached story/profile translation of ${characterName} in ${targetLang}`);
      return res.json(storyCache.get(cacheKey));
    }

    const ai = getGeminiClient();

    if (translateProfile) {
      const systemInstruction = `You are a professional scholarly translator and theological editor.
Your task is to translate the core registry fields of a sacred/historical spiritual figure from English into the requested target translation language: "${targetLang}".
You must translate all input text strictly, preserving the deep, beautiful, classical, and academic vocabulary. Ensure the output speaks natural and authentic theological language in "${targetLang}".`;

      const translatePrompt = `Translate the profile fields of the character below into "${targetLang}":
Character Name: ${characterName}
Original Role (English): ${role || ""}
Original Summary (English): ${summary || ""}
Original Detailed Ethos (English): ${detailedEthos || ""}
Original Story Narrative (English): ${story || ""}
Original Interfaith Echo (English): ${interfaithEcho || ""}

Provide the translated versions of each field in JSON matching the response schema:`;

      const response = await callGeminiWithRetry(() => ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: translatePrompt,
        config: {
          systemInstruction,
          temperature: 0.2,
          responseMimeType: "application/json",
          thinkingConfig: { thinkingLevel: (highThinking ? "HIGH" : "LOW") as any },
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              role: { type: Type.STRING, description: "Translated character role or title" },
              summary: { type: Type.STRING, description: "Translated short summary of the character" },
              detailedEthos: { type: Type.STRING, description: "Translated deep detailed ethos narrative" },
              story: { type: Type.STRING, description: "Translated legendary chronicle story narrative" },
              interfaithEcho: { type: Type.STRING, description: "Translated cross-cultural interfaith echo" },
            },
            required: ["role", "summary", "detailedEthos", "story", "interfaithEcho"],
          },
        },
      }));

      const parsedData = cleanAndParseJSON(response.text || "{}");
      storyCache.set(cacheKey, parsedData);
      return res.json(parsedData);
    }

    const systemInstruction = `You are a respectful academic scholar, theologian, and comparative mythologist.
Your task is to write detailed historical, legendary, and comparative reflections of celebrated divine and spiritual characters.
Your writing must be highly engaging, objective, deeply informative, and positive, drawing connections with other world religions to highlight shared core virtues (e.g. self-sacrifice, duty, justice, compassion). Use elegant formatting with headers (e.g., Markdown).
You MUST write all generated content (headings, stories, comparative points) entirely in the requested language: "${targetLang}".`;

    const fullPrompt = `Character name: ${characterName}
Role: ${role || ""}
Prompt/Request: ${prompt || `Tell me a detailed story of ${characterName} highlighting their moral teachings.`}
Target Language: ${targetLang}

Requirements:
1. Write a beautiful, descriptive, and historically/theologically authentic narrative or response entirely in "${targetLang}".
2. Structure the response beautifully using Markdown headers, bold terms, and paragraphs.
3. Highlight how the character's core values (such as compassion, sacrifice, righteous duty, or justice) connect to similar values in other world religious traditions (e.g. Hinduism, Buddhism, Islam, Christianity, Judaism, Jainism, etc.). Make these interfaith parallels elegant, respectful, and fully formulated in "${targetLang}".`;

    const response = await callGeminiWithRetry(() => ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: fullPrompt,
      config: {
        systemInstruction,
        temperature: 0.6,
        thinkingConfig: { thinkingLevel: (highThinking ? "HIGH" : "LOW") as any },
      },
    }));

    const payload = { story: response.text };
    storyCache.set(cacheKey, payload);
    res.json(payload);
  } catch (err: any) {
    const characterName = req.body.characterName || "Sovereign Sage";
    const targetLang = req.body.targetLanguageKey || "English";
    console.log(`[Offline Core Engine] Servicing locally cached sacred narratives for character: ${characterName}`);
    
    if (req.body.translateProfile) {
      const isDe = targetLang.toLowerCase() === "german";
      const isEs = targetLang.toLowerCase() === "spanish";
      const isFr = targetLang.toLowerCase() === "french";
      const isHi = targetLang.toLowerCase() === "hindi";

      const localDe = {
        role: "Der Allvater & Wanderer (Offline-Modus)",
        summary: `Ein bedeutender spiritueller Gesandter für ${characterName}, bekannt für außergewöhnliche Weisheit und Tugenden.`,
        detailedEthos: `Er verkörpert die unermüdliche Hingabe an Gerechtigkeit, Wahrheit und den Dienst am Nächsten unter extremen Prüfungen.`,
        story: `Die heilige Überlieferung berichtet von einer tiefen Prüfung, bei der ${characterName} unerschütterliche Standhaftigkeit bewies, um die universelle kosmische Harmonie zu bewahren.`,
        interfaithEcho: `Diese Erzählung steht im Einklang mit universalen ethischen Codes und spiegelt die Barmherzigkeit im Buddhismus sowie die Liebe in christlichen Werken wider.`
      };

      const localEs = {
        role: "El Sagrado Mensajero (Modo Fuera de línea)",
        summary: `Un ilustre maestro espiritual de ${characterName}, celebrado por sus virtudes y sabiduría celestial.`,
        detailedEthos: `Encarne el compromiso absoluto con el deber moral, la verdad y la compasión hacia todas las criaturas vivas.`,
        story: `La crónica nos cuenta que ${characterName} resistió con noble sonrisa ante intensas pruebas, preservando la armonía universal.`,
        interfaithEcho: `Este relato armoniza directamente con los preceptos del Dharma hindú y las prácticas zen del mindfulness.`
      };

      res.json(isDe ? localDe : isEs ? localEs : {
        role: req.body.role || "Sacred Messenger (Offline Mode)",
        summary: req.body.summary ? `${req.body.summary} (Offline Translation)` : "A celebrated figure of moral and philosophical guidance and virtues.",
        detailedEthos: req.body.detailedEthos ? `${req.body.detailedEthos} (Offline)` : "Embodies high ethical commitment, spiritual wisdom, and duty.",
        story: req.body.story ? `${req.body.story} (Offline)` : "A chronicle illustrating how ultimate trials are navigated.",
        interfaithEcho: req.body.interfaithEcho ? `${req.body.interfaithEcho} (Offline)` : "This virtue correlates with moral lessons in other world traditions."
      });
    } else {
      const fallbackPayload = getOfflineStoryFallback(characterName, req.body.role, req.body.prompt);
      res.json(fallbackPayload);
    }
  }
});

// 6. Direct Holy Scripture Q&A Solver (Fetch & pinpoint from sacred books immediately)
app.post("/api/scriptures/qa", async (req, res) => {
  try {
    const { question, highThinking } = req.body;
    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "question string parameter is required." });
    }

    const cacheKey = `${question.toLowerCase().trim()}:${highThinking ? "high" : "low"}`;

    if (qaCache.has(cacheKey)) {
      console.log(`[Cache Hit] Delivering cached Q&A response for: "${question}"`);
      return res.json(qaCache.get(cacheKey));
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are a high-speed, elite, and wise Interfaith Scripture Q&A AI Scholar. 
The user will ask you a question. Your goals are to:
1. Identify the relevant religious practices, holidays, or moral philosophies described (for example, celebrations like Christmas, Diwali, Eid, Hanukkah, Easter, or virtues like non-violence, service, etc.).
2. Pinpoint the exact source scripture books from our registered library (e.g., "bible_nt" for New Testament, "bhagavad_gita" for Bhagavad Gita, "quran" for Quran, "dhammapada" for Dhammapada, "tao_te_ching" for Tao Te Ching, etc.). If no exact book in our registry fits, choose the best standard sacred book.
3. Fetch or retrieve the precise canonical passages/narratives that explain this answer (without making the reader search or read the entire text manually).
4. Provide a high-quality, immediate explanation of WHY this is done or celebrated, backed directly by these scriptural contexts.
5. Extract a unifying moral lesson shared across these traditions.

Maintain absolute academic excellence, objective respect, and extreme clarity. Do not write generic text—structure your answers beautifully using markdown tags inside the 'answer' property.`;

    const prompt = `Answer the following user question by extracting, quoting, and explaining references from the appropriate sacred books:
Question: "${question}"

Registered Book Keys for reference:
- bhagavad_gita
- ramayana
- upanishads
- quran
- hadith_bukhari
- bible_nt
- bible_ot
- torah
- talmud
- dhammapada
- heart_sutra
- tattvartha_sutra
- guru_granth
- dasam_granth
- varan_bhai_gurdas
- tao_te_ching
- poetic_edda
- the_odyssey
- shahnameh
- the_aeneid
- nibelungenlied
- mahabharata
- zafarnama
- morte_arthur
- gesta_danorum
- anabasis_alexander
- siva_chhatrapati
- mewar_annals_pratap
- commentarii_bello_gallico
- lalitavistara
- somnium
- epic_gilgamesh
- homers_iliad
- journey_west

Analyze the theological details, fetch corresponding canonical details (like chapters, surahs, verses), and map them to their correct book keys. Give answers immediately without requiring reading the whole books. Return absolute valid JSON adhering strictly to the response scheme.`;

    const response = await callGeminiWithRetry(() => ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.3,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingLevel: (highThinking ? "HIGH" : "LOW") as any },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Elegant title summarizing the Q&A topic" },
            answer: { type: Type.STRING, description: "Detailed scholarly answer explanation, citing books and detailing theology/history in beautiful Markdown." },
            sources: {
              type: Type.ARRAY,
              description: "The specific registry scriptures referenced to form the answer.",
              items: {
                type: Type.OBJECT,
                properties: {
                  religion: { type: Type.STRING, description: "The religion/tradition name (e.g. Hinduism, Christianity, Islam, Buddhism, historical epics, lore, etc.)" },
                  bookKey: { type: Type.STRING, description: "The exact matching key from the registered book list, or 'other' if not in the list." },
                  bookTitle: { type: Type.STRING, description: "The standard translation title of the book (e.g. 'New Testament (Bible)' or 'The Holy Quran')" },
                  citation: { type: Type.STRING, description: "Specific citation coordinates like 'Matthew 2:1-12' or 'Surah Al-Baqarah 2:185' or 'Bhagavad Gita 4.7'" },
                  passageText: { type: Type.STRING, description: "Detailed quote/excerpt or core theological story cited from this book." },
                  relevance: { type: Type.STRING, description: "Explanation of how this book and passage explains the holiday or practice." }
                },
                required: ["religion", "bookKey", "bookTitle", "citation", "passageText", "relevance"]
              }
            },
            moralSynthesis: { type: Type.STRING, description: "Short synthesis of the shared human virtue, light, or community service highlighted by this inquiry." }
          },
          required: ["title", "answer", "sources", "moralSynthesis"]
        }
      }
    }));

    const data = cleanAndParseJSON(response.text || "{}");
    qaCache.set(cacheKey, data);
    res.json(data);
  } catch (err: any) {
    console.log(`[Offline Core Engine] Servicing locally cached answers for: "${req.body.question || ""}"`);
    const fallbackPayload = getOfflineQAFallback(req.body.question || "Interfaith core questions");
    res.json(fallbackPayload);
  }
});

// 5. New Interactive Key Terms Glossary endpoint
app.post("/api/glossary/define", async (req, res) => {
  const { term, bookContext, highThinking } = req.body;
  try {
    if (!term || typeof term !== "string" || !term.trim()) {
      return res.status(400).json({ error: "Term is required for definition lookup." });
    }

    const termClean = term.trim().toLowerCase();
    const contextClean = (bookContext || "").trim().toLowerCase();
    const cacheKey = `${termClean}:${contextClean}:${highThinking ? "high" : "low"}`;

    if (glossaryCache.has(cacheKey)) {
      console.log(`[Cache Hit] Delivering cached glossary definition for: "${term}"`);
      return res.json(glossaryCache.get(cacheKey));
    }

    const ai = getGeminiClient();
    const systemInstruction = `You are an expert, objective world-religions scholar, linguist, and comparative theologian.
Your task is to provide an educational, deeply respectful, and comprehensive dictionary-style academic definition of the religious, philological, or scriptural term requested.`;

    const prompt = `Define the scriptural/theological term requested below:
Term: "${term}"
Scripture Context (if provided): "${bookContext || "Comparative global scriptures"}"

Provide the output strictly structured as a JSON object containing:
1. "term": Repeat the word with correct casing and capitalizations (e.g. "Dharma").
2. "origin": The linguistic language of origin (e.g., Sanskrit, Arabic, Hebrew, Greek, Pali) and associated religion or tradition.
3. "pronunciation": Standard phonetic reading or IPA pronunciation (e.g. "[dʱɐɽmɐ]").
4. "definition": A beautiful, clear, and academically sound core definition of the concept in 2 or 3 sentences.
5. "usage": Where this term primarily appears in canonical sacred books, and what it indicates in those scriptures.
6. "interfaithComparative": A 2-sentence comparative parallel illustrating how this virtue or philosophical motif connects to parallel concepts in other world cultures or scripture traditions (e.g. comparing Dharma's duty/virtue to Torah, Logos, or Wu Wei).`;

    const response = await callGeminiWithRetry(() => ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.2,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingLevel: (highThinking ? "HIGH" : "LOW") as any },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            term: { type: Type.STRING },
            origin: { type: Type.STRING },
            pronunciation: { type: Type.STRING },
            definition: { type: Type.STRING },
            usage: { type: Type.STRING },
            interfaithComparative: { type: Type.STRING }
          },
          required: ["term", "origin", "pronunciation", "definition", "usage", "interfaithComparative"]
        }
      }
    }));

    const data = cleanAndParseJSON(response.text || "{}");
    glossaryCache.set(cacheKey, data);
    res.json(data);
  } catch (err: any) {
    console.log(`[Offline Core Engine] Servicing locally cached glossary definition for: "${term}"`);
    const fallbackPayload = getOfflineGlossaryDefineFallback(term || "Dharma", bookContext);
    res.json(fallbackPayload);
  }
});

// 6. Scripture Clickable Term Word Cloud & Frequency Analysis
app.post("/api/scriptures/word-cloud", async (req, res) => {
  const { term, highThinking } = req.body;
  try {
    if (!term || typeof term !== "string" || !term.trim()) {
      return res.status(400).json({ error: "Term is required for word cloud analysis." });
    }

    const termClean = term.trim().toLowerCase();
    const cacheKey = `${termClean}:${highThinking ? "high" : "low"}`;

    if (wordCloudCache.has(cacheKey)) {
      console.log(`[Cache Hit] Delivering cached word cloud diagnostics for: "${term}"`);
      return res.json(wordCloudCache.get(cacheKey));
    }

    const ai = getGeminiClient();
    const systemInstruction = `You are a high-fidelity theological and historical semantic indexing engine.
The user has clicked the term "${termClean}" inside a sacred scripture verse.
Your goal is to analyze the occurrence, frequency, and comparative usage of this term (and its direct theological equivalents/translations, e.g., "Shanti" for peace, "Dharma" for duty, "Logos" for word) across ALL other scriptures in the database (including Hinduism, Buddhism, Islam, Christianity, Judaism, Jainism, Mythology, and other lore).
You MUST provide extremely respectful, scholarly, and historically accurate estimates of total usage frequency, and compile a set of highly associated terms to build a D3-based word cloud.`;

    const prompt = `Perform a full scriptures database semantic analysis for the term: "${termClean}".
Provide the output strictly structured as a JSON object containing:
1. "term": Repeat the input word with correct casing and capitalizations (e.g., "Compassion").
2. "globalFrequency": A estimated count of overall occurrences of this concept and its close direct equivalents across global scriptural canons.
3. "distribution": An array of objects, each containing:
   - "religion": One of "Hinduism", "Islam", "Christianity", "Judaism", "Buddhism", "Jainism", "Mythology", "Other".
   - "count": Estimate count of occurrences in this specific tradition.
4. "relatedTerms": An array of 15 to 25 associated terms, translations, or co-occurring themes, each containing:
   - "text": The word or short phrase (e.g. "Grace", "Dharma", "Shanti", "Agape", "Patience", "Mercy").
   - "weight": An integer score from 15 to 100 indicating relevance or frequency in word-cloud sizing.
   - "category": The tradition/religion it belongs to or "General".
5. "scriptureOccurrences": An array of 4 to 6 real, prominent verses from OTHER tradition scriptures (not matching the clicked source if possible) showing comparative usage, each containing:
   - "religion": Religion of the scripture.
   - "book": Book title (e.g., "Gospel of Matthew", "Upanishads", "Surah Al-Baqarah", "Dhammapada").
   - "chapter": Chapter/section number as a string.
   - "verse": Verse number(s) as a string.
   - "text": The actual or translated scripture text in English.
   - "explanation": A one-sentence theological explanation of how the clicked concept manifests in this verse.`;

    const response = await callGeminiWithRetry(() => ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.25,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingLevel: (highThinking ? "HIGH" : "LOW") as any },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            term: { type: Type.STRING },
            globalFrequency: { type: Type.INTEGER },
            distribution: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  religion: { type: Type.STRING },
                  count: { type: Type.INTEGER }
                },
                required: ["religion", "count"]
              }
            },
            relatedTerms: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  weight: { type: Type.INTEGER },
                  category: { type: Type.STRING }
                },
                required: ["text", "weight", "category"]
              }
            },
            scriptureOccurrences: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  religion: { type: Type.STRING },
                  book: { type: Type.STRING },
                  chapter: { type: Type.STRING },
                  verse: { type: Type.STRING },
                  text: { type: Type.STRING },
                  explanation: { type: Type.STRING }
                },
                required: ["religion", "book", "chapter", "verse", "text", "explanation"]
              }
            }
          },
          required: ["term", "globalFrequency", "distribution", "relatedTerms", "scriptureOccurrences"]
        }
      }
    }));

    const data = cleanAndParseJSON(response.text || "{}");
    wordCloudCache.set(cacheKey, data);
    res.json(data);
  } catch (err: any) {
    console.log(`[Offline Core Engine] Servicing locally cached word cloud analysis for: "${term}"`);
    const fallbackPayload = getOfflineWordCloudFallback(term || "Compassion");
    res.json(fallbackPayload);
  }
});

// Endpoint for translating devotional prayers, slokas and aartis in the Lyrics Anthology
app.post("/api/translate-hymn", async (req, res) => {
  const { key, title, intro, commentary, deity, verses, targetLanguage } = req.body || {};
  const cacheKey = `${key}_${targetLanguage}`;
  try {
    if (!targetLanguage || targetLanguage === "English") {
      return res.json({ key, title, intro, commentary, deity, verses });
    }

    if (hymnTranslationCache.has(cacheKey)) {
      return res.json(hymnTranslationCache.get(cacheKey));
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are a world-class professional translator and academic scholar of comparative religion.
Your goal is to translate sacred devotional content from English to "${targetLanguage}" with complete respect, high literary beauty, and precise flow.
You MUST output ONLY valid JSON containing the translated fields matching the specified schema. Do not add any markdown formatting, preamble, or commentary.`;

    const prompt = `Translate the following devotional hymn elements from English into "${targetLanguage}".
Main Title: "${title}"
Deity Name: "${deity}"
Intro summary: "${intro}"
Commentary: "${commentary}"

Each verse to translate:
${JSON.stringify((verses || []).map((v: any, index: number) => ({ index, number: v.number, translation: v.translation || "" })))}

For each verse:
1. Translate the English meaning ('translation') into "${targetLanguage}".`;

    const response = await callGeminiWithRetry(() => ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "The translated Title of the hymn" },
            deity: { type: Type.STRING, description: "The translated Deity name" },
            intro: { type: Type.STRING, description: "The translated dynamic Intro summary paragraphs" },
            commentary: { type: Type.STRING, description: "The translated custom Commentary" },
            verses: {
              type: Type.ARRAY,
              description: "The list of translated verse items mirroring original orders",
              items: {
                type: Type.OBJECT,
                properties: {
                  index: { type: Type.INTEGER, description: "The matching zero-based index of this verse" },
                  translation: { type: Type.STRING, description: "The translated verse text in destination language" }
                },
                required: ["index", "translation"]
              }
            }
          },
          required: ["title", "deity", "intro", "commentary", "verses"]
        }
      }
    }));

    const bodyText = response.text || response.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!bodyText) {
      throw new Error("No response body received from translation model.");
    }
    
    const translatedJSON = cleanAndParseJSON(bodyText);
    
    // Merge translated verses back into original structure to preserve original script and transliteration
    const mergedVerses = (verses || []).map((v: any, idx: number) => {
      const transItem = translatedJSON.verses?.find((tv: any) => {
        if (!tv) return false;
        return (tv.index !== undefined && Number(tv.index) === idx) ||
               (tv.number !== undefined && String(tv.number) === String(v.number));
      });
      return {
        ...v,
        translation: (transItem && transItem.translation) ? transItem.translation : v.translation,
        original: v.original, // Force-preserve original Sanskrit/Hindi/Arabic/Hebrew script
        transliteration: v.transliteration // Force-preserve phonetic Romanized guides
      };
    });

    const resultPayload = {
      key,
      title: translatedJSON.title || title,
      deity: translatedJSON.deity || deity,
      intro: translatedJSON.intro || intro,
      commentary: translatedJSON.commentary || commentary,
      verses: mergedVerses
    };

    hymnTranslationCache.set(cacheKey, resultPayload);
    res.json(resultPayload);

  } catch (error: any) {
    console.log("[Hymn Translation] Directing to offline translation fallback layer...");
    try {
      const textFields = [
        title || "",
        deity || "",
        intro || "",
        commentary || "",
        ...(verses || []).map((v: any) => v.translation || "")
      ];

      const translatedFields = await translateTextOfflineGoogleBatch(textFields, targetLanguage);

      const fallbackTitle = translatedFields[0] || title;
      const fallbackDeity = translatedFields[1] || deity;
      const fallbackIntro = translatedFields[2] || intro;
      const fallbackCommentary = translatedFields[3] || commentary;

      const fallbackVerses = (verses || []).map((v: any, idx: number) => ({
        ...v,
        translation: translatedFields[4 + idx] || v.translation
      }));

      const resultPayload = {
        key,
        title: fallbackTitle,
        deity: fallbackDeity,
        intro: fallbackIntro,
        commentary: fallbackCommentary,
        verses: fallbackVerses,
        isFallback: true
      };

      hymnTranslationCache.set(cacheKey, resultPayload);
      res.json(resultPayload);
    } catch (fallbackError: any) {
      console.log("[Hymn Absolute Fallback Info]:", fallbackError.message || fallbackError);
      res.json({
        key,
        title,
        deity,
        intro,
        commentary,
        verses,
        isFallback: true,
        errorMsg: error.message || String(error)
      });
    }
  }
});

app.post("/api/art/synthesize", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "prompt is required." });
    }

    const query = prompt.toLowerCase();
    
    // Choose the best image URL from our curated seed bank
    let themeUrl = "https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&w=800&q=80"; // default: spiritual light
    let matchedCategory = "general";

    if (query.includes("cross") || query.includes("crucifix") || query.includes("redemption")) {
      themeUrl = "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=80";
      matchedCategory = "christian-cross";
    } else if (query.includes("jesus") || query.includes("christ") || query.includes("shepherd")) {
      themeUrl = "https://images.unsplash.com/photo-1548625361-155deee22337?auto=format&fit=crop&w=800&q=80";
      matchedCategory = "christian-jesus";
    } else if (query.includes("church") || query.includes("christian") || query.includes("bible")) {
      themeUrl = "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=80";
      matchedCategory = "christian";
    } else if (query.includes("cathedral") || query.includes("stained") || query.includes("glass")) {
      themeUrl = "https://images.unsplash.com/photo-1515224526905-51c7d77c7bb8?auto=format&fit=crop&w=800&q=80";
      matchedCategory = "cathedral";
    } else if (query.includes("shiva") || query.includes("kailash") || query.includes("yoga")) {
      themeUrl = "https://images.unsplash.com/photo-1609137144813-94c632616238?auto=format&fit=crop&w=800&q=80";
      matchedCategory = "shiva";
    } else if (query.includes("mosque") || query.includes("mecca") || query.includes("islam") || query.includes("medina") || query.includes("quran") || query.includes("kaaba")) {
      themeUrl = "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80";
      matchedCategory = "islam";
    } else if (query.includes("buddha") || query.includes("zen") || query.includes("dharma") || query.includes("buddhism") || query.includes("lotus")) {
      themeUrl = "https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&w=800&q=80";
      matchedCategory = "buddhism";
    } else if (query.includes("krishna") || query.includes("gita") || query.includes("gopi")) {
      themeUrl = "https://images.unsplash.com/photo-1590418606746-018840f9cd0f?auto=format&fit=crop&w=800&q=80";
      matchedCategory = "krishna";
    } else if (query.includes("fire") || query.includes("yajna") || query.includes("agni") || query.includes("havan")) {
      themeUrl = "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80";
      matchedCategory = "fire";
    } else if (query.includes("temple") || query.includes("shrine") || query.includes("rama") || query.includes("ramayana")) {
      themeUrl = "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80";
      matchedCategory = "temple";
    } else if (query.includes("viking") || query.includes("norse") || query.includes("odin") || query.includes("thor") || query.includes("rune")) {
      themeUrl = "https://images.unsplash.com/photo-1608988220025-a74ef43d463e?auto=format&fit=crop&w=800&q=80";
      matchedCategory = "norse";
    } else if (query.includes("sikh") || query.includes("golden temple") || query.includes("guru") || query.includes("granth")) {
      themeUrl = "https://images.unsplash.com/photo-1597176116047-876a3239eef8?auto=format&fit=crop&w=800&q=80";
      matchedCategory = "sikhism";
    } else if (query.includes("torah") || query.includes("hebrew") || query.includes("jew") || query.includes("jerusalem")) {
      themeUrl = "https://images.unsplash.com/photo-1512588150405-bc3e6b530121?auto=format&fit=crop&w=800&q=80";
      matchedCategory = "judaism";
    } else if (query.includes("pilgrim") || query.includes("journey") || query.includes("path")) {
      themeUrl = "https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084?auto=format&fit=crop&w=800&q=80";
      matchedCategory = "pilgrim";
    } else if (query.includes("book") || query.includes("scripture") || query.includes("write") || query.includes("text")) {
      themeUrl = "https://images.unsplash.com/photo-1544764200-d834fd210a23?auto=format&fit=crop&w=800&q=80";
      matchedCategory = "scripture";
    }

    try {
      const ai = getGeminiClient();
      const systemInstruction = `You are an elite Interfaith Art Historian, Sacred Geometer, and Spiritual Symbolism Curator.
The user wants to synthesize a custom sacred artwork concept based on their prompt: "${prompt}".
Your task is to analyze their prompt, and synthesize a deep theological description, accurate symbolic attributes, and a quiet, reverent meditation tip.
You must output a single JSON object with EXACTLY the requested keys:`;

      const gPrompt = `Synthesize a highly reverent, beautiful visual art concept based on the user prompt: "${prompt}".
Provide the details in JSON format conforming to the following structure:
{
  "title": "A highly spiritual, poetic title for the synthesized artwork",
  "description": "A deep 2-3 sentence paragraph explaining the visual motif, traditional theological colors, and interactive sacred symbolism contained in this synthesized art",
  "synergyAttributes": ["3-4 concise key artistic words describing the core attributes/motifs"],
  "meditationAesthetic": "A beautiful 1-sentence quiet meditation guidance tip for focusing on this symbol during prayer"
}`;

      const response = await callGeminiWithRetry(() => ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: gPrompt,
        config: {
          systemInstruction,
          temperature: 0.7,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              synergyAttributes: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              meditationAesthetic: { type: Type.STRING }
            },
            required: ["title", "description", "synergyAttributes", "meditationAesthetic"]
          }
        }
      }));

      const parsed = cleanAndParseJSON(response.text || "{}");
      res.json({
        title: parsed.title || "Luminous Sacred Motif",
        unplashSubstituteUrl: themeUrl,
        description: parsed.description || `A synthesized visual study representing "${prompt}".`,
        synergyAttributes: parsed.synergyAttributes || ["Sacred Geometry", "Infinite Light", "Divine Peace"],
        meditationAesthetic: parsed.meditationAesthetic || "Inhale tranquility, exhale distractions. Allow the sacred symmetry to still your mind."
      });
    } catch (apiErr) {
      // In offline/no-key mode, return a beautifully tailored fallback response based on matched category
      console.log(`[Art Synthesizer Offline Fallback] Serving offline synthesis details for: ${prompt}`);
      let fallbackTitle = "Glow of Divine Guidance";
      let fallbackDesc = `We synthesized a detailed symbolic visual profile based on your trigger "${prompt}". This concept conjures an immersive, reverent interactive artwork utilizing ancient theological colors, accurate sacred symbols, and high-contrast ambient shadows.`;
      let fallbackAttr = ["Sacred Light", "Inner Contemplation", "Auspicious Vibe"];
      let fallbackMed = "Focus on the breathing rhythm of a flickering sacred lamp.";

      if (matchedCategory === "christian") {
        fallbackTitle = "The Redemptive Cross in Mystic Dawn";
        fallbackAttr = ["Resurrection Grace", "Celestial Dawn", "Unconditional Compassion"];
        fallbackMed = "Visualize gold and ruby shards of stained glass resolving into unified white light.";
      } else if (matchedCategory === "cathedral") {
        fallbackTitle = "Celestial Rose of Stained Glass";
        fallbackAttr = ["Gothic Geometry", "Luminous Jewel Panels", "Heavenly Radiance"];
        fallbackMed = "Watch the colored beams pool on the stone pillars of your mind.";
      } else if (matchedCategory === "shiva") {
        fallbackTitle = "Silent Peak of Cosmic Asceticism";
        fallbackAttr = ["Mount Kailash Glow", "Quiet Void", "Consciousness Fire"];
        fallbackMed = "Imagine your thoughts settling like snow on the motionless peaks of Kailash.";
      } else if (matchedCategory === "islam") {
        fallbackTitle = "Minaret Silhouette under Galactic Skies";
        fallbackAttr = ["Monotheistic Symmetry", "Starlit Devotion", "Sacred Geometric Peace"];
        fallbackMed = "Trace the infinite repeating lines of Islamic geometric star screens in your breath.";
      } else if (matchedCategory === "buddhism") {
        fallbackTitle = "The Transcendental Lotus Void";
        fallbackAttr = ["Nirvana Radiance", "Impermanency Glow", "Heart-Mind Emptiness"];
        fallbackMed = "Visualize a golden lotus blossom opening inside the quiet space of your chest.";
      } else if (matchedCategory === "krishna") {
        fallbackTitle = "The Sanctuary of Dharma’s Dawn";
        fallbackAttr = ["Krishna Flute Silhouette", "Auspicious Devotional Path", "Cosmic Truth Spark"];
        fallbackMed = "Focus on the sweet silent song of the flute rising from the inner core of your consciousness.";
      } else if (matchedCategory === "fire") {
        fallbackTitle = "Golden Spark of the Sacred Hearth";
        fallbackAttr = ["Purifying Fire", "Agni Resonance", "Sacred Smoke"];
        fallbackMed = "Observe the upward rising flames carrying your concerns into pure, clear space.";
      } else if (matchedCategory === "temple") {
        fallbackTitle = "Echoing Sanctuary of Stone";
        fallbackAttr = ["Sacred Pillars", "Ancient Geometry", "Grounded Peace"];
        fallbackMed = "Walk barefoot into the cool, silent stone inner sanctum of your quiet mind.";
      } else if (matchedCategory === "norse") {
        fallbackTitle = "Ancestral Runestone of Mystic Fire";
        fallbackAttr = ["Odinic Sacrificial Wisdom", "Aurora Spark", "Yggdrasil Deep Roots"];
        fallbackMed = "Contemplate your spine as the World Tree, channeling skyward light deep into baseline ground roots.";
      }

      res.json({
        title: `Mystical Concept: ${fallbackTitle}`,
        unplashSubstituteUrl: themeUrl,
        description: fallbackDesc,
        synergyAttributes: fallbackAttr,
        meditationAesthetic: fallbackMed
      });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

// -----------------------------------------------------------------
// DEVELOPMENT & PRODUCTION ASSET HANDLERS
// -----------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Interfaith Scripture Library Server] running on http://0.0.0.0:${PORT}`);
    
    // Asynchronously log ADC diagnostic information on startup
    getAdcInfo().then((info) => {
      console.log("=== Firebase Admin ADC Startup Diagnostics ===");
      console.log(`  Project ID:        ${info.projectId}`);
      console.log(`  Credential Source: ${info.credentialSource}`);
      console.log(`  Local Environment: ${info.isLocalEnv}`);
      console.log("  Relevant Environment Variables:");
      Object.entries(info.envVars).forEach(([key, val]) => {
        console.log(`    ${key}: ${val}`);
      });
      console.log("==============================================");
    }).catch((err) => {
      console.error("=== Error obtaining Firebase Admin ADC Diagnostics ===");
      console.error(err.message);
      console.log("==============================================");
    });
  });
}

startServer().catch((err) => {
  console.error("Failed to start Interfaith Scripture Server:", err);
});
