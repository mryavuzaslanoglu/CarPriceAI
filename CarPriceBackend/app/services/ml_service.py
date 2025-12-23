import json
import numpy as np
import pandas as pd
from catboost import CatBoostRegressor
from pathlib import Path
from datetime import datetime
from typing import Dict, Any, Optional

from app.core.config import settings


class MLService:
    """Machine Learning servisi - Model yükleme ve tahmin."""
    
    _instance: Optional["MLService"] = None
    
    def __new__(cls):
        """Singleton pattern - tek instance."""
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        if self._initialized:
            return
            
        self.model: Optional[CatBoostRegressor] = None
        self.model_meta: Dict[str, Any] = {}
        self.data: Optional[pd.DataFrame] = None
        self.options_cache: Dict[str, Any] = {}
        self._initialized = True
        
    def load_model(self) -> bool:
        """Model ve metadata yükle."""
        try:
            model_path = Path(settings.model_path)
            meta_path = Path(settings.model_meta_path)
            
            if not model_path.exists():
                raise FileNotFoundError(f"Model dosyası bulunamadı: {model_path}")
            
            # CatBoost modelini yükle
            self.model = CatBoostRegressor()
            self.model.load_model(str(model_path))
            
            # Metadata yükle
            if meta_path.exists():
                with open(meta_path, "r", encoding="utf-8") as f:
                    self.model_meta = json.load(f)
                    
            print(f"✅ Model başarıyla yüklendi: {model_path}")
            return True
            
        except Exception as e:
            print(f"❌ Model yükleme hatası: {e}")
            return False
    
    def load_data(self) -> bool:
        """Temizlenmiş veriyi yükle (dropdown seçenekleri için)."""
        try:
            data_path = Path(settings.data_path)
            
            if not data_path.exists():
                raise FileNotFoundError(f"Veri dosyası bulunamadı: {data_path}")
            
            self.data = pd.read_csv(data_path)
            self._build_options_cache()
            
            print(f"✅ Veri başarıyla yüklendi: {len(self.data)} satır")
            return True
            
        except Exception as e:
            print(f"❌ Veri yükleme hatası: {e}")
            return False
    
    def _build_options_cache(self):
        """Dropdown seçeneklerini önbelleğe al."""
        if self.data is None:
            return
            
        df = self.data
        
        # Basit listeler
        self.options_cache["markalar"] = sorted(df["marka"].dropna().unique().tolist())
        self.options_cache["yakit_turleri"] = sorted(df["yakitTuru"].dropna().unique().tolist())
        self.options_cache["vites_tipleri"] = sorted(df["vitesTipi"].dropna().unique().tolist())
        self.options_cache["kasa_tipleri"] = sorted(df["kasaTipi"].dropna().unique().tolist())
        self.options_cache["renkler"] = sorted(df["renk"].dropna().unique().tolist())
        self.options_cache["cekis_tipleri"] = sorted(df["cekisTipi"].dropna().unique().tolist())
        self.options_cache["iller"] = sorted(df["il"].dropna().unique().tolist())
        
        # Hiyerarşik: marka -> model
        self.options_cache["modeller"] = {}
        for marka in self.options_cache["markalar"]:
            modeller = df[df["marka"] == marka]["model"].dropna().unique().tolist()
            self.options_cache["modeller"][marka] = sorted(modeller)
        
        # Hiyerarşik: model -> seri
        self.options_cache["seriler"] = {}
        for _, row in df[["model", "seri"]].drop_duplicates().iterrows():
            model = row["model"]
            seri = row["seri"]
            if pd.notna(model) and pd.notna(seri):
                if model not in self.options_cache["seriler"]:
                    self.options_cache["seriler"][model] = []
                if seri not in self.options_cache["seriler"][model]:
                    self.options_cache["seriler"][model].append(seri)
        
        # Serileri sırala
        for model in self.options_cache["seriler"]:
            self.options_cache["seriler"][model] = sorted(self.options_cache["seriler"][model])
    
    def get_options(self) -> Dict[str, Any]:
        """Tüm dropdown seçeneklerini döndür."""
        return self.options_cache
    
    def get_models_by_brand(self, marka: str) -> list:
        """Markaya göre modelleri döndür."""
        return self.options_cache.get("modeller", {}).get(marka, [])
    
    def get_series_by_model(self, model: str) -> list:
        """Modele göre serileri döndür."""
        return self.options_cache.get("seriler", {}).get(model, [])
    
    def predict(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """Fiyat tahmini yap."""
        if self.model is None:
            raise RuntimeError("Model yüklenmemiş!")
        
        # Araç yaşını hesapla
        current_year = datetime.now().year
        yil = features.get("yil_temiz", current_year)
        arac_yasi = current_year - yil
        
        # km_per_yas hesapla
        km = features.get("km_temiz", 0)
        km_per_yas = km / max(arac_yasi, 1)
        
        # Feature dictionary hazırla
        feature_dict = {
            "marka": features.get("marka", ""),
            "model": features.get("model", ""),
            "seri": features.get("seri", ""),
            "yakitTuru": features.get("yakitTuru", ""),
            "vitesTipi": features.get("vitesTipi", ""),
            "kasaTipi": features.get("kasaTipi", ""),
            "renk": features.get("renk", ""),
            "cekisTipi": features.get("cekisTipi", ""),
            "il": features.get("il", ""),
            "km_temiz": km,
            "yil_temiz": yil,
            "motor_gucu_temiz": features.get("motor_gucu_temiz", 0),
            "motor_hacmi_temiz": features.get("motor_hacmi_temiz", 0),
            "arac_yasi": arac_yasi,
            "km_per_yas": km_per_yas,
            "hasar_skoru": features.get("hasar_skoru", 0),
            "orjinal_parça_sayısı": features.get("orjinal_parça_sayısı", features.get("orjinal_parca_sayisi", 0)),
            "lokal_boyalı_parça_sayısı": features.get("lokal_boyalı_parça_sayısı", features.get("lokal_boyali_parca_sayisi", 0)),
            "boyalı_parça_sayısı": features.get("boyalı_parça_sayısı", features.get("boyali_parca_sayisi", 0)),
            "değişen_parça_sayısı": features.get("değişen_parça_sayısı", features.get("degisen_parca_sayisi", 0)),
        }
        
        # Model beklediği sırada DataFrame oluştur
        expected_features = self.model_meta.get("features", list(feature_dict.keys()))
        df_input = pd.DataFrame([{k: feature_dict.get(k, "") for k in expected_features}])
        
        # Tahmin yap (log_fiyat olarak)
        log_prediction = self.model.predict(df_input)[0]
        
        # Log'dan gerçek fiyata çevir
        use_log = self.model_meta.get("use_log_target", True)
        if use_log:
            predicted_price = np.exp(log_prediction)
        else:
            predicted_price = log_prediction
        
        # MAPE'e göre güven aralığı hesapla
        test_mape = self.model_meta.get("test_metrics", {}).get("mape", 11)
        margin = predicted_price * (test_mape / 100)
        
        return {
            "predicted_price": float(predicted_price),
            "predicted_price_formatted": f"{predicted_price:,.0f} TL".replace(",", "."),
            "confidence_low": float(predicted_price - margin),
            "confidence_high": float(predicted_price + margin),
            "model_info": {
                "type": self.model_meta.get("model_type", "CatBoost"),
                "r2_score": self.model_meta.get("test_metrics", {}).get("r2", 0),
                "mape": test_mape
            }
        }
    
    @property
    def is_loaded(self) -> bool:
        """Model yüklü mü?"""
        return self.model is not None


# Singleton instance
ml_service = MLService()
