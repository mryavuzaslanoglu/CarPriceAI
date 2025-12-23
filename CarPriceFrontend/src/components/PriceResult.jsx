import './PriceResult.css';

const PriceResult = ({ result, loading }) => {
    if (loading) {
        return (
            <div className="price-result price-result-loading">
                <div className="price-skeleton">
                    <div className="skeleton skeleton-title"></div>
                    <div className="skeleton skeleton-price"></div>
                    <div className="skeleton skeleton-info"></div>
                </div>
            </div>
        );
    }

    if (!result) return null;

    const formatPrice = (price) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className="price-result animate-slideUp">
            <div className="price-header">
                <div className="price-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                </div>
                <span className="price-label">Tahmini Fiyat</span>
            </div>

            <div className="price-main">
                <span className="price-value">{formatPrice(result.predicted_price)}</span>
            </div>

            <div className="price-range">
                <div className="range-bar">
                    <div className="range-fill" style={{
                        left: '10%',
                        right: '10%'
                    }}></div>
                    <div className="range-marker"></div>
                </div>
                <div className="range-labels">
                    <span className="range-low">{formatPrice(result.confidence_low)}</span>
                    <span className="range-text">Güven Aralığı</span>
                    <span className="range-high">{formatPrice(result.confidence_high)}</span>
                </div>
            </div>

            <div className="price-metrics">
                <div className="metric">
                    <span className="metric-value">{(result.model_info.r2_score * 100).toFixed(1)}%</span>
                    <span className="metric-label">Model Doğruluğu</span>
                </div>
                <div className="metric-divider"></div>
                <div className="metric">
                    <span className="metric-value">±{result.model_info.mape.toFixed(1)}%</span>
                    <span className="metric-label">Hata Oranı</span>
                </div>
            </div>

            <div className="price-disclaimer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <span>Bu tahmin piyasa koşullarına göre değişiklik gösterebilir.</span>
            </div>
        </div>
    );
};

export default PriceResult;
