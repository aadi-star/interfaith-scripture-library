import { initializeApp, getApps, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as fs from "fs";
import * as path from "path";

// 1. Initialize Firebase Admin using ADC (no key file needed)
const apps = getApps();
const adminApp = apps.length === 0 
  ? initializeApp({ credential: applicationDefault() }) 
  : apps[0];

// 2. Point to your specific database instance
const db = getFirestore(adminApp, "interfaith-108");

async function importJsonToFirestore() {
  // Path to your local JSON data file
  const jsonFilePath = path.join(__dirname, "data-to-import.json");
  
  if (!fs.existsSync(jsonFilePath)) {
    console.error(`❌ Error: Please place your data in a file named "data-to-import.json" in this directory.`);
    return;
  }

  console.log("Reading JSON data...");
  const rawData = fs.readFileSync(jsonFilePath, "utf8");
  const data = JSON.parse(rawData);

  // Loop through your JSON structure and write to Firestore.
  for (const [collectionName, documents] of Object.entries(data)) {
    console.log(`\nImporting collection: "${collectionName}"...`);
    const collectionRef = db.collection(collectionName);

    if (!Array.isArray(documents)) {
      console.error(`❌ Expected an array of documents for collection "${collectionName}", got ${typeof documents}`);
      continue;
    }

    for (const docData of documents as any[]) {
      // Use 'id' property as the document ID if present, otherwise let Firestore auto-generate one
      const docId = docData.id;
      const { id, ...cleanData } = docData;

      if (docId) {
        // Use doc(docId).set() to target the specific Document Name
        await collectionRef.doc(docId).set(cleanData);
        console.log(`  ✅ Written document: "${docId}"`);
      } else {
        const addedDoc = await collectionRef.add(cleanData);
        console.log(`  ✅ Written auto-ID document: "${addedDoc.id}"`);
      }
    }
  }

  console.log("\n🎉 JSON data import completed successfully!");
}

importJsonToFirestore().catch((err) => {
  console.error("❌ Import failed:", err.message);
});
