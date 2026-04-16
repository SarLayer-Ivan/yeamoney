import React from 'react';
import { useNewsData } from '../../hooks/useNewData';
import { formatDate } from '../../utils/helpers';

const NewsPanel = () => {
    const { news, loading } = useNewsData();

    return (
        <div className="news-panel">
            <div className="section-title">
                <i className="fas fa-newspaper"></i> Финансовые новости
            </div>

            <div id="newsList">
                {loading ? (
                    <div className="news-item">Загрузка новостей...</div>
                ) : news.length > 0 ? (
                    news.map((item, index) => (
                        <div key={index} className="news-item">
                            <div className="news-title">{item.title || 'Без заголовка'}</div>
                            <div className="news-meta">
                                {item.source?.name || 'FinDash'} · {formatDate(item.publishedAt)}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="news-item">Новости недоступны</div>
                )}
            </div>
        </div>
    );
};

export default NewsPanel;