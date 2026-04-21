import { useState, useEffect, useCallback } from 'react';
import { fetchNews } from '../api/finhubApi';

export const useNewsData = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadNews = useCallback(async () => {
        try {
            console.log('📰 useNewsData - loading news...');
            setLoading(true);

            const newsData = await fetchNews();
            console.log('📰 useNewsData - received news:', newsData);

            setNews(newsData.slice(0, 5));
            setError(null);
        } catch (e) {
            console.error('❌ useNewsData - error:', e);
            setError('Ошибка загрузки новостей');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadNews();

        // Обновление каждые 10 минут
        const interval = setInterval(loadNews, 600000);

        return () => clearInterval(interval);
    }, [loadNews]);

    return {
        news,
        loading,
        error,
        refresh: loadNews
    };
};