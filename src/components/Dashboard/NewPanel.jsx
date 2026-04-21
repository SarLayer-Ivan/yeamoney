import React from 'react';
import { useNewsData } from '../../hooks/useNewData';
import { formatDate } from '../../utils/helpers';

const NewsPanel = () => {
    const { news, loading, error } = useNewsData();

    if (error) {
        return (
            <div className="news-panel">
                <div className="section-title">
                    <i className="fas fa-newspaper"></i> Финансовые новости
                </div>
                <div className="news-item" style={{ color: 'var(--danger)' }}>
                    <i className="fas fa-exclamation-triangle"></i> {error}
                </div>
            </div>
        );
    }

    return (
        <div className="news-panel">
            <div className="section-title">
                <i className="fas fa-newspaper"></i> Финансовые новости
                {!loading && news.length > 0 && (
                    <span style={{ fontSize: 12, marginLeft: 8, color: 'var(--text-secondary)' }}>
            ({news.length})
          </span>
                )}
            </div>

            <div id="newsList">
                {loading ? (
                    <div className="news-item">
                        <i className="fas fa-spinner fa-spin"></i> Загрузка новостей...
                    </div>
                ) : news.length > 0 ? (
                    news.map((item, index) => (
                        <div key={index} className="news-item">
                            <div className="news-title">
                                {item.url ? (
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: 'var(--text-primary)', textDecoration: 'none' }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
                                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                                    >
                                        {item.title || 'Без заголовка'}
                                    </a>
                                ) : (
                                    item.title || 'Без заголовка'
                                )}
                            </div>
                            <div className="news-meta">
                                {item.source?.name || 'FinDash'} · {formatDate(item.publishedAt)}
                            </div>
                            {item.description && (
                                <div style={{ fontSize: 13, marginTop: 8, color: 'var(--text-secondary)' }}>
                                    {item.description.slice(0, 100)}...
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="news-item">Новости временно недоступны</div>
                )}
            </div>
        </div>
    );
};

export default NewsPanel;