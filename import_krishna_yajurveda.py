#!/usr/bin/env python3
"""
Krishna Yajurveda Firestore Uploader Script
Database Target: interfaith-108
Firestore Hierarchy:
Holy Scripture Books (collection)
  └── Hinduism (document)
        └── Yajurveda (यजुर्वेदः) (subcollection)
              └── krishna (document)
                    └── kandas (subcollection) [e.g. kanda_1]
                          └── prashnas (subcollection) [e.g. prashna_1]
                                └── verses (subcollection) [e.g. verse_1]
"""

import json
import os
import sys
from google.cloud import firestore

DB_NAME = "interfaith-108"

def init_firestore():
    try:
        db = firestore.Client(database=DB_NAME)
        print(f"✅ Successfully initialized Firestore client for database: {DB_NAME}")
        return db
    except Exception as e:
        print(f"❌ Error initializing Firestore: {e}", file=sys.stderr)
        sys.exit(1)

def upload_krishna_yajurveda(db, json_filepath):
    if not os.path.exists(json_filepath):
        print(f"❌ Error: JSON file '{json_filepath}' not found.", file=sys.stderr)
        return

    with open(json_filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Base Document Reference for Krishna Yajurveda
    krishna_doc_ref = db.collection("Holy Scripture Books").document("Hinduism").collection("Yajurveda (यजुर्वेदः)").document("krishna")
    
    # Ensure krishna doc exists
    krishna_doc_ref.set({
        "title": "Krishna Yajurveda",
        "branch": "krishna",
        "originalTitle": "कृष्ण यजुर्वेदः",
        "structure": "kandas -> prashnas -> verses"
    }, merge=True)

    kandas = data.get("kandas", [])
    print(f"📦 Uploading Krishna Yajurveda ({len(kandas)} Kandas)...")

    batch = db.batch()
    count = 0

    for k_idx, kanda in enumerate(kandas, 1):
        kanda_num = kanda.get("kanda_number", k_idx)
        kanda_title = kanda.get("kanda_title", f"Kanda {kanda_num}")
        kanda_doc_id = f"kanda_{kanda_num}"
        
        kanda_doc_ref = krishna_doc_ref.collection("kandas").document(kanda_doc_id)
        batch.set(kanda_doc_ref, {
            "kanda_number": kanda_num,
            "title": kanda_title,
            "number": kanda_num
        }, merge=True)
        count += 1

        prashnas = kanda.get("prashnas", [])
        for p_idx, prashna in enumerate(prashnas, 1):
            prashna_num = prashna.get("prashna_number", p_idx)
            prashna_title = prashna.get("prashna_title", f"Prashna {prashna_num}")
            prashna_doc_id = f"prashna_{prashna_num}"

            prashna_doc_ref = kanda_doc_ref.collection("prashnas").document(prashna_doc_id)
            batch.set(prashna_doc_ref, {
                "prashna_number": prashna_num,
                "title": prashna_title,
                "number": prashna_num,
                "kanda_number": kanda_num
            }, merge=True)
            count += 1

            verses = prashna.get("verses", [])
            for v_idx, verse in enumerate(verses, 1):
                verse_num = verse.get("verse_number", v_idx)
                verse_doc_id = f"verse_{verse_num}"
                verse_ref_str = verse.get("reference", f"{kanda_num}.{prashna_num}.{verse_num}")

                verse_doc_ref = prashna_doc_ref.collection("verses").document(verse_doc_id)
                batch.set(verse_doc_ref, {
                    "verse_number": verse_num,
                    "reference": verse_ref_str,
                    "text": verse.get("text", verse.get("originalText", "")),
                    "originalText": verse.get("originalText", verse.get("text", "")),
                    "itx": verse.get("itx", verse.get("transliteration", "")),
                    "transliteration": verse.get("transliteration", verse.get("itx", "")),
                    "translation": verse.get("translation", verse.get("english", "")),
                    "kanda_number": kanda_num,
                    "prashna_number": prashna_num
                }, merge=True)
                count += 1

                if count >= 400:
                    batch.commit()
                    print(f"  ⚡ Committed batch of {count} operations...")
                    batch = db.batch()
                    count = 0

    if count > 0:
        batch.commit()
        print(f"  ⚡ Committed final batch of {count} operations...")

    print("🎉 Krishna Yajurveda uploaded successfully to Firestore!")

if __name__ == "__main__":
    json_path = "krishna_yajurveda_raw.json"
    if len(sys.argv) > 1:
        json_path = sys.argv[1]

    if not os.path.exists(json_path):
        # Create a sample raw JSON file if none exists
        sample_krishna = {
            "branch": "krishna",
            "kandas": [
                {
                    "kanda_number": 1,
                    "kanda_title": "Kanda 1 (Prapathaka 1)",
                    "prashnas": [
                        {
                            "prashna_number": 1,
                            "prashna_title": "Prashna 1",
                            "verses": [
                                {
                                    "verse_number": 1,
                                    "reference": "1.1.1",
                                    "text": "इ॒षे त्वा॑ ऊ॒र्जे त्वा॑ वा॒यवः॑ स्थ दे॒वो वः॑ सवि॒ता प्रार्प॑यतु॒ श्रेष्ठ॑तमाय॒ कर्म॑णे ।",
                                    "transliteration": "iṣe tvā ūrje tvā vāyavaḥ stha devo vaḥ savitā prārpayatu śreṣṭhatamāya karmaṇe |",
                                    "translation": "For sap thee, for juice thee! Ye are winds. May God Savitar impel you to the highest work!"
                                },
                                {
                                    "verse_number": 2,
                                    "reference": "1.1.2",
                                    "text": "आप्या॑यध्वमघ्निया देवभा॒गमूर्ज॑स्वतीः॒ पय॑स्वतीः प्र॒जाव॑तीरनमी॒वा अ॑य॒क्ष्माः ।",
                                    "transliteration": "āpyāyadhvamaghniyā devabhāgamūrjasvatīḥ payasvatīḥ prajāvatīranamīvā ayakṣmāḥ |",
                                    "translation": "Swell, O ye inviolable ones, for the portion of the Gods, full of juice, full of milk, rich in offspring, free from disease, free from sickness!"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(sample_krishna, f, indent=2, ensure_ascii=False)
        print(f"📝 Created sample JSON file: '{json_path}'")

    db_client = init_firestore()
    upload_krishna_yajurveda(db_client, json_path)
