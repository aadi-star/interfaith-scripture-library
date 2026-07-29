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

async function checkAllVerses() {
  console.log("Checking verses under 'Holy Scripture Books/Hinduism/Bhagavad Gita (श्रीमद्भगवद्गीता)/chapter_1/verses'...");
  const colRef = collection(db, "Holy Scripture Books", "Hinduism", "Bhagavad Gita (श्रीमद्भगवद्गीता)", "chapter_1", "verses");
  const snap = await getDocs(colRef);
  
  console.log(`Successfully fetched ${snap.size} verse documents.`);
  const allDocs = snap.docs.map(doc => ({
    id: doc.id,
    data: doc.data()
  }));
  
  // Sort by id for clear inspection
  allDocs.sort((a, b) => {
    const numA = parseInt(a.id.replace(/[^\d]/g, "")) || 0;
    const numB = parseInt(b.id.replace(/[^\d]/g, "")) || 0;
    return numA - numB;
  });

  allDocs.forEach((doc, i) => {
    console.log(`[${i + 1}] ID: "${doc.id}" | Data:`, JSON.stringify(doc.data));
  });
}

checkAllVerses().catch(console.error);
