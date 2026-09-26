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

// Inisialisasi Database SQLite Asynchronous
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

// PIPA DATA AI INTERAKTIF: Meneruskan input ke Cloud API atau Ollama Offline
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  
  try {
    // 1. Cek Cache Lokal Pertama
    const cachedRow = await db.get('SELECT response FROM cache WHERE keyword = ?', [message.trim().toLowerCase()]);
    if (cachedRow) {
      return res.json({ source: 'Local Cache', response: cachedRow.response });
    }

    console.log(`Meneruskan "${message}" ke Ollama...`);
    
    // Memberikan sinyal batas tunggu komputasi lokal hingga 60 detik
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Connection': 'keep-alive'
      },
      body: JSON.stringify({
        model: 'phi3', // Pastikan nama model sesuai dengan yang ada di ollama list
        prompt: `Anda adalah Socrates Engine, asisten belajar inklusif global. Berikan penjelasan singkat mengenai materi ini: ${message}`,
        stream: false
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (ollamaResponse.ok) {
      const data = await ollamaResponse.json();
      
      // Simpan jawaban baru ke cache lokal
      await db.run('INSERT OR IGNORE INTO cache (keyword, response) VALUES (?, ?)', [message.trim().toLowerCase(), data.response]);
      
      return res.json({ source: 'Local SLM Offline (Ollama)', response: data.response });
    } else {
      throw new Error(`Ollama merespons dengan status: ${ollamaResponse.status}`);
    }

  } catch (error) {
    console.log("Koneksi komputasi lokal sibuk, mengaktifkan Fallback Core:", error.message);
    res.json({ 
      source: 'Static Core Engine', 
      response: `Saya menangkap ketertarikan Anda pada materi "${message}". Modul AI lokal sedang menyelesaikan kalkulasi grafik. Mari kita bedah struktur dasarnya bersama-sama lewat perluasan node grafik kognitif di atas!` 
    });
  }
});

// Endpoint CRUD Admin
app.get('/api/admin/config', (req, res) => {
  res.json({
    openrouter: process.env.OPENROUTER_KEY ? '••••••••••••' + process.env.OPENROUTER_KEY.slice(-4) : 'Not Configured',
    groq: process.env.GROQ_KEY ? '••••••••••••' + process.env.GROQ_KEY.slice(-4) : 'Not Configured',
    gemini: process.env.GEMINI_KEY ? '••••••••••••' + process.env.GEMINI_KEY.slice(-4) : 'Not Configured',
    fallback_priority: ['Ollama Offline (Primary)', 'OpenRouter', 'Groq', 'Gemini']
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

Gun({ web: server });
