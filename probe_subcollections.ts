import { initializeApp } from "firebase/app";
import { getFirestore, doc, collection, getDocs } from "firebase/firestore";
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

async function probeSubcollections() {
  const docRef = doc(db, "Holy Scripture Books", "Hinduism");
  
  // In the Web SDK, we cannot list subcollections directly.
  // But we can test querying them by various potential names.
  const possibleNames = [
    "Bhagavad Gita",
    "Bhagavad Gita (श्रीमद्भगवद्गीता)",
    "bhagavad_gita",
    "Gita",
    "gita",
    "chapters",
    "divisions",
    "verses",
    "Hinduism"
  ];
  
  for (const name of possibleNames) {
    try {
      const colRef = collection(docRef, name);
      const snap = await getDocs(colRef);
      console.log(`Subcollection "${name}": empty = ${snap.empty}, size = ${snap.size}`);
      if (!snap.empty) {
        console.log(`  -> First doc ID: "${snap.docs[0].id}" | Data:`, JSON.stringify(snap.docs[0].data()));
        
        // If it's chapters, let's look at chapter 1
        if (name === "Bhagavad Gita (श्रीमद्भगवद्गीता)" || name === "Bhagavad Gita" || name === "bhagavad_gita") {
          for (const chDoc of snap.docs) {
            const versesCol = collection(chDoc.ref, "verses");
            const vSnap = await getDocs(versesCol);
            console.log(`    -> Chapter ID "${chDoc.id}" has subcollection "verses" with size = ${vSnap.size}`);
          }
        }
      }
    } catch (e: any) {
      console.log(`Error querying "${name}":`, e.message);
    }
  }
}

probeSubcollections().catch(console.error);
