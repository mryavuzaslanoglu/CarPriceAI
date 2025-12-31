# CarPrice AI - Araç Fiyat Tahmin Sistemi

Modern web teknolojileri ve makine öğrenimi ile geliştirilmiş araç fiyat tahmin uygulaması.

## Proje Yapısı

```
CarPriceAI/
├── CarPriceBackend/       # FastAPI backend API
├── CarPriceFrontend/      # React + Vite frontend
├── CarPriceAI/            # ML modelleri ve veri
└── docker-compose.yml     # Docker orchestration
```

## Teknolojiler

### Backend
- FastAPI 0.109.0
- CatBoost 1.2.2
- Python 3.11
- Uvicorn

### Frontend
- React 19.2.0
- Vite 7.2.4
- Modern ES6+

### ML
- CatBoost Regressor
- Pandas, NumPy

## Kurulum ve Çalıştırma

### Docker ile Çalıştırma (Önerilen)

1. **Ortam değişkenlerini ayarlayın:**
```bash
cp .env.example .env
```

2. **Docker container'ları başlatın:**
```bash
docker-compose up -d
```

3. **Uygulamayı açın:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

4. **Container'ları durdurun:**
```bash
docker-compose down
```

5. **Logları görüntüleyin:**
```bash
docker-compose logs -f
```

### Lokal Geliştirme

#### Backend

1. **Virtual environment oluşturun:**
```bash
cd CarPriceBackend
python -m venv venv
```

2. **Virtual environment'i aktifleştirin:**
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

3. **Bağımlılıkları yükleyin:**
```bash
pip install -r requirements.txt
```

4. **Ortam değişkenlerini ayarlayın:**
```bash
cp .env.example .env
```

5. **Backend'i çalıştırın:**
```bash
# Development mode (auto-reload)
python -m app.main

# veya
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend http://localhost:8000 adresinde çalışacaktır.

#### Frontend

1. **Bağımlılıkları yükleyin:**
```bash
cd CarPriceFrontend
npm install
```

2. **Ortam değişkenlerini ayarlayın:**
```bash
cp .env.example .env
```

3. **Frontend'i çalıştırın:**
```bash
# Development server
npm run dev

# Production build
npm run build
npm run preview
```

Frontend http://localhost:5173 (dev) veya http://localhost:3000 (preview) adresinde çalışacaktır.

## Ortam Değişkenleri

### Root `.env`
```env
BACKEND_PORT=8000
FRONTEND_PORT=3000
DEBUG=false
VITE_API_URL=http://localhost:8000
```

### Backend `.env`
```env
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=true
MODEL_PATH=../CarPriceAI/outputs/models/catboost_fiyat_model.cbm
MODEL_META_PATH=../CarPriceAI/outputs/models/model_meta.json
DATA_PATH=../CarPriceAI/outputs/cleaned_data.csv
CORS_ORIGINS=["http://localhost:3000", "http://localhost:5173"]
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:8000
```

## API Endpoints

### Health Check
```
GET /health
```

### Dropdown Seçenekleri
```
GET /api/v1/options
```

### Markaya Göre Modeller
```
GET /api/v1/models/{marka}
```

### Modele Göre Seriler
```
GET /api/v1/series/{model}
```

### Fiyat Tahmini
```
POST /api/v1/predict
Content-Type: application/json

{
  "marka": "BMW",
  "model": "3 Serisi",
  "seri": "320i",
  "yil": 2020,
  "km": 50000,
  "vites_tipi": "Otomatik",
  "yakit_tipi": "Benzin",
  "motor_hacmi": 2000,
  "motor_gucu": 184,
  "renk": "Beyaz"
}
```

## Docker Komutları

```bash
# Build ve başlat
docker-compose up --build -d

# Sadece backend'i yeniden başlat
docker-compose restart backend

# Container'ları durdur
docker-compose stop

# Container'ları kaldır
docker-compose down

# Volume'lar ile birlikte kaldır
docker-compose down -v

# Logları izle
docker-compose logs -f

# Belirli bir servisin loglarını izle
docker-compose logs -f backend

# Container içine gir
docker-compose exec backend bash
docker-compose exec frontend sh
```

## Geliştirme Notları

### Port Değişikliği

**Docker için:**
`.env` dosyasında `BACKEND_PORT` ve `FRONTEND_PORT` değerlerini değiştirin.

**Lokal için:**
- Backend: `CarPriceBackend/.env` içinde `API_PORT` değiştirin
- Frontend: Vite otomatik olarak uygun portu seçer veya `vite.config.js` içinde ayarlayın

### CORS Ayarları

Backend Docker'da çalışırken otomatik olarak frontend container'ına izin verir. Lokal geliştirmede `CarPriceBackend/.env` dosyasında `CORS_ORIGINS` ayarını güncelleyin.

### Model Güncellemeleri

ML modeli güncellendiğinde:
1. Yeni model dosyalarını `CarPriceAI/outputs/` klasörüne koyun
2. Docker kullanıyorsanız: `docker-compose restart backend`
3. Lokal kullanıyorsanız: Backend'i yeniden başlatın

## Troubleshooting

### "Model yüklenemedi" hatası
- Model dosyalarının `CarPriceAI/outputs/models/` klasöründe olduğundan emin olun
- Dosya izinlerini kontrol edin
- Docker volume mount'larını kontrol edin

### Frontend API'ye bağlanamıyor
- Backend'in çalıştığından emin olun (http://localhost:8000/health)
- `VITE_API_URL` ortam değişkenini kontrol edin
- CORS ayarlarını kontrol edin
- Frontend'i yeniden build edin (production build kullanıyorsanız)

### Port zaten kullanımda
- `.env` dosyasında portları değiştirin
- Veya çalışan servisi durdurun: `docker-compose down`

## Lisans

Bu proje eğitim amaçlı geliştirilmiştir.

## Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## İletişim

Sorularınız için issue açabilirsiniz.
