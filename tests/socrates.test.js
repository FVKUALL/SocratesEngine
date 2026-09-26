const request = require('supertest');
const express = require('express');

// Mock server mini untuk uji otomatisasi pipa CRUD Masking
const createMockApp = () => {
  const app = express();
  app.use(express.json());
  let mockEnv = { OPENROUTER_KEY: 'sk-or-real-key-12345' };

  app.get('/api/test-mask', (req, res) => {
    res.json({ openrouter: '••••••••••••' + mockEnv.OPENROUTER_KEY.slice(-4) });
  });
  return app;
};

describe('Socrates Engine Security Automation Test Suite', () => {
  it('Harus berhasil melakukan Masking Key untuk perlindungan repositori publik', async () => {
    const app = createMockApp();
    const response = await request(app).get('/api/test-mask');
    
    expect(response.statusCode).toBe(200);
    expect(response.body.openrouter).toContain('••••••••••••');
    expect(response.body.openrouter).not.toContain('real-key-12345');
  });
});
