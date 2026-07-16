import http from 'http';

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

function testProxy(name, url, backup) {
  return new Promise((resolve) => {
    const proxyUrl = `http://localhost:3000/api/audio-proxy?url=${encodeURIComponent(url)}&backup=${encodeURIComponent(backup)}`;
    console.log(`[Proxy Test] Requesting ${name} via proxy: ${proxyUrl}`);
    const req = http.get(proxyUrl, { headers: { Range: 'bytes=0-100' } }, (res) => {
      console.log(`[Proxy Test] [${name}] Status: ${res.statusCode}`);
      console.log(`  Headers: Content-Type: ${res.headers['content-type']}, Content-Length: ${res.headers['content-length']}, Content-Range: ${res.headers['content-range']}`);
      res.resume();
      resolve(res.statusCode);
    });
    req.on('error', (err) => {
      console.log(`[Proxy Test] [${name}] Connection Error: ${err.message}`);
      resolve(500);
    });
    req.setTimeout(8000, () => {
      console.log(`[Proxy Test] [${name}] Timeout`);
      req.destroy();
      resolve(504);
    });
  });
}

async function run() {
  for (const [name, val] of Object.entries(urls)) {
    await testProxy(name, val.url, val.backupUrl);
    console.log('---');
  }
}

run();
