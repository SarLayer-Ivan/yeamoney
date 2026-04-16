export const CONFIG = {
    ALPHA_VANTAGE_KEY: 'ВАШ_API_КЛЮЧ_ALPHA_VANTAGE', // Замените на свой
    NEWS_API_KEY: 'ВАШ_API_КЛЮЧ_NEWSAPI',           // Замените на свой
};

export const CURRENCY_PAIRS = [
    { from: 'EUR', to: 'USD', id: 'eurusd', label: 'EUR/USD' },
    { from: 'GBP', to: 'USD', id: 'gbpusd', label: 'GBP/USD' },
    { from: 'USD', to: 'JPY', id: 'usdjpy', label: 'USD/JPY' },
];

export const MOCK_RATES = {
    'EURUSD': 1.0925,
    'GBPUSD': 1.2710,
    'USDJPY': 148.35,
};

export const MOCK_BTC_PRICE = '67250.00';