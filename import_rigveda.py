#!/usr/bin/env python3
"""
Rigveda JSON to Firestore Importer Script
This script parses Rigveda JSON data and imports it into a Firestore collection
called 'scripture_verses', categorizing each verse under the 'rigveda' book.
"""

import os
import json
import sys
from google.cloud import firestore

# Initialize Firestore Client
# In the Cloud Run environment or with GOOGLE_APPLICATION_CREDENTIALS set,
# the client will automatically authenticate.
PROJECT_ID = "ai-studio-b2e32fdd-3ee5-4e14-94e3-fcb48f44bdfa"

def init_firestore():
    try:
        # Connect to your specific Firestore database
        db = firestore.Client(project=PROJECT_ID)
        print(f"Successfully initialized Firestore client for Project ID: {PROJECT_ID}")
        return db
    except Exception as e:
        print(f"Error initializing Firestore: {e}", file=sys.stderr)
        print("Please ensure your Google Cloud credentials or service account key is configured.", file=sys.stderr)
        sys.exit(1)

def import_verses(db, json_filepath):
    if not os.path.exists(json_filepath):
        print(f"Error: JSON file '{json_filepath}' not found.", file=sys.stderr)
        sys.exit(1)

    try:
        with open(json_filepath, 'r', encoding='utf-8') as f:
            verses_data = json.load(f)
    except Exception as e:
        print(f"Failed to read/parse JSON file: {e}", file=sys.stderr)
        sys.exit(1)

    if not isinstance(verses_data, list):
        print("Error: JSON root must be a list of verses.", file=sys.stderr)
        sys.exit(1)

    print(f"Starting import of {len(verses_data)} Rigveda verses into Firestore...")
    
    batch = db.batch()
    batch_size = 500  # Firestore supports up to 500 operations in a single batch write
    count = 0

    for item in verses_data:
        # Standardize coordinates
        verse_id = item.get("id")  # e.g., "1.001.01"
        mandala = item.get("mandala", 1)
        sukta = item.get("sukta", 1)
        verse_num = item.get("verse", 1)
        
        text_with_svara = item.get("text_with_svara", "")
        text_clean = item.get("text_clean", "")
        translation = item.get("translation", "English Translation Placeholder (or translated by AI)")
        transliteration = item.get("transliteration", "Phonetic transliteration...")

        # Document Path: /scriptures/rigveda/verses/{verse_id}
        doc_ref = db.collection("scriptures").document("rigveda").collection("verses").document(verse_id)
        
        # Prepare verse payload
        payload = {
            "id": verse_id,
            "mandala": mandala,
            "sukta": sukta,
            "verse": verse_num,
            "originalText": text_with_svara,       # Keep accented Sanskrit
            "cleanText": text_clean,             # Keep clean Sanskrit
            "transliteration": transliteration,
            "translation": translation,
            "bookKey": "rigveda",
            "religion": "hinduism"
        }
        
        batch.set(doc_ref, payload)
        count += 1
        
        # Commit batch when limit is reached
        if count % batch_size == 0:
            batch.commit()
            print(f"Committed {count} verses...")
            batch = db.batch()

    # Commit any remaining operations
    if count % batch_size != 0:
        batch.commit()
    
    print(f"Import complete! Successfully imported {count} verses into Firestore.")

if __name__ == "__main__":
    # Create a small sample JSON file to import if one does not exist
    sample_filename = "sample_rigveda_data.json"
    if not os.path.exists(sample_filename):
        sample_data = [
            {
                "id": "1.001.01",
                "mandala": 1,
                "sukta": 1,
                "verse": 1,
                "text_with_svara": "अ॒ग्निमी॑ळे पु॒रोहि॑तं य॒ज्ञस्य॑ दे॒वमृ॒त्विज॑म् ।",
                "text_clean": "अग्निमीळे पुरोहितं यज्ञस्य देवमृत्विजम् ।",
                "transliteration": "agnimīḷe purohitaṁ yajñasya devamṛtvijam |",
                "translation": "I laud Agni, the chosen Priest, God, minister of sacrifice..."
            },
            {
                "id": "1.001.02",
                "mandala": 1,
                "sukta": 1,
                "verse": 2,
                "text_with_svara": "अ॒ग्निः पूर्वे॑भि॒रृषि॑भि॒रीड्यो॒ नूत॑नैरु॒त ।",
                "text_clean": "अग्निः पूर्वेभिरृषिभिरीड्यो नूतनैरुत ।",
                "transliteration": "agniḥ pūrvebhirṛṣibhirīḍyo nūtanairuta |",
                "translation": "Worthy is Agni to be praised by an ancient seer and by the new..."
            }
        ]
        with open(sample_filename, 'w', encoding='utf-8') as f:
            json.dump(sample_data, f, indent=2, ensure_ascii=False)
        print(f"Created a sample JSON data file: {sample_filename}")

    # Initialize client and run the import
    firestore_db = init_firestore()
    import_verses(firestore_db, sample_filename)
