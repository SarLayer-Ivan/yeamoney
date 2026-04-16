import { CONFIG, CURRENCY_PAIRS, MOCK_RATES, MOCK_BTC_PRICE } from '../utils/constants';
import { getMockChartData, getMockNews } from '../utils/mockData';

// Проверка наличия API ключа
const hasAlphaVantageKey = () => {
    return CONFIG.ALPHA_VANTAGE_KEY && !CONFIG.ALPHA_VANTAGE_KEY.includes('ВАШ_API');
};

const hasNewsApiKey = () => {
    return CONFIG.NEWS_API_KEY && !CONFIG.NEWS_API_KEY.includes('ВАШ_API');
};

// Получение курсов валют
export const fetchForexRates = async () => {
    const results = {};

    for (const pair of CURRENCY_PAIRS) {
        try {
            if (!hasAlphaVantageKey()) {
                results[pair.from + pair.to] = MOCK_RATES[pair.from + pair.to] || 1.0;
                continue;
            }

            const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${pair.from}&to_currency=${pair.to}&apikey=${CONFIG.ALPHA_VANTAGE_KEY}`;
            const res = await fetch(url);
            const data = await res.json();
            const rate = data['Realtime Currency Exchange Rate']?.['5. Exchange Rate'];

            if (rate) {
                results[pair.from + pair.to] = parseFloat(rate);
            } else {
                results[pair.from + pair.to] = MOCK_RATES[pair.from + pair.to] || 1.0;
            }
        } catch (e) {
            console.error(`Error fetching ${pair.from}/${pair.to}:`, e);
            results[pair.from + pair.to] = MOCK_RATES[pair.from + pair.to] || 1.0;
        }
    }

    return results;
};

// Получение данных для графика
export const fetchChartData = async () => {
    if (!hasAlphaVantageKey()) {
        return getMockChartData();
    }

    try {
        const url = `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=EUR&to_symbol=USD&apikey=${CONFIG.ALPHA_VANTAGE_KEY}`;
        const res = await fetch(url);
        const json = await res.json();
        const series = json['Time Series FX (Daily)'];

        if (series) {
            const dates = Object.keys(series).slice(0, 15).reverse();
            const labels = dates;
            const dataPoints = dates.map(d => parseFloat(series[d]['4. close']));
            return { labels, dataPoints };
        }
    } catch (e) {
        console.error('Error fetching chart data:', e);
    }

    return getMockChartData();
};

// Получение новостей
export const fetchNews = async () => {
    if (!hasNewsApiKey()) {
        return getMockNews();
    }

    try {
        const url = `https://newsapi.org/v2/everything?q=forex&language=ru&pageSize=5&apiKey=${CONFIG.NEWS_API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.articles && data.articles.length > 0) {
            return data.articles;
        }
    } catch (e) {
        console.error('Error fetching news:', e);
    }

    return getMockNews();
};

// Получение курса BTC (мок)
export const fetchBTCRate = async () => {
    return MOCK_BTC_PRICE;
};