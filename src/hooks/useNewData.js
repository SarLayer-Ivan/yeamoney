import { useState, useEffect, useCallback } from 'react';
import { fetchNews } from '../api/finhubApi';

export const useNewsData = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadNews = useCallback(async () => {
        try {
            setLoading(true);
            const newsData = await fetchNews();
            setNews(newsData.slice(0, 5));
            setError(null);
        } catch (e) {
            setError('Ошибка загрузки новостей');
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadNews();
    }, [loadNews]);

    return {
        news,
        loading,
        error,
        refresh: loadNews
    };
};