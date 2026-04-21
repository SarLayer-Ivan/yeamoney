import { useState, useEffect, useCallback } from 'react';
import { fetchForexRates } from '../api/finhubApi';
import { formatPrice } from '../utils/helpers';

export const useForexData = () => {
    const [rates, setRates] = useState({
        eurusd: null,
        gbpusd: null,
        usdjpy: null
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(null);

    const loadRates = useCallback(async () => {
        try {
            console.log('🔄 useForexData - loading rates...');
            setLoading(true);

            const forexRates = await fetchForexRates();

            console.log('📊 useForexData - received rates:', forexRates);

            setRates({
                eurusd: forexRates.EURUSD || 1.0925,
                gbpusd: forexRates.GBPUSD || 1.2710,
                usdjpy: forexRates.USDJPY || 148.35
            });

            setLastUpdate(new Date());
            setError(null);
        } catch (e) {
            console.error('❌ useForexData - error:', e);
            setError('Ошибка загрузки курсов');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadRates();

        // Обновление каждые 5 минут
        const interval = setInterval(loadRates, 300000);

        return () => clearInterval(interval);
    }, [loadRates]);

    const getFormattedRate = (pair) => {
        const rate = rates[pair];
        if (rate === null || rate === undefined) return '—';

        if (pair === 'usdjpy') {
            return formatPrice(rate, 2);
        }

        return formatPrice(rate, 4);
    };

    const getChange = (pair) => {
        if (!rates[pair]) return null;

        const changes = {
            eurusd: '+0.15%',
            gbpusd: '-0.08%',
            usdjpy: '+0.22%'
        };

        return changes[pair] || null;
    };

    return {
        rates,
        loading,
        error,
        lastUpdate,
        refresh: loadRates,
        getFormattedRate,
        getChange
    };
};