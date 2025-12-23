from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.routes import prediction_router, health_router
from app.services.ml_service import ml_service


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan - startup ve shutdown olayları."""
    # Startup
    print("🚀 CarPrice AI API başlatılıyor...")
    
    # Model yükle
    if ml_service.load_model():
        print("✅ ML modeli yüklendi")
    else:
        print("⚠️ ML modeli yüklenemedi!")
    
    # Veri yükle (dropdown seçenekleri için)
    if ml_service.load_data():
        print("✅ Veri yüklendi")
    else:
        print("⚠️ Veri yüklenemedi!")
    
    print("🎉 API hazır!")
    
    yield  # Uygulama çalışıyor
    
    # Shutdown
    print("👋 API kapatılıyor...")


# FastAPI uygulaması
app = FastAPI(
    title="CarPrice AI API",
    description="""
    ## 🚗 Araç Fiyat Tahmin API'si
    
    Bu API, makine öğrenimi modeli kullanarak araç fiyat tahmini yapar.
    
    ### Özellikler:
    - **Fiyat Tahmini**: Araç özelliklerine göre tahmini fiyat
    - **Form Seçenekleri**: Dropdown menüler için veri
    - **Hiyerarşik Seçenekler**: Marka → Model → Seri
    
    ### Model Bilgisi:
    - **Algoritma**: CatBoost Regressor
    - **R² Skoru**: ~0.90
    - **MAPE**: ~11%
    """,
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)


# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Router'ları ekle
app.include_router(health_router)
app.include_router(prediction_router)


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "app.main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.debug,
    )
