import { initializeApp } from "firebase/app";
import { getFirestore, doc, collection, setDoc, writeBatch } from "firebase/firestore";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read Firebase config from firebase-applet-config.json
const configPath = path.join(__dirname, "firebase-applet-config.json");
const configData = JSON.parse(fs.readFileSync(configPath, "utf8"));

const firebaseConfig = {
  apiKey: configData.apiKey,
  authDomain: configData.authDomain,
  projectId: configData.projectId,
  storageBucket: configData.storageBucket,
  messagingSenderId: configData.messagingSenderId,
  appId: configData.appId
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, configData.firestoreDatabaseId || "interfaith-108");

export async function uploadKrishnaYajurvedaWeb() {
  const rawPath = path.join(__dirname, "krishna_yajurveda_raw.json");

  let data: any = null;
  if (fs.existsSync(rawPath)) {
    console.log(`📖 Reading raw JSON from '${rawPath}'...`);
    data = JSON.parse(fs.readFileSync(rawPath, "utf8"));
  } else {
    console.log("📝 Generating sample Krishna Yajurveda JSON...");
    data = {
      branch: "krishna",
      kandas: [
        {
          kanda_number: 1,
          kanda_title: "Kanda 1",
          prashnas: [
            {
              prashna_number: 1,
              prashna_title: "Prashna 1",
              verses: [
                {
                  verse_number: 1,
                  reference: "1.1.1",
                  text: "इ॒षे त्वा॑ ऊ॒र्जे त्वा॑ वा॒यवः॑ स्थ दे॒वो वः॑ सवि॒ता प्रार्प॑यतु॒ श्रेष्ठ॑तमाय॒ कर्म॑णे ।",
                  transliteration: "iṣe tvā ūrje tvā vāyavaḥ stha devo vaḥ savitā prārpayatu śreṣṭhatamāya karmaṇe |",
                  translation: "For sap thee, for juice thee! Ye are winds. May God Savitar impel you to the highest work!"
                },
                {
                  verse_number: 2,
                  reference: "1.1.2",
                  text: "आप्या॑यध्वमघ्निया देवभा॒गमूर्ज॑स्वतीः॒ पय॑स्वतीः प्र॒जाव॑तीरनमी॒वा अ॑य॒क्ष्माः ।",
                  transliteration: "āpyāyadhvamaghniyā devabhāgamūrjasvatīḥ payasvatīḥ prajāvatīranamīvā ayakṣmāḥ |",
                  translation: "Swell, O ye inviolable ones, for the portion of the Gods, full of juice, full of milk, rich in offspring, free from disease, free from sickness!"
                }
              ]
            }
          ]
        }
      ]
    };
    fs.writeFileSync(rawPath, JSON.stringify(data, null, 2), "utf8");
  }

  console.log("⚡ Connecting to Firestore ('interfaith-108')...");
  
  const krishnaDocRef = doc(db, "Holy Scripture Books", "Hinduism", "Yajurveda (यजुर्वेदः)", "krishna");

  await setDoc(krishnaDocRef, {
    title: "Krishna Yajurveda",
    branch: "krishna",
    originalTitle: "कृष्ण यजुर्वेदः",
    structure: "kandas -> prashnas -> verses"
  }, { merge: true });

  const kandas = data.kandas || [];
  console.log(`📦 Uploading ${kandas.length} Kandas for Krishna Yajurveda...`);

  let batch = writeBatch(db);
  let batchCount = 0;
  let totalVerses = 0;

  for (let kIdx = 0; kIdx < kandas.length; kIdx++) {
    const kanda = kandas[kIdx];
    const kandaNum = kanda.kanda_number || (kIdx + 1);
    const kandaTitle = kanda.kanda_title || `Kanda ${kandaNum}`;
    const kandaDocId = `kanda_${kandaNum}`;

    const kandaDocRef = doc(db, "Holy Scripture Books", "Hinduism", "Yajurveda (यजुर्वेदः)", "krishna", "kandas", kandaDocId);
    batch.set(kandaDocRef, {
      kanda_number: kandaNum,
      title: kandaTitle,
      number: kandaNum
    }, { merge: true });
    batchCount++;

    const prashnas = kanda.prashnas || [];
    for (let pIdx = 0; pIdx < prashnas.length; pIdx++) {
      const prashna = prashnas[pIdx];
      const prashnaNum = prashna.prashna_number || (pIdx + 1);
      const prashnaTitle = prashna.prashna_title || `Prashna ${prashnaNum}`;
      const prashnaDocId = `prashna_${prashnaNum}`;

      const prashnaDocRef = doc(db, "Holy Scripture Books", "Hinduism", "Yajurveda (यजुर्वेदः)", "krishna", "kandas", kandaDocId, "prashnas", prashnaDocId);
      batch.set(prashnaDocRef, {
        prashna_number: prashnaNum,
        title: prashnaTitle,
        number: prashnaNum,
        kanda_number: kandaNum
      }, { merge: true });
      batchCount++;

      const verses = prashna.verses || [];
      for (let vIdx = 0; vIdx < verses.length; vIdx++) {
        const verse = verses[vIdx];
        const verseNum = verse.verse_number || (vIdx + 1);
        const verseDocId = `verse_${verseNum}`;
        const verseRefStr = verse.reference || `${kandaNum}.${prashnaNum}.${verseNum}`;

        const verseDocRef = doc(db, "Holy Scripture Books", "Hinduism", "Yajurveda (यजुर्वेदः)", "krishna", "kandas", kandaDocId, "prashnas", prashnaDocId, "verses", verseDocId);
        batch.set(verseDocRef, {
          verse_number: verseNum,
          reference: verseRefStr,
          text: verse.text || verse.originalText || "",
          originalText: verse.originalText || verse.text || "",
          itx: verse.itx || verse.transliteration || "",
          transliteration: verse.transliteration || verse.itx || "",
          translation: verse.translation || verse.english || "",
          kanda_number: kandaNum,
          prashna_number: prashnaNum
        }, { merge: true });

        batchCount++;
        totalVerses++;

        if (batchCount >= 400) {
          await batch.commit();
          console.log(`  ⚡ Committed batch of ${batchCount} writes...`);
          batch = writeBatch(db);
          batchCount = 0;
        }
      }
    }
  }

  if (batchCount > 0) {
    await batch.commit();
    console.log(`  ⚡ Committed final batch of ${batchCount} writes...`);
  }

  console.log(`🎉 Successfully uploaded Krishna Yajurveda (${totalVerses} verses) to Firestore ('interfaith-108')!`);
}

uploadKrishnaYajurvedaWeb().then(() => {
  process.exit(0);
}).catch((err) => {
  console.error("❌ Web SDK Upload failed:", err);
  process.exit(1);
});
