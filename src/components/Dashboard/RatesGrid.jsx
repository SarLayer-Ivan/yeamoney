import React from 'react';
import RateCard from './RateCard';
import { useForexData } from '../../hooks/useForexData';

const RatesGrid = () => {
    const {loading, getFormattedRate, getChange, lastUpdate } = useForexData();

    const cards = [
        {
            pair: 'EUR/USD',
            rate: getFormattedRate('eurusd'),
            change: getChange('eurusd'),
            icon: 'euro-sign'
        },
        {
            pair: 'GBP/USD',
            rate: getFormattedRate('gbpusd'),
            change: getChange('gbpusd'),
            icon: 'pound-sign'
        },
        {
            pair: 'USD/JPY',
            rate: getFormattedRate('usdjpy'),
            change: getChange('usdjpy'),
            icon: 'yen-sign'
        }
    ];

    return (
        <>
            <div className="cards-grid">
                {cards.map((card, index) => (
                    <RateCard
                        key={index}
                        pair={card.pair}
                        price={card.rate}
                        change={loading ? 'Загрузка...' : card.change}
                        icon={card.icon}
                    />
                ))}
            </div>
            {lastUpdate && (
                <div style={{
                    fontSize: 12,
                    color: 'var(--text-secondary)',
                    marginTop: -10,
                    marginBottom: 20,
                    textAlign: 'right'
                }}>
                    <i className="fas fa-clock" style={{ marginRight: 4 }}></i>
                    Обновлено: {lastUpdate.toLocaleTimeString()}
                </div>
            )}
        </>
    );
};

export default RatesGrid;