import json
import re
from bs4 import BeautifulSoup

def de_accent_vedic(text):
    """
    Optional helper to remove Vedic accents (svara markers) if a cleaner Devanagari 
    version is desired. This removes common Vedic accent marks:
    - Udatta (vertical line above: U+1CDA or similar, or Devanagari acute accent U+0951)
    - Anudatta (horizontal line below: U+0952)
    - Independent Svarita (vertical line above: U+0951)
    """
    # U+0951 (Devanagari Svarita), U+0952 (Devanagari Anudatta), U+1CDA, U+1CDB, U+1CDC, etc.
    accents_pattern = re.compile(r'[\u0951\u0952\u1CD0-\u1CFF]')
    return accents_pattern.sub('', text)

def devanagari_to_latin_digits(devanagari_str):
    """
    Converts Devanagari numerals to standard Latin digits.
    """
    digit_map = {
        '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
        '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
    }
    return ''.join(digit_map.get(char, char) for char in devanagari_str)

def parse_rigveda_html(html_content):
    """
    Parses Rigveda HTML content, extracts all verses, and returns a structured list of verses.
    """
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Find the PRE tag containing the Vedic text
    pre_tag = soup.find('pre', id='content')
    if not pre_tag:
        # Fallback to any PRE tag with class 'vedic'
        pre_tag = soup.find('pre', class_='vedic')
    
    if not pre_tag:
        raise ValueError("Could not find the scripture container (<pre id='content'> or class='vedic').")

    # Get the raw text from the PRE tag
    raw_text = pre_tag.get_text()
    
    # Split the text into lines
    lines = raw_text.splitlines()
    
    verses = []
    current_verse_lines = []
    
    # Pattern to match the verse identifier, e.g., "॥ १.००१.०१" or similar
    # It contains Devanagari digits (०-९) and dots.
    identifier_pattern = re.compile(r'॥\s*([०-९\.]+)\s*$')

    for line in lines:
        line_str = line.strip()
        if not line_str:
            continue
        
        # Skip headings (e.g. "ऋग्वेदः मण्डलं १") or other non-verse markers
        if line_str.startswith('ऋग्वेदः') or line_str.startswith('Last updated') or line_str.startswith('Special mention'):
            continue
            
        match = identifier_pattern.search(line_str)
        if match:
            # This line contains the end of a verse and its identifier
            raw_id = match.group(1)
            latin_id = devanagari_to_latin_digits(raw_id)
            
            # Split ID parts: e.g. "1.001.01" -> mandala=1, sukta=1, verse=1
            id_parts = latin_id.split('.')
            mandala = int(id_parts[0]) if len(id_parts) > 0 else 1
            sukta = int(id_parts[1]) if len(id_parts) > 1 else 1
            verse_num = int(id_parts[2]) if len(id_parts) > 2 else 1
            
            # Extract the actual text of this line excluding the identifier and danda
            text_part = line_str[:match.start()].strip()
            # If the danda marker is still there, strip it
            text_part = text_part.rstrip('॥').strip()
            
            if text_part:
                current_verse_lines.append(text_part)
                
            # Combine all lines gathered for this verse
            verse_text_with_accents = " \n ".join(current_verse_lines)
            verse_text_clean = de_accent_vedic(verse_text_with_accents)
            
            verses.append({
                "id": latin_id,
                "mandala": mandala,
                "sukta": sukta,
                "verse": verse_num,
                "text_with_svara": verse_text_with_accents,
                "text_clean": verse_text_clean
            })
            
            # Reset for the next verse
            current_verse_lines = []
        else:
            # Regular line of verse, add to buffer
            current_verse_lines.append(line_str)
            
    return verses

if __name__ == "__main__":
    # Example usage:
    # Let's read a sample HTML file (e.g., judaism_page.html or similar if needed)
    # or write out a complete self-contained script.
    import sys
    
    # We will provide a simple demonstration reading from standard input or a sample string
    sample_html = """
    <PRE id="content" class="vedic">
    अ॒ग्निमी॑ळे पु॒रोहि॑तं य॒ज्ञस्य॑ दे॒वमृ॒त्विज॑म् ।
    होता॑रं रत्न॒धात॑मम् ॥ १.००१.०१
    अ॒ग्निः पूर्वे॑भि॒रृषि॑भि॒रीड्यो॒ नूत॑नैरु॒त ।
    स दे॒वाँ एह व॑क्षति ॥ १.००१.०२
    </PRE>
    """
    
    print("Parsing sample HTML...")
    parsed_verses = parse_rigveda_html(sample_html)
    print(json.dumps(parsed_verses, indent=2, ensure_ascii=False))
