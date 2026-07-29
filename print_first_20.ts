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

async function checkFirst20() {
  const colRef = collection(db, "Holy Scripture Books", "Hinduism", "Bhagavad Gita (श्रीमद्भगवद्गीता)", "chapter_1", "verses");
  const snap = await getDocs(colRef);
  
  const allDocs = snap.docs.map(doc => ({
    id: doc.id,
    data: doc.data()
  }));
  
  allDocs.sort((a, b) => {
    const numA = parseInt(a.id.replace(/[^\d]/g, "")) || 0;
    const numB = parseInt(b.id.replace(/[^\d]/g, "")) || 0;
    return numA - numB;
  });

  console.log(`Showing first 25 documents (out of ${allDocs.length}):`);
  allDocs.slice(0, 25).forEach((doc, i) => {
    console.log(`[${i + 1}] ID: "${doc.id}" | verse_number: ${doc.data.verse_number} | Text: ${doc.data.text ? doc.data.text.substring(0, 50) + "..." : "NONE"}`);
  });
}

checkFirst20().catch(console.error);
