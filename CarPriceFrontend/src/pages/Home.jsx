import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CarForm from '../components/CarForm';
import PriceResult from '../components/PriceResult';
import { useCarOptions } from '../hooks/useCarOptions';
import { predictPrice } from '../services/api';
import './Home.css';

const Home = () => {
    const { options, models, series, loading: optionsLoading, error, fetchModels, fetchSeries } = useCarOptions();
    const [result, setResult] = useState(null);
    const [predicting, setPredicting] = useState(false);
    const [predictError, setPredictError] = useState(null);

    const handlePredict = async (formData) => {
        try {
            setPredicting(true);
            setPredictError(null);
            setResult(null);

            const prediction = await predictPrice(formData);
            setResult(prediction);
        } catch (err) {
            setPredictError(err.message);
        } finally {
            setPredicting(false);
        }
    };

    return (
        <div className="home">
            <Header />

            <main className="main">
                <div className="container">
                    {/* Hero Section */}
                    <section className="hero animate-fadeIn">
                        <h1>Araç Fiyat Tahmini</h1>
                        <p className="hero-description">
                            Yapay zeka destekli modelimiz ile aracınızın güncel piyasa değerini öğrenin.
                            <strong> %90+ doğruluk oranı</strong> ile güvenilir tahminler.
                        </p>
                    </section>

                    {/* Error Banner */}
                    {(error || predictError) && (
                        <div className="error-banner animate-fadeIn">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            <span>{error || predictError}</span>
                        </div>
                    )}

                    {/* Main Content */}
                    <div className="content-grid">
                        <div className="form-column">
                            <CarForm
                                options={options}
                                models={models}
                                series={series}
                                onBrandChange={fetchModels}
                                onModelChange={fetchSeries}
                                onSubmit={handlePredict}
                                loading={predicting || optionsLoading}
                            />
                        </div>

                        <div className="result-column">
                            {(result || predicting) && (
                                <PriceResult result={result} loading={predicting} />
                            )}

                            {!result && !predicting && (
                                <div className="result-placeholder">
                                    <div className="placeholder-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                        </svg>
                                    </div>
                                    <h3>Fiyat Tahmini</h3>
                                    <p>Araç bilgilerini doldurup tahmin butonuna tıklayın.</p>

                                    <div className="features-list">
                                        <div className="feature">
                                            <span className="feature-icon">🎯</span>
                                            <span>CatBoost ML Modeli</span>
                                        </div>
                                        <div className="feature">
                                            <span className="feature-icon">📊</span>
                                            <span>6,600+ Araç Verisi</span>
                                        </div>
                                        <div className="feature">
                                            <span className="feature-icon">⚡</span>
                                            <span>Anlık Tahmin</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Home;
