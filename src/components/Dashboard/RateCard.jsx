import React from 'react';

const RateCard = ({ pair, price, change, icon = null }) => {
    return (
        <div className="rate-card">
            <div className="pair">
                {icon && <i className={`fas fa-${icon}`} style={{ marginRight: 6 }}></i>}
                {pair}
            </div>
            <div className="price">{price || '—'}</div>
            <div className="change">{change || 'Загрузка...'}</div>
        </div>
    );
};

export default RateCard;