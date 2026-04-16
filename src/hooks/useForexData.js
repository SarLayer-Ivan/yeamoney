import { useState, useEffect, useCallback } from 'react';
import { fetchForexRates, fetchBTCRate } from '../api/finhubApi';
import { formatPrice } from '../utils/helpers';

export const useForexData = () => {
    const [rates, setRates] = useState({
        eurusd: null,
        gbpusd: null,
        usdjpy: null,
        btcusd: null
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadRates = useCallback(async () => {
        try {
            setLoading(true);
            const forexRates = await fetchForexRates();
            const btcRate = await fetchBTCRate();

            setRates({
                eurusd: forexRates.EURUSD || null,
                gbpusd: forexRates.GBPUSD || null,
                usdjpy: forexRates.USDJPY || null,
                btcusd: btcRate
            });
            setError(null);
        } catch (e) {
            setError('Ошибка загрузки курсов');
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadRates();

        // Обновление каждые 60 секунд
        const interval = setInterval(loadRates, 60000);
        return () => clearInterval(interval);
    }, [loadRates]);

    const getFormattedRate = (pair) => {
        return rates[pair] ? formatPrice(rates[pair]) : '—';
    };

    return {
        rates,
        loading,
        error,
        refresh: loadRates,
        getFormattedRate
    };
};