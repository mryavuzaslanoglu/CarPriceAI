from pydantic_settings import BaseSettings
from typing import List
import json


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # API Settings
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    debug: bool = True
    
    # Model Paths
    model_path: str = "../CarPriceAI/outputs/models/catboost_fiyat_model.cbm"
    model_meta_path: str = "../CarPriceAI/outputs/models/model_meta.json"
    data_path: str = "../CarPriceAI/outputs/cleaned_data.csv"
    
    # CORS
    cors_origins: str = '["http://localhost:3000", "http://localhost:5173"]'
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins from JSON string to list."""
        return json.loads(self.cors_origins)
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


settings = Settings()
