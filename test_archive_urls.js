import https from 'https';

const urls = {
  shema_yisrael: {
    url: "https://archive.org/download/shema-yisrael-hebrew-monastic-chant/shema_yisrael.mp3",
    backupUrl: "https://archive.org/download/ShemaYisraelChant/shema.mp3"
  },
  modeh_ani: {
    url: "https://archive.org/download/modeh-ani-jewish-morning-prayer/modeh_ani.mp3",
    backupUrl: "https://archive.org/download/ModehAniMelody/modeh_ani.mp3"
  },
  hamotzi: {
    url: "https://archive.org/download/jewish-blessing-hamotzi-bread/hamotzi.mp3",
    backupUrl: "https://archive.org/download/HamotziBlessing/hamotzi.mp3"
  },
  hagafen: {
    url: "https://archive.org/download/jewish-blessing-hagafen-wine/hagafen.mp3",
    backupUrl: "https://archive.org/download/HagafenBlessing/hagafen.mp3"
  },
  birkat_kohanim: {
    url: "https://archive.org/download/priestly-blessing-birkat-kohanim/birkat_kohanim.mp3",
    backupUrl: "https://archive.org/download/BirkatKohanimBlessing/priestly_blessing.mp3"
  },
  tefilat_haderech: {
    url: "https://archive.org/download/tefilat-haderech-travelers-prayer/tefilat_haderech.mp3",
    backupUrl: "https://archive.org/download/TravelersPrayerJewish/tefilat_haderech.mp3"
  }
};

function testUrl(name, type, url) {
  return new Promise((resolve) => {
    const options = {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://archive.org/'
      }
    };
    const req = https.request(url, options, (res) => {
      console.log(`[${name}] ${type}: Status ${res.statusCode}, Content-Type: ${res.headers['content-type']}, Content-Length: ${res.headers['content-length']}`);
      resolve({ success: res.statusCode >= 200 && res.statusCode < 400, status: res.statusCode, headers: res.headers });
    });
    req.on('error', (err) => {
      console.log(`[${name}] ${type}: Error ${err.message}`);
      resolve({ success: false, error: err.message });
    });
    req.setTimeout(5000, () => {
      console.log(`[${name}] ${type}: Timeout`);
      req.destroy();
      resolve({ success: false, error: 'Timeout' });
    });
    req.end();
  });
}

async function run() {
  for (const [name, val] of Object.entries(urls)) {
    await testUrl(name, 'primary', val.url);
    await testUrl(name, 'backup', val.backupUrl);
    console.log('---');
  }
}

run();
