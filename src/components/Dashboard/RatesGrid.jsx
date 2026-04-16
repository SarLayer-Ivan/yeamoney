import React from 'react';
import RateCard from './RateCard';
import { useForexData } from '../../hooks/useForexData';

const RatesGrid = () => {
    const { rates, loading, getFormattedRate } = useForexData();

    const cards = [
        { pair: 'EUR/USD', rate: getFormattedRate('eurusd'), icon: 'euro-sign' },
        { pair: 'GBP/USD', rate: getFormattedRate('gbpusd'), icon: 'pound-sign' },
        { pair: 'USD/JPY', rate: getFormattedRate('usdjpy'), icon: 'yen-sign' },
        { pair: 'BTC/USD', rate: rates.btcusd || '—', icon: 'bitcoin', change: 'Цифровой' }
    ];

    return (
        <div className="cards-grid">
            {cards.map((card, index) => (
                <RateCard
                    key={index}
                    pair={card.pair}
                    price={card.rate}
                    change={card.change || (loading ? 'Загрузка...' : '')}
                    icon={card.icon}
                />
            ))}
        </div>
    );
};

export default RatesGrid;