import fs from 'fs';

async function run() {
  const files = [
    'search_results_prayers.json',
    'search_results_terms.json',
    'judaism_page.html'
  ];

  for (const file of files) {
    if (fs.existsSync(file)) {
      console.log(`\n=== ${file} ===`);
      const content = fs.readFileSync(file, 'utf-8');
      if (file.endsWith('.json')) {
        try {
          const parsed = JSON.parse(content);
          console.log(JSON.stringify(parsed, null, 2).slice(0, 1500));
        } catch (e) {
          console.log("Error parsing JSON:", e.message);
        }
      } else {
        console.log(content.slice(0, 1000));
      }
    }
  }
}

run();
