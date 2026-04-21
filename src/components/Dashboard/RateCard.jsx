import React from 'react';

const RateCard = ({ pair, price, change, icon = null }) => {
    // Определяем цвет изменения
    const getChangeColor = (changeText) => {
        if (!changeText || changeText === 'Загрузка...') return 'var(--text-secondary)';
        if (changeText.includes('+')) return 'var(--success)';
        if (changeText.includes('-')) return 'var(--danger)';
        return 'var(--text-secondary)';
    };

    return (
        <div className="rate-card">
            <div className="pair">
                {icon && <i className={`fas fa-${icon}`} style={{ marginRight: 6 }}></i>}
                {pair}
            </div>
            <div className="price">
                {price || '—'}
                {price && pair.includes('USD/JPY') && ' ¥'}
                {price && !pair.includes('USD/JPY') && !pair.includes('BTC') && ' $'}
            </div>
            <div className="change" style={{ color: getChangeColor(change) }}>
                {change && change.includes('+') && <i className="fas fa-arrow-up" style={{ marginRight: 4, fontSize: 10 }}></i>}
                {change && change.includes('-') && <i className="fas fa-arrow-down" style={{ marginRight: 4, fontSize: 10 }}></i>}
                {change || '—'}
            </div>
        </div>
    );
};

export default RateCard;