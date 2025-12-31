const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * API servis fonksiyonları
 */

// Sağlık kontrolü
export const checkHealth = async () => {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) throw new Error('API bağlantı hatası');
    return response.json();
};

// Tüm dropdown seçeneklerini getir
export const getOptions = async () => {
    const response = await fetch(`${API_BASE_URL}/api/v1/options`);
    if (!response.ok) throw new Error('Seçenekler yüklenemedi');
    return response.json();
};

// Markaya göre modelleri getir
export const getModelsByBrand = async (marka) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/models/${encodeURIComponent(marka)}`);
    if (!response.ok) throw new Error('Modeller yüklenemedi');
    return response.json();
};

// Modele göre serileri getir
export const getSeriesByModel = async (model) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/series/${encodeURIComponent(model)}`);
    if (!response.ok) throw new Error('Seriler yüklenemedi');
    return response.json();
};

// Fiyat tahmini yap
export const predictPrice = async (features) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/predict`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(features),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Tahmin hatası');
    }

    return response.json();
};
