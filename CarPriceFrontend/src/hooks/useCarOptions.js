import { useState, useEffect } from 'react';
import { getOptions, getModelsByBrand, getSeriesByModel } from '../services/api';

/**
 * Araç seçeneklerini yöneten custom hook
 */
export const useCarOptions = () => {
    const [options, setOptions] = useState(null);
    const [models, setModels] = useState([]);
    const [series, setSeries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // İlk yüklemede tüm seçenekleri getir
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                setLoading(true);
                const data = await getOptions();
                setOptions(data);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOptions();
    }, []);

    // Markaya göre modelleri getir
    const fetchModels = async (marka) => {
        if (!marka) {
            setModels([]);
            setSeries([]);
            return;
        }

        try {
            const data = await getModelsByBrand(marka);
            setModels(data.modeller || []);
            setSeries([]);
        } catch (err) {
            console.error('Model yükleme hatası:', err);
            setModels([]);
        }
    };

    // Modele göre serileri getir
    const fetchSeries = async (model) => {
        if (!model) {
            setSeries([]);
            return;
        }

        try {
            const data = await getSeriesByModel(model);
            setSeries(data.seriler || []);
        } catch (err) {
            console.error('Seri yükleme hatası:', err);
            setSeries([]);
        }
    };

    return {
        options,
        models,
        series,
        loading,
        error,
        fetchModels,
        fetchSeries,
    };
};
