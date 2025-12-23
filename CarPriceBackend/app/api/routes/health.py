from fastapi import APIRouter

from app.models.schemas import HealthResponse
from app.services.ml_service import ml_service


router = APIRouter(tags=["Health"])


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Sağlık kontrolü",
    description="API ve model durumunu kontrol eder."
)
async def health_check():
    """API sağlık durumunu döndür."""
    return HealthResponse(
        status="healthy" if ml_service.is_loaded else "degraded",
        model_loaded=ml_service.is_loaded,
        version="1.0.0"
    )


@router.get(
    "/",
    summary="Kök endpoint",
    description="API bilgilerini döndürür."
)
async def root():
    """API bilgileri."""
    return {
        "name": "CarPrice AI API",
        "version": "1.0.0",
        "description": "Araç fiyat tahmin API'si",
        "docs": "/docs",
        "health": "/health"
    }
