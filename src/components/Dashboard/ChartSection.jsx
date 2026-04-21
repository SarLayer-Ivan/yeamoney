import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { useTheme } from '../../context/ThemeContext';
import { fetchChartData } from '../../api/finhubApi';

const CHART_PAIRS = [
    { from: 'EUR', to: 'USD', label: 'EUR/USD', color: '#3b82f6' },
    { from: 'GBP', to: 'USD', label: 'GBP/USD', color: '#10b981' },
    { from: 'USD', to: 'JPY', label: 'USD/JPY', color: '#f59e0b' }
];

const ChartSection = () => {
    const chartRef = useRef(null);
    const canvasRef = useRef(null);
    const { theme } = useTheme();
    const [selectedPair, setSelectedPair] = useState(CHART_PAIRS[0]);
    const [loading, setLoading] = useState(false);
    const [chartData, setChartData] = useState({ labels: [], dataPoints: [] });

    // Загрузка данных при смене пары
    useEffect(() => {
        const loadChartData = async () => {
            setLoading(true);
            try {
                const data = await fetchChartData(selectedPair.from, selectedPair.to);
                setChartData(data);
            } catch (error) {
                console.error('Error loading chart data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadChartData();
    }, [selectedPair]);

    // Отрисовка графика
    useEffect(() => {
        if (!canvasRef.current || !chartData.labels.length) return;

        const ctx = canvasRef.current.getContext('2d');

        if (chartRef.current) {
            chartRef.current.destroy();
        }

        const textColor = getComputedStyle(document.body).getPropertyValue('--text-primary').trim();
        const secondaryColor = getComputedStyle(document.body).getPropertyValue('--text-secondary').trim();
        const bgColor = getComputedStyle(document.body).getPropertyValue('--bg-secondary').trim();

        chartRef.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: selectedPair.label,
                    data: chartData.dataPoints,
                    borderColor: selectedPair.color,
                    backgroundColor: `${selectedPair.color}10`,
                    tension: 0.2,
                    fill: true,
                    pointBackgroundColor: selectedPair.color,
                    pointBorderColor: bgColor,
                    pointBorderWidth: 2,
                    pointRadius: 3,
                    pointHoverRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        labels: {
                            color: textColor || '#f1f5f9',
                            font: { size: 14, weight: '600' }
                        }
                    },
                    tooltip: {
                        backgroundColor: bgColor,
                        titleColor: textColor,
                        bodyColor: secondaryColor,
                        borderColor: selectedPair.color,
                        borderWidth: 1
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: secondaryColor || '#94a3b8',
                            maxRotation: 45,
                            font: { size: 11 }
                        },
                        grid: {
                            color: 'rgba(148, 163, 184, 0.1)',
                            display: false
                        }
                    },
                    y: {
                        ticks: {
                            color: secondaryColor || '#94a3b8',
                            callback: (value) => {
                                if (selectedPair.to === 'JPY') {
                                    return value.toFixed(2);
                                }
                                return value.toFixed(4);
                            }
                        },
                        grid: {
                            color: 'rgba(148, 163, 184, 0.1)'
                        }
                    }
                }
            }
        });

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [chartData, selectedPair, theme]);

    return (
        <div className="chart-container">
            {/* Переключатель валютных пар */}
            <div style={{
                display: 'flex',
                gap: 8,
                marginBottom: 16,
                flexWrap: 'wrap'
            }}>
                {CHART_PAIRS.map((pair) => (
                    <button
                        key={pair.label}
                        onClick={() => setSelectedPair(pair)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '20px',
                            border: '1.5px solid',
                            borderColor: selectedPair.label === pair.label ? pair.color : 'var(--border-color)',
                            background: selectedPair.label === pair.label ? `${pair.color}20` : 'transparent',
                            color: selectedPair.label === pair.label ? pair.color : 'var(--text-secondary)',
                            fontWeight: selectedPair.label === pair.label ? '600' : '400',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontSize: 14
                        }}
                        onMouseEnter={(e) => {
                            if (selectedPair.label !== pair.label) {
                                e.currentTarget.style.background = `${pair.color}10`;
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (selectedPair.label !== pair.label) {
                                e.currentTarget.style.background = 'transparent';
                            }
                        }}
                    >
                        {pair.label}
                    </button>
                ))}
            </div>

            {/* График */}
            <div style={{ position: 'relative', height: 'calc(100% - 50px)' }}>
                {loading && (
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: 'var(--text-secondary)',
                        zIndex: 10
                    }}>
                        <i className="fas fa-spinner fa-spin"></i> Загрузка...
                    </div>
                )}
                <canvas ref={canvasRef} style={{ opacity: loading ? 0.5 : 1 }}></canvas>
            </div>
        </div>
    );
};

export default ChartSection;