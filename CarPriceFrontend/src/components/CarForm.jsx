import { useState } from 'react';
import './CarForm.css';

const CarForm = ({ options, models, series, onBrandChange, onModelChange, onSubmit, loading }) => {
    const [formData, setFormData] = useState({
        marka: '',
        model: '',
        seri: '',
        yakitTuru: '',
        vitesTipi: '',
        kasaTipi: '',
        renk: '',
        cekisTipi: '',
        il: '',
        km_temiz: '',
        yil_temiz: '',
        motor_gucu_temiz: '',
        motor_hacmi_temiz: '',
        hasar_skoru: 0,
        'orjinal_parça_sayısı': 14,
        'lokal_boyalı_parça_sayısı': 0,
        'boyalı_parça_sayısı': 0,
        'değişen_parça_sayısı': 0,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'marka') {
            onBrandChange(value);
            setFormData(prev => ({ ...prev, model: '', seri: '' }));
        } else if (name === 'model') {
            onModelChange(value);
            setFormData(prev => ({ ...prev, seri: '' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Convert numeric fields
        const submitData = {
            ...formData,
            km_temiz: parseFloat(formData.km_temiz) || 0,
            yil_temiz: parseInt(formData.yil_temiz) || 2020,
            motor_gucu_temiz: parseFloat(formData.motor_gucu_temiz) || 0,
            motor_hacmi_temiz: parseFloat(formData.motor_hacmi_temiz) || 0,
            hasar_skoru: parseFloat(formData.hasar_skoru) || 0,
        };

        onSubmit(submitData);
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1989 }, (_, i) => currentYear - i);

    if (!options) {
        return (
            <div className="form-loading">
                <div className="spinner"></div>
                <p>Seçenekler yükleniyor...</p>
            </div>
        );
    }

    return (
        <form className="car-form" onSubmit={handleSubmit}>
            {/* Araç Bilgileri */}
            <div className="form-section">
                <h3 className="section-title">
                    <span className="section-icon">🚗</span>
                    Araç Bilgileri
                </h3>

                <div className="form-grid">
                    <div className="input-group">
                        <label className="input-label">Marka *</label>
                        <select
                            name="marka"
                            className="select"
                            value={formData.marka}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Marka Seçin</option>
                            {options.markalar?.map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Model *</label>
                        <select
                            name="model"
                            className="select"
                            value={formData.model}
                            onChange={handleChange}
                            disabled={!formData.marka}
                            required
                        >
                            <option value="">Model Seçin</option>
                            {models.map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Seri *</label>
                        <select
                            name="seri"
                            className="select"
                            value={formData.seri}
                            onChange={handleChange}
                            disabled={!formData.model}
                            required
                        >
                            <option value="">Seri Seçin</option>
                            {series.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Model Yılı *</label>
                        <select
                            name="yil_temiz"
                            className="select"
                            value={formData.yil_temiz}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Yıl Seçin</option>
                            {years.map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Teknik Özellikler */}
            <div className="form-section">
                <h3 className="section-title">
                    <span className="section-icon">⚙️</span>
                    Teknik Özellikler
                </h3>

                <div className="form-grid">
                    <div className="input-group">
                        <label className="input-label">Yakıt Türü *</label>
                        <select
                            name="yakitTuru"
                            className="select"
                            value={formData.yakitTuru}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Yakıt Türü Seçin</option>
                            {options.yakit_turleri?.map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Vites Tipi *</label>
                        <select
                            name="vitesTipi"
                            className="select"
                            value={formData.vitesTipi}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Vites Tipi Seçin</option>
                            {options.vites_tipleri?.map(v => (
                                <option key={v} value={v}>{v}</option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Kasa Tipi *</label>
                        <select
                            name="kasaTipi"
                            className="select"
                            value={formData.kasaTipi}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Kasa Tipi Seçin</option>
                            {options.kasa_tipleri?.map(k => (
                                <option key={k} value={k}>{k}</option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Çekiş Tipi</label>
                        <select
                            name="cekisTipi"
                            className="select"
                            value={formData.cekisTipi}
                            onChange={handleChange}
                        >
                            <option value="">Çekiş Tipi Seçin</option>
                            {options.cekis_tipleri?.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Motor Gücü (HP) *</label>
                        <input
                            type="number"
                            name="motor_gucu_temiz"
                            className="input"
                            placeholder="Örn: 150"
                            value={formData.motor_gucu_temiz}
                            onChange={handleChange}
                            min="0"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Motor Hacmi (cc) *</label>
                        <input
                            type="number"
                            name="motor_hacmi_temiz"
                            className="input"
                            placeholder="Örn: 1600"
                            value={formData.motor_hacmi_temiz}
                            onChange={handleChange}
                            min="0"
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Diğer Bilgiler */}
            <div className="form-section">
                <h3 className="section-title">
                    <span className="section-icon">📍</span>
                    Diğer Bilgiler
                </h3>

                <div className="form-grid">
                    <div className="input-group">
                        <label className="input-label">Kilometre *</label>
                        <input
                            type="number"
                            name="km_temiz"
                            className="input"
                            placeholder="Örn: 50000"
                            value={formData.km_temiz}
                            onChange={handleChange}
                            min="0"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Renk</label>
                        <select
                            name="renk"
                            className="select"
                            value={formData.renk}
                            onChange={handleChange}
                        >
                            <option value="">Renk Seçin</option>
                            {options.renkler?.map(r => (
                                <option key={r} value={r}>{r}</option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group">
                        <label className="input-label">İl</label>
                        <select
                            name="il"
                            className="select"
                            value={formData.il}
                            onChange={handleChange}
                        >
                            <option value="">İl Seçin</option>
                            {options.iller?.map(i => (
                                <option key={i} value={i}>{i}</option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Hasar Fiyatı</label>
                        <input
                            type="number"
                            name="hasar_fiyatı"
                            className="input"
                            placeholder="0"
                            value={formData.hasar_fiyatı}
                            onChange={handleChange}
                            min="0"
                            step="0.1"
                        />
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className={`btn btn-primary btn-submit ${loading ? 'btn-loading' : ''}`}
                disabled={loading}
            >
                {!loading && (
                    <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                        </svg>
                        Fiyat Tahmin Et
                    </>
                )}
            </button>
        </form>
    );
};

export default CarForm;
