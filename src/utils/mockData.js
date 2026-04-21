export const getMockRates = () => ({
    'EURUSD': 1.0925,
    'GBPUSD': 1.2710,
    'USDJPY': 148.35,
});

export const getMockChartData = (fromSymbol = 'EUR', toSymbol = 'USD') => {
    const mockData = {
        'EURUSD': {
            labels: ['10.4', '11.4', '12.4', '13.4', '14.4', '15.4', '16.4'],
            dataPoints: [1.085, 1.088, 1.083, 1.090, 1.092, 1.094, 1.091]
        },
        'GBPUSD': {
            labels: ['10.4', '11.4', '12.4', '13.4', '14.4', '15.4', '16.4'],
            dataPoints: [1.265, 1.268, 1.262, 1.270, 1.272, 1.275, 1.271]
        },
        'USDJPY': {
            labels: ['10.4', '11.4', '12.4', '13.4', '14.4', '15.4', '16.4'],
            dataPoints: [147.50, 147.80, 148.20, 148.00, 148.50, 148.35, 148.10]
        }
    };

    const key = fromSymbol + toSymbol;
    return mockData[key] || mockData['EURUSD'];
};

export const getMockNews = () => [
    {
        title: 'Доллар укрепляется на фоне статистики',
        publishedAt: new Date().toISOString(),
        source: { name: 'FinDash' },
        description: 'Индекс доллара вырос на 0.3% после публикации данных по рынку труда.'
    },
    {
        title: 'ЕЦБ сохранил ставку без изменений',
        publishedAt: new Date().toISOString(),
        source: { name: 'FinDash' },
        description: 'Европейский центральный банк оставил ключевую ставку на уровне 4.5%.'
    },
    {
        title: 'ФРС сигнализирует о снижении ставки в 2026',
        publishedAt: new Date().toISOString(),
        source: { name: 'FinDash' },
        description: 'Федеральная резервная система может начать снижение ставок в следующем году.'
    },
    {
        title: 'Нефть марки Brent торгуется выше $85',
        publishedAt: new Date().toISOString(),
        source: { name: 'FinDash' },
        description: 'Цены на нефть продолжают расти на фоне геополитической напряженности.'
    },
    {
        title: 'Японская иена слабеет к доллару',
        publishedAt: new Date().toISOString(),
        source: { name: 'FinDash' },
        description: 'USD/JPY достиг нового месячного максимума.'
    }
];