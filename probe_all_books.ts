import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import * as fs from "fs";

const config = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf8"));

const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "interfaith-108");

async function probeBooks() {
  console.log("Listing documents in root collection 'Holy Scripture Books'...");
  const rootCol = collection(db, "Holy Scripture Books");
  const snap = await getDocs(rootCol);
  console.log(`Found ${snap.size} documents in root collection.`);
  for (const doc of snap.docs) {
    console.log(`- Document ID: "${doc.id}" | Data:`, JSON.stringify(doc.data()));
    
    // Let's check if it has subcollections by trying common names
    const subcols = ["chapters", "divisions", "verses", "Hinduism"];
    for (const sub of subcols) {
      try {
        const subSnap = await getDocs(collection(doc.ref, sub));
        if (!subSnap.empty) {
          console.log(`  -> Has subcollection "${sub}" with ${subSnap.size} documents.`);
          if (sub === "Hinduism") {
             // probe inside Hinduism
             for (const hDoc of subSnap.docs) {
                console.log(`     - Hinduism Sub-Document: "${hDoc.id}"`);
                const hSubcols = ["Bhagavad Gita", "Bhagavad Gita (श्रीमद्भगवद्गीता)", "bhagavad_gita"];
                for (const hSub of hSubcols) {
                   const hSubSnap = await getDocs(collection(hDoc.ref, hSub));
                   if (!hSubSnap.empty) {
                      console.log(`       -> Has subcollection "${hSub}" with ${hSubSnap.size} documents.`);
                   }
                }
             }
          }
        }
      } catch (e: any) {
        // ignore
      }
    }
  }
}

probeBooks().catch(console.error);
