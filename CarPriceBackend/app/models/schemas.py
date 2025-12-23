from pydantic import BaseModel, Field
from typing import Optional, List


class CarFeatures(BaseModel):
    """Araç özellikleri için istek modeli."""
    
    # Kategorik özellikler
    marka: str = Field(..., description="Araç markası (örn: BMW, Mercedes, Toyota)")
    model: str = Field(..., description="Araç modeli (örn: 3 Serisi, C Serisi)")
    seri: str = Field(..., description="Araç serisi (örn: 320i, C200)")
    yakitTuru: str = Field(..., description="Yakıt türü (Benzin, Dizel, Hybrid, Elektrik)")
    vitesTipi: str = Field(..., description="Vites tipi (Manuel, Otomatik, Yarı Otomatik)")
    kasaTipi: str = Field(..., description="Kasa tipi (Sedan, Hatchback, SUV, vb.)")
    renk: str = Field(..., description="Araç rengi")
    cekisTipi: str = Field(..., description="Çekiş tipi (Önden, Arkadan, 4WD)")
    il: str = Field(..., description="İlan ili")
    
    # Sayısal özellikler
    km_temiz: float = Field(..., ge=0, description="Kilometre")
    yil_temiz: int = Field(..., ge=1990, le=2025, description="Model yılı")
    motor_gucu_temiz: float = Field(..., ge=0, description="Motor gücü (HP)")
    motor_hacmi_temiz: float = Field(..., ge=0, description="Motor hacmi (cc)")
    
    # Hesaplanabilir özellikler (opsiyonel - backend hesaplar)
    arac_yasi: Optional[int] = Field(None, description="Araç yaşı (otomatik hesaplanır)")
    km_per_yas: Optional[float] = Field(None, description="Yıllık km (otomatik hesaplanır)")
    hasar_skoru: float = Field(0, ge=0, description="Hasar skoru")
    
    # Parça durumu
    orjinal_parca_sayisi: int = Field(0, ge=0, le=14, alias="orjinal_parça_sayısı", description="Orijinal parça sayısı")
    lokal_boyali_parca_sayisi: int = Field(0, ge=0, le=14, alias="lokal_boyalı_parça_sayısı", description="Lokal boyalı parça sayısı")
    boyali_parca_sayisi: int = Field(0, ge=0, le=14, alias="boyalı_parça_sayısı", description="Boyalı parça sayısı")
    degisen_parca_sayisi: int = Field(0, ge=0, le=14, alias="değişen_parça_sayısı", description="Değişen parça sayısı")

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
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
                "motor_hacmi_temiz": 1998,
                "hasar_skoru": 0,
                "orjinal_parça_sayısı": 14,
                "lokal_boyalı_parça_sayısı": 0,
                "boyalı_parça_sayısı": 0,
                "değişen_parça_sayısı": 0
            }
        }


class PricePrediction(BaseModel):
    """Fiyat tahmini yanıt modeli."""
    
    predicted_price: float = Field(..., description="Tahmini fiyat (TL)")
    predicted_price_formatted: str = Field(..., description="Formatlanmış tahmini fiyat")
    confidence_low: Optional[float] = Field(None, description="Güven aralığı alt sınırı")
    confidence_high: Optional[float] = Field(None, description="Güven aralığı üst sınırı")
    model_info: dict = Field(default_factory=dict, description="Model bilgileri")


class HealthResponse(BaseModel):
    """Sağlık kontrolü yanıt modeli."""
    
    status: str
    model_loaded: bool
    version: str


class OptionsResponse(BaseModel):
    """Dropdown seçenekleri yanıt modeli."""
    
    markalar: List[str]
    modeller: dict  # marka -> model listesi
    seriler: dict   # model -> seri listesi
    yakit_turleri: List[str]
    vites_tipleri: List[str]
    kasa_tipleri: List[str]
    renkler: List[str]
    cekis_tipleri: List[str]
    iller: List[str]


class ErrorResponse(BaseModel):
    """Hata yanıt modeli."""
    
    error: str
    detail: Optional[str] = None
