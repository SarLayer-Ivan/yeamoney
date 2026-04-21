import { CONFIG, CURRENCY_PAIRS, MOCK_RATES } from '../utils/constants';
import { getMockChartData, getMockNews } from '../utils/mockData';

// Проверка наличия API ключа
const hasAlphaVantageKey = () => {
    return CONFIG.ALPHA_VANTAGE_KEY &&
        !CONFIG.ALPHA_VANTAGE_KEY.includes('ВАШ_API') &&
        CONFIG.ALPHA_VANTAGE_KEY.length > 0;
};

const hasNewsApiKey = () => {
    return CONFIG.NEWS_API_KEY &&
        !CONFIG.NEWS_API_KEY.includes('ВАШ_API') &&
        CONFIG.NEWS_API_KEY.length > 0;
};

// Получение курсов валют
export const fetchForexRates = async () => {
    console.log('🔄 fetchForexRates - starting...');
    console.log('🔑 Alpha Vantage key exists:', hasAlphaVantageKey());

    const results = {};

    for (const pair of CURRENCY_PAIRS) {
        try {
            if (!hasAlphaVantageKey()) {
                console.log(`📦 Using mock data for ${pair.from}/${pair.to}`);
                results[pair.from + pair.to] = MOCK_RATES[pair.from + pair.to] || 1.0;
                continue;
            }

            const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${pair.from}&to_currency=${pair.to}&apikey=${CONFIG.ALPHA_VANTAGE_KEY}`;
            console.log(`🌐 Fetching ${pair.from}/${pair.to}...`);

            const res = await fetch(url);
            const data = await res.json();

            console.log(`📊 ${pair.from}/${pair.to} response:`, data);

            const rate = data['Realtime Currency Exchange Rate']?.['5. Exchange Rate'];

            if (rate) {
                results[pair.from + pair.to] = parseFloat(rate);
                console.log(`✅ ${pair.from}/${pair.to} = ${rate}`);
            } else {
                console.warn(`⚠️ No rate for ${pair.from}/${pair.to}, using mock`);
                results[pair.from + pair.to] = MOCK_RATES[pair.from + pair.to] || 1.0;
            }

            // Задержка чтобы не превысить лимит запросов
            await new Promise(resolve => setTimeout(resolve, 15000));

        } catch (e) {
            console.error(`❌ Error fetching ${pair.from}/${pair.to}:`, e);
            results[pair.from + pair.to] = MOCK_RATES[pair.from + pair.to] || 1.0;
        }
    }

    console.log('✅ fetchForexRates - results:', results);
    return results;
};

// Получение данных для графика (для конкретной пары)
export const fetchChartData = async (fromSymbol = 'EUR', toSymbol = 'USD') => {
    console.log(`📈 fetchChartData - starting for ${fromSymbol}/${toSymbol}...`);

    if (!hasAlphaVantageKey()) {
        console.log('📦 Using mock chart data');
        return getMockChartData(fromSymbol, toSymbol);
    }

    try {
        const url = `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=${fromSymbol}&to_symbol=${toSymbol}&apikey=${CONFIG.ALPHA_VANTAGE_KEY}`;
        console.log(`🌐 Fetching chart data for ${fromSymbol}/${toSymbol}...`);

        const res = await fetch(url);
        const json = await res.json();

        console.log(`📊 Chart data response for ${fromSymbol}/${toSymbol}:`, json);

        const series = json['Time Series FX (Daily)'];

        if (series) {
            const dates = Object.keys(series).slice(0, 30).reverse();
            const labels = dates.map(date => {
                const d = new Date(date);
                return `${d.getDate()}.${d.getMonth() + 1}`;
            });
            const dataPoints = dates.map(d => parseFloat(series[d]['4. close']));

            console.log(`✅ Chart data loaded for ${fromSymbol}/${toSymbol}:`, { labels, dataPoints });
            return { labels, dataPoints };
        } else {
            console.warn(`⚠️ No chart data for ${fromSymbol}/${toSymbol}, using mock`);
        }
    } catch (e) {
        console.error(`❌ Error fetching chart data for ${fromSymbol}/${toSymbol}:`, e);
    }

    return getMockChartData(fromSymbol, toSymbol);
};

// Получение новостей
export const fetchNews = async () => {
    console.log('📰 fetchNews - starting...');

    if (!hasNewsApiKey()) {
        console.log('📦 Using mock news');
        return getMockNews();
    }

    try {
        const url = `https://newsapi.org/v2/everything?q=finance&language=en&pageSize=5&apiKey=${CONFIG.NEWS_API_KEY}`;
        console.log('🌐 Fetching news...');

        const res = await fetch(url);
        const data = await res.json();

        console.log('📊 News API response:', data);

        if (data.status === 'ok' && data.articles && data.articles.length > 0) {
            console.log(`✅ Loaded ${data.articles.length} news`);
            return data.articles;
        } else {
            console.warn('⚠️ No news from API, using mock');
        }
    } catch (e) {
        console.error('❌ Error fetching news:', e);
    }

    return getMockNews();
};