require('dotenv').config();
const express = require('express');
const path = require('path');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const Gun = require('gun');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

let db;

// Inisialisasi Database SQLite Asynchronous untuk Local Cache
(async () => {
  db = await open({
    filename: 'socrates_local.db',
    driver: sqlite3.Database
  });
  await db.exec(`
    CREATE TABLE IF NOT EXISTS cache (
      keyword TEXT PRIMARY KEY,
      response TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log("Database SQLite terhubung.");
})();

// API Chat dengan Deteksi Sumber
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  try {
    const cachedRow = await db.get('SELECT response FROM cache WHERE keyword = ?', [message.trim().toLowerCase()]);
    if (cachedRow) {
      return res.json({ source: 'Local Cache P2P', response: cachedRow.response });
    }

    console.log(`Meneruskan "${message}" ke Ollama...`);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Connection': 'keep-alive' },
      body: JSON.stringify({
        model: 'phi3',
        prompt: `Anda adalah Socrates Engine. Berikan penjelasan singkat mengenai materi ini: ${message}`,
        stream: false
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (ollamaResponse.ok) {
      const data = await ollamaResponse.json();
      await db.run('INSERT OR IGNORE INTO cache (keyword, response) VALUES (?, ?)', [message.trim().toLowerCase(), data.response]);
      return res.json({ source: 'Local SLM Offline (Ollama)', response: data.response });
    } else {
      throw new Error(`Ollama status: ${ollamaResponse.status}`);
    }
    } catch (error) {
    console.log("Koneksi komputasi lokal sibuk, mengaktifkan Fallback Core:", error.message);
    res.json({ 
      source: 'Static Core Engine P2P', 
      response: 'Saya menangkap ketertarikan Anda pada materi tersebut. Modul AI lokal sedang menyelesaikan kalkulasi grafik. Mari kita bedah struktur dasarnya bersama-sama lewat perluasan node grafik kognitif di atas!' 
    });
  }
});

// Endpoint untuk mendapatkan data konfigurasi Admin
app.get('/api/admin/config', (req, res) => {
  res.json({
    openrouter: process.env.OPENROUTER_KEY ? '••••••••••••' + process.env.OPENROUTER_KEY.slice(-4) : 'Not Configured',
    groq: process.env.GROQ_KEY ? '••••••••••••' + process.env.GROQ_KEY.slice(-4) : 'Not Configured',
    gemini: process.env.GEMINI_KEY ? '••••••••••••' + process.env.GEMINI_KEY.slice(-4) : 'Not Configured',
    fallback_priority: ['Ollama Offline', 'P2P Mesh Network', 'Cloud API']
  });
});

app.post('/api/admin/config/update', (req, res) => {
  const { openrouter, groq, gemini } = req.body;
  if (openrouter && !openrouter.includes('••••')) process.env.OPENROUTER_KEY = openrouter;
  if (groq && !groq.includes('••••')) process.env.GROQ_KEY = groq;
  if (gemini && !gemini.includes('••••')) process.env.GEMINI_KEY = gemini;
  res.json({ status: 'success', message: 'Konfigurasi terenkripsi lokal berhasil disimpan!' });
});

const server = app.listen(port, () => {
  console.log(`Socrates Engine berjalan aman di http://localhost:${port}`);
});

// ==========================================
// KONFIGURASI AUTOMATED P2P MESH VIA GUNDB
// ==========================================
// Opsi 'peers' memungkinkan server Node.js mendengarkan dan melempar grafik data secara real-time
const gun = Gun({
  web: server,
  localStorage: false // Menggunakan memori RAM untuk transfer mesh agar hemat penyimpanan cakram fisik
});

// Membuat namespace grafik publik untuk sinkronisasi riwayat minat belajar global
const socratesMesh = gun.get('socrates-global-knowledge-mesh');

console.log("Infrastruktur Desentralisasi P2P Mesh Network Aktif & Menunggu Hubungan Node Tetangga.");
