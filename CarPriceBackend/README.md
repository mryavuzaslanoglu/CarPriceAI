# CarPrice Backend

## 🚗 Araç Fiyat Tahmin API'si

FastAPI ile geliştirilmiş araç fiyat tahmin backend'i.

## 📁 Proje Yapısı

```
CarPriceBackend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI entry point
│   ├── api/
│   │   ├── __init__.py
│   │   └── routes/
│   │       ├── __init__.py
│   │       ├── health.py    # Health check endpoints
│   │       └── prediction.py # Tahmin endpoints
│   ├── core/
│   │   ├── __init__.py
│   │   └── config.py        # Settings
│   ├── models/
│   │   ├── __init__.py
│   │   └── schemas.py       # Pydantic models
│   └── services/
│       ├── __init__.py
│       └── ml_service.py    # ML model servisi
├── .env                     # Environment variables
├── .env.example
├── requirements.txt
└── README.md
```

## 🚀 Kurulum

### 1. Virtual Environment Oluştur

```bash
cd CarPriceBackend
python -m venv venv
```

### 2. Virtual Environment Aktif Et

**Windows:**
```bash
.\venv\Scripts\activate
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

### 3. Bağımlılıkları Yükle

```bash
pip install -r requirements.txt
```

### 4. Environment Dosyasını Düzenle

`.env` dosyasını kontrol et ve gerekirse model yollarını güncelle.

### 5. Uygulamayı Başlat

```bash
uvicorn app.main:app --reload
```

veya

```bash
python -m app.main
```

## 📡 API Endpoints

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/` | API bilgileri |
| GET | `/health` | Sağlık kontrolü |
| GET | `/docs` | Swagger UI |
| GET | `/redoc` | ReDoc |
| POST | `/api/v1/predict` | Fiyat tahmini |
| GET | `/api/v1/options` | Form seçenekleri |
| GET | `/api/v1/models/{marka}` | Markaya göre modeller |
| GET | `/api/v1/series/{model}` | Modele göre seriler |

## 📝 Örnek İstek

```bash
curl -X POST "http://localhost:8000/api/v1/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "marka": "BMW",
    "model": "3 Serisi",
    "seri": "320i",
    "yakitTuru": "Benzin",
    "vitesTipi": "Otomatik",
    "kasaTipi": "Sedan",
    "renk": "Siyah",
    "cekisTipi": "Arkadan Çekiş",
    "il": "İstanbul",
    "km_temiz": 75000,
    "yil_temiz": 2020,
    "motor_gucu_temiz": 184,
    "motor_hacmi_temiz": 1998
  }'
```

## 📊 Model Bilgisi

- **Algoritma**: CatBoost Regressor
- **R² Skoru**: ~0.90
- **MAPE**: ~11%
- **Optuna**: Hyperparameter optimization kullanıldı
