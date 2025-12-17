const app = require('./app');
const http = require('http');

// Basit test framework (external dependency olmadan)
async function runTests() {
  console.log('🧪 Testler başlıyor...\n');
  
  const server = app.listen(3001);
  let failedTests = 0;
  
  try {
    // Test 1: Ana endpoint
    await test('Ana endpoint JSON response döndürüyor', async () => {
      const response = await makeRequest('http://localhost:3001/');
      if (!response.message) {
        throw new Error('Response message içermiyor');
      }
      if (!response.version) {
        throw new Error('Response version içermiyor');
      }
    });
    
    // Test 2: Health check
    await test('Health check endpoint çalışıyor', async () => {
      const response = await makeRequest('http://localhost:3001/health');
      if (response.status !== 'healthy') {
        throw new Error(`Beklenen: healthy, Gelen: ${response.status}`);
      }
      if (typeof response.uptime !== 'number') {
        throw new Error('Uptime number değil');
      }
    });
    
    // Test 3: API info
    await test('API info endpoint doğru bilgi veriyor', async () => {
      const response = await makeRequest('http://localhost:3001/api/info');
      if (!response.name) {
        throw new Error('API name bilgisi yok');
      }
      if (!Array.isArray(response.endpoints)) {
        throw new Error('Endpoints array değil');
      }
      if (response.endpoints.length !== 3) {
        throw new Error(`3 endpoint bekleniyor, ${response.endpoints.length} bulundu`);
      }
    });
    
    // Test 4: 404 handler
    await test('Bilinmeyen endpoint 404 döndürüyor', async () => {
      const response = await makeRequest('http://localhost:3001/nonexistent', true);
      if (!response.error) {
        throw new Error('404 response error içermiyor');
      }
    });
    
    console.log('\n✅ Tüm testler başarılı!');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Testler başarısız!');
    console.error(error.message);
    process.exit(1);
  } finally {
    server.close();
  }
  
  // Test helper function
  async function test(description, testFn) {
    try {
      await testFn();
      console.log(`✅ ${description}`);
    } catch (error) {
      console.error(`❌ ${description}`);
      throw error;
    }
  }
}

// HTTP request helper
function makeRequest(url, allowErrors = false) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      
      res.on('data', chunk => data += chunk);
      
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (e) {
          reject(new Error(`JSON parse hatası: ${e.message}`));
        }
      });
      
      res.on('error', reject);
    }).on('error', (err) => {
      if (!allowErrors) {
        reject(err);
      }
    });
  });
}

// Testleri çalıştır
runTests();
