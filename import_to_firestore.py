import json
import os
import re
from google.cloud import firestore

def clean_and_parse_json(file_path):
    """
    Reads the raw input file, automatically corrects any syntax errors
    (such as the missing 'chapters' key or naked float verse numbers),
    and parses it into a valid Python dictionary.
    """
    print(f"📖 Reading raw data from '{file_path}'...")
    with open(file_path, "r", encoding="utf-8") as f:
        raw_text = f.read()

    # 1. Fix the malformed chapters list bracket:
    # "id": "Bhagavad Gita (श्रीमद्भगवद्गीता)", [ -> "id": "Bhagavad Gita (श्रीमद्भगवद्गीता)", "chapters": [
    corrected_text = re.sub(
        r'"id"\s*:\s*("Bhagavad Gita\s*\([^)]+\)")\s*,\s*\[',
        r'"id": \1, "chapters": [',
        raw_text
    )

    # 2. Convert raw verse numbers (floats) into strings in the JSON text to prevent decimal truncation
    # e.g., "verse_number": 1.10 -> "verse_number": "1.10"
    corrected_text = re.sub(
        r'"verse_number"\s*:\s*([0-9\.]+)',
        r'"verse_number": "\1"',
        corrected_text
    )

    # 3. Parse the cleaned JSON text
    try:
        data = json.loads(corrected_text)
        print("✅ Raw JSON successfully cleaned and parsed!")
        return data
    except json.JSONDecodeError as e:
        print(f"❌ JSON Parsing failed after cleaning: {e}")
        # Print surrounding context of the error to help debug
        start_idx = max(0, e.pos - 100)
        end_idx = min(len(corrected_text), e.pos + 100)
        print("\n--- Error Context ---")
        print(corrected_text[start_idx:end_idx])
        print("---------------------\n")
        raise e

def upload_gita_to_firestore():
    # File name of your raw pasted data
    raw_file_path = "gita-raw.json"

    if not os.path.exists(raw_file_path):
        # Fall back to data-to-import.json if gita-raw.json is not present
        if os.path.exists("data-to-import.json"):
            raw_file_path = "data-to-import.json"
        else:
            print("❌ Error: Please place your pasted text into a file named 'gita-raw.json' in this directory.")
            return

    try:
        parsed_data = clean_and_parse_json(raw_file_path)
    except Exception:
        return

    # Initialize Firestore Client targeting the specific database
    print("\n⚡ Connecting to Firestore ('interfaith-108')...")
    db = firestore.Client(database="interfaith-108")

    # Access the main "Holy Scripture Books" list
    holy_books = parsed_data.get("Holy Scripture Books", [])
    if not holy_books:
        print("❌ Error: No 'Holy Scripture Books' list found in the JSON.")
        return

    # Loop through each scripture book (normally just Bhagavad Gita)
    for book in holy_books:
        book_id_raw = book.get("id", "Bhagavad Gita (श्रीमद्भगवद्गीता)")
        chapters = book.get("chapters", [])

        print(f"\nProcessing Book: '{book_id_raw}' with {len(chapters)} chapters...")

        # We map this to the standard document key 'bhagavad_gita' as expected by the app
        book_key = "bhagavad_gita"
        
        # Reference the parent document
        book_ref = db.collection("scriptures").document(book_key)
        
        # Update or set parent book metadata
        book_ref.set({
            "key": book_key,
            "title": "Bhagavad Gita",
            "originalTitle": "भगवद्गीता",
            "religion": "hinduism",
            "divisionsName": "Chapter",
            "divisionsCount": 18
        }, merge=True)

        # Reference the subcollection 'verses' under the book document
        verses_col_ref = book_ref.collection("verses")

        # Let's write each verse
        total_verses_uploaded = 0
        batch = db.batch()
        batch_count = 0

        for chapter in chapters:
            ch_num_raw = chapter.get("chapter_number")
            ch_title = chapter.get("chapter_title", "")
            verses = chapter.get("verses", [])

            # Make sure chapter number is an integer
            try:
                ch_num = int(float(ch_num_raw)) if ch_num_raw is not None else 1
            except ValueError:
                ch_num = 1

            print(f"  Uploading Chapter {ch_num}: '{ch_title}' ({len(verses)} verses)...")

            for verse_data in verses:
                verse_num_raw = verse_data.get("verse_number", "")
                text_content = verse_data.get("text", "")

                # If verse_number is in the form of "1.10", we can split on '.' to extract the verse part "10"
                if isinstance(verse_num_raw, str) and "." in verse_num_raw:
                    parts = verse_num_raw.split(".")
                    verse_num = parts[-1]
                else:
                    verse_num = str(verse_num_raw)

                # Generate a clean, unique Document ID for the verse (e.g., "1_10")
                verse_doc_id = f"{ch_num}_{verse_num}"

                # Standard fields expected by fetchScriptureFromFirestore in your app
                doc_payload = {
                    "chapter": ch_num,
                    "chapter_title": ch_title,
                    "verse": verse_num,
                    "number": verse_num,
                    "originalText": text_content,
                    "text": text_content,
                    "bookKey": book_key,
                    "transliteration": "",
                    "translation": ""
                }

                # Queue set operation in the current batch
                doc_ref = verses_col_ref.document(verse_doc_id)
                batch.set(doc_ref, doc_payload)
                
                batch_count += 1
                total_verses_uploaded += 1

                # Commit in batches of 400 documents (Firestore limit is 500)
                if batch_count >= 400:
                    print(f"    ⚡ Committing batch of {batch_count} verses...")
                    batch.commit()
                    batch = db.batch()
                    batch_count = 0

        # Commit any remaining queued writes
        if batch_count > 0:
            print(f"    ⚡ Committing final batch of {batch_count} verses...")
            batch.commit()

        print(f"  ✅ Successfully imported {total_verses_uploaded} verses for '{book_key}'!")

    print("\n🎉 Firestore database upload completed successfully!")

if __name__ == "__main__":
    upload_gita_to_firestore()
