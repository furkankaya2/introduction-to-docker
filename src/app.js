const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Basit bir JSON response
app.get('/', (req, res) => {
  res.json({
    message: 'Merhaba! GitHub Actions ile otomatik deploy edildi! 🚀',
    version: process.env.APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    commit: process.env.GITHUB_SHA || 'local'
  });
});

// Health check endpoint (Docker için önemli!)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// API bilgi endpoint
app.get('/api/info', (req, res) => {
  res.json({
    name: 'GitHub Actions Demo API',
    version: '1.0.0',
    endpoints: [
      { path: '/', method: 'GET', description: 'Ana sayfa' },
      { path: '/health', method: 'GET', description: 'Sağlık kontrolü' },
      { path: '/api/info', method: 'GET', description: 'API bilgileri' }
    ]
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint bulunamadı',
    path: req.path,
    suggestion: 'Kullanılabilir endpoint\'ler için /api/info adresini ziyaret edin'
  });
});

// Sadece direkt çalıştırıldığında server başlat (test için değil)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server ${PORT} portunda çalışıyor`);
    console.log(`📍 http://localhost:${PORT}`);
    console.log(`💚 Health check: http://localhost:${PORT}/health`);
  });
}

// Test için export et
module.exports = app;
