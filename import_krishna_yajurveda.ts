import { initializeApp, getApps, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin using ADC
const apps = getApps();
const adminApp = apps.length === 0 
  ? initializeApp({ credential: applicationDefault() }) 
  : apps[0];

// Target specific database instance 'interfaith-108'
const db = getFirestore(adminApp, "interfaith-108");

export async function uploadKrishnaYajurveda() {
  const jsonFilePath = path.join(__dirname, "krishna_yajurveda_raw.json");

  let data: any = null;

  if (fs.existsSync(jsonFilePath)) {
    console.log(`📖 Reading Krishna Yajurveda data from '${jsonFilePath}'...`);
    const rawText = fs.readFileSync(jsonFilePath, "utf8");
    data = JSON.parse(rawText);
  } else {
    console.log("📝 No 'krishna_yajurveda_raw.json' found. Creating sample dataset...");
    data = {
      branch: "krishna",
      kandas: [
        {
          kanda_number: 1,
          kanda_title: "Kanda 1 (Prapathaka 1)",
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
    fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2), "utf8");
  }

  const krishnaDocRef = db.collection("Holy Scripture Books")
    .doc("Hinduism")
    .collection("Yajurveda (यजुर्वेदः)")
    .doc("krishna");

  await krishnaDocRef.set({
    title: "Krishna Yajurveda",
    branch: "krishna",
    originalTitle: "कृष्ण यजुर्वेदः",
    structure: "kandas -> prashnas -> verses"
  }, { merge: true });

  const kandas = data.kandas || [];
  console.log(`⚡ Processing ${kandas.length} Kandas for Krishna Yajurveda...`);

  let batch = db.batch();
  let batchCount = 0;
  let totalUploaded = 0;

  for (let kIdx = 0; kIdx < kandas.length; kIdx++) {
    const kanda = kandas[kIdx];
    const kandaNum = kanda.kanda_number || (kIdx + 1);
    const kandaTitle = kanda.kanda_title || `Kanda ${kandaNum}`;
    const kandaDocId = `kanda_${kandaNum}`;

    const kandaDocRef = krishnaDocRef.collection("kandas").doc(kandaDocId);
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

      const prashnaDocRef = kandaDocRef.collection("prashnas").doc(prashnaDocId);
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

        const verseDocRef = prashnaDocRef.collection("verses").doc(verseDocId);
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
        totalUploaded++;

        if (batchCount >= 400) {
          await batch.commit();
          console.log(`  ⚡ Committed batch of ${batchCount} operations...`);
          batch = db.batch();
          batchCount = 0;
        }
      }
    }
  }

  if (batchCount > 0) {
    await batch.commit();
    console.log(`  ⚡ Committed final batch of ${batchCount} operations...`);
  }

  console.log(`🎉 Successfully uploaded Krishna Yajurveda (${totalUploaded} verses) to Firestore!`);
}

uploadKrishnaYajurveda().catch((err) => {
  console.error("❌ Upload failed:", err);
});
