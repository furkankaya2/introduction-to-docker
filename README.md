# GitHub Actions Docker CI/CD Demo

Bu proje, GitHub Actions kullanarak otomatik Docker image build ve deploy sürecini gösterir.

## 🎯 Ne Yapıyor?

1. Her `git push` ile otomatik olarak Docker image build edilir
2. Testler otomatik çalışır
3. Image GitHub Container Registry'ye (ghcr.io) push edilir
4. Image versiyon ile tag'lenir

## 🚀 Kurulum

### 1. Bu Repoyu Fork/Clone Edin

```bash
git clone https://github.com/YOURUSERNAME/github-actions-demo.git
cd github-actions-demo
```

### 2. Local'de Test Edin

```bash
# Docker image build et
docker build -t myapp:local .

# Çalıştır
docker run -p 3000:3000 myapp:local

# Test et
curl http://localhost:3000
```

### 3. GitHub'a Push Edin

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

**Otomatik olarak:**
- ✅ Docker image build edilir
- ✅ Testler çalışır
- ✅ ghcr.io'ya push edilir

## 📦 Image Kullanımı

### GitHub Container Registry'den Pull

```bash
# Latest version
docker pull ghcr.io/YOURUSERNAME/github-actions-demo:latest

# Specific version
docker pull ghcr.io/YOURUSERNAME/github-actions-demo:v1.0.0

# Çalıştır
docker run -p 3000:3000 ghcr.io/YOURUSERNAME/github-actions-demo:latest
```

## 🔧 Proje Yapısı

```
github-actions-demo/
├── .github/
│   └── workflows/
│       └── docker-publish.yml    # GitHub Actions pipeline
├── src/
│   ├── app.js                     # Ana uygulama
│   └── app.test.js                # Testler
├── Dockerfile                      # Docker image tanımı
├── .dockerignore                   # Build'e dahil edilmeyecekler
├── package.json                    # Node.js dependencies
└── README.md                       # Bu dosya
```

## 🔄 Pipeline Akışı

```
Git Push
    ↓
GitHub Actions Tetiklenir
    ↓
Docker Image Build Edilir
    ↓
Testler Çalışır (Container içinde!)
    ↓
✅ Başarılı → Image Push Edilir
    ↓
ghcr.io/username/repo:latest
ghcr.io/username/repo:sha-abc123
ghcr.io/username/repo:v1.0.0
```

## 📊 GitHub Actions Özellikleri

### Otomatik Triggers

- `main` branch'e push
- Pull request oluşturulduğunda
- Tag oluşturulduğunda (`v*`)

### Image Tagging

- `latest`: En son version
- `sha-xxx`: Spesifik commit
- `v1.0.0`: Semantic versioning

## 🎯 Hands-On Egzersiz

### Görev 1: Kodu Değiştir ve Push Et

1. `src/app.js` dosyasını aç
2. Message'ı değiştir
3. Commit ve push et
4. GitHub → Actions sekmesine git
5. Pipeline'ın çalıştığını izle

### Görev 2: Yeni Özellik Ekle

1. `src/app.js`'e yeni endpoint ekle
2. Test yaz (`src/app.test.js`)
3. Push et
4. Testlerin geçtiğini doğrula
5. Yeni image'ı pull edip test et

### Görev 3: Version Release

1. Tag oluştur:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
2. Actions'da tag build'ini izle
3. Image'ı version ile pull et:
   ```bash
   docker pull ghcr.io/YOURUSERNAME/github-actions-demo:v1.0.0
   ```

## 🔍 Troubleshooting

### Image Private ve Pull Edilemiyor?

```bash
# GitHub token ile login
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Veya Personal Access Token kullan
docker login ghcr.io -u USERNAME
# Password: ghp_xxxxxxxxxxxx
```

### Actions Fail Oluyor?

1. Actions sekmesinde log'ları kontrol et
2. Hangi step'te fail olduğunu bul
3. Local'de aynı komutu çalıştır:
   ```bash
   docker build -t test .
   docker run --rm test npm test
   ```

## 📚 Öğrenilen Konular

- ✅ GitHub Actions workflow yazma
- ✅ Docker image otomatik build
- ✅ Container içinde test çalıştırma
- ✅ GitHub Container Registry kullanma
- ✅ Image versioning
- ✅ CI/CD pipeline oluşturma

## 🔗 Faydalı Linkler

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

## 💡 İpuçları

**Build Hızlandırma:**
- Layer caching kullan
- Multi-stage builds kullan
- .dockerignore dosyası ekle

**Güvenlik:**
- Secrets kullan (hardcode etme!)
- Image'ları scan et (Trivy)
- En minimal base image kullan

**Best Practices:**
- Her özellik için test yaz
- Semantic versioning kullan
- README'yi güncel tut
- Commit message'ları açıklayıcı yaz
