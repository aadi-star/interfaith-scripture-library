import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, collectionGroup } from "firebase/firestore";
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

async function find19Verses() {
  console.log("Searching Firestore for any Bhagavad Gita data with exactly 19 verses, or checking what paths exist...");
  
  // Let's search inside collectionGroup('verses') to see what documents are there
  try {
    const versesGroup = collectionGroup(db, "verses");
    const snap = await getDocs(versesGroup);
    console.log(`Total 'verses' collectionGroup size: ${snap.size}`);
    
    // Group by path parent
    const pathsCount: Record<string, number> = {};
    for (const d of snap.docs) {
      const parentPath = d.ref.parent.path;
      pathsCount[parentPath] = (pathsCount[parentPath] || 0) + 1;
    }
    
    console.log("\nSummary of parent paths containing 'verses':");
    for (const [p, count] of Object.entries(pathsCount)) {
      console.log(`- Path: "${p}" has ${count} verses.`);
    }
  } catch (e: any) {
    console.error("Error querying collectionGroup 'verses':", e.message);
  }
}

find19Verses().catch(console.error);
