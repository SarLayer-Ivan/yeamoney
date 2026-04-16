export const getMockRates = () => ({
    'EURUSD': 1.0925,
    'GBPUSD': 1.2710,
    'USDJPY': 148.35,
});

export const getMockChartData = () => {
    const labels = ['Д-5', 'Д-4', 'Д-3', 'Д-2', 'Вчера', 'Сегодня'];
    const dataPoints = [1.085, 1.088, 1.083, 1.090, 1.092, 1.094];
    return { labels, dataPoints };
};

export const getMockNews = () => [
    {
        title: 'Доллар укрепляется на фоне статистики',
        publishedAt: new Date().toISOString(),
        source: { name: 'FinDash' }
    },
    {
        title: 'ЕЦБ сохранил ставку без изменений',
        publishedAt: new Date().toISOString(),
        source: { name: 'FinDash' }
    },
    {
        title: 'Биткоин обновил исторический максимум',
        publishedAt: new Date().toISOString(),
        source: { name: 'FinDash' }
    },
    {
        title: 'ФРС сигнализирует о снижении ставки в 2026',
        publishedAt: new Date().toISOString(),
        source: { name: 'FinDash' }
    },
    {
        title: 'Нефть марки Brent торгуется выше $85',
        publishedAt: new Date().toISOString(),
        source: { name: 'FinDash' }
    }
];