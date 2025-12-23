from fastapi import APIRouter, HTTPException, Query
from typing import Optional

from app.models.schemas import (
    CarFeatures,
    PricePrediction,
    OptionsResponse,
    ErrorResponse
)
from app.services.ml_service import ml_service


router = APIRouter(prefix="/api/v1", tags=["Prediction"])


@router.post(
    "/predict",
    response_model=PricePrediction,
    responses={
        400: {"model": ErrorResponse, "description": "Geçersiz girdi"},
        500: {"model": ErrorResponse, "description": "Tahmin hatası"}
    },
    summary="Araç fiyat tahmini",
    description="Verilen araç özelliklerine göre tahmini fiyat döndürür."
)
async def predict_price(features: CarFeatures):
    """Araç fiyat tahmini yap."""
    try:
        if not ml_service.is_loaded:
            raise HTTPException(
                status_code=500,
                detail="Model yüklenmemiş. Lütfen sunucuyu yeniden başlatın."
            )
        
        # Pydantic modelini dict'e çevir
        feature_dict = features.model_dump(by_alias=True)
        
        # Tahmin yap
        result = ml_service.predict(feature_dict)
        
        return PricePrediction(**result)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Tahmin hatası: {str(e)}"
        )


@router.get(
    "/options",
    response_model=OptionsResponse,
    summary="Form seçenekleri",
    description="Dropdown menüler için tüm seçenekleri döndürür."
)
async def get_options():
    """Tüm dropdown seçeneklerini döndür."""
    try:
        options = ml_service.get_options()
        
        if not options:
            raise HTTPException(
                status_code=500,
                detail="Seçenekler yüklenemedi."
            )
        
        return OptionsResponse(**options)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Seçenek yükleme hatası: {str(e)}"
        )


@router.get(
    "/models/{marka}",
    summary="Markaya göre modeller",
    description="Belirtilen markaya ait araç modellerini döndürür."
)
async def get_models_by_brand(marka: str):
    """Markaya göre modelleri döndür."""
    models = ml_service.get_models_by_brand(marka)
    return {"marka": marka, "modeller": models}


@router.get(
    "/series/{model}",
    summary="Modele göre seriler",
    description="Belirtilen modele ait serileri döndürür."
)
async def get_series_by_model(model: str):
    """Modele göre serileri döndür."""
    series = ml_service.get_series_by_model(model)
    return {"model": model, "seriler": series}
