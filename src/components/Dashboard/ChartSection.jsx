import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { useTheme } from '../../context/ThemeContext';
import { fetchChartData } from '../../api/finhubApi';

const ChartSection = () => {
    const chartRef = useRef(null);
    const canvasRef = useRef(null);
    const { theme } = useTheme();

    useEffect(() => {
        const loadChart = async () => {
            const { labels, dataPoints } = await fetchChartData();
            const ctx = canvasRef.current.getContext('2d');

            if (chartRef.current) {
                chartRef.current.destroy();
            }

            const textColor = getComputedStyle(document.body).getPropertyValue('--text-primary').trim();
            const secondaryColor = getComputedStyle(document.body).getPropertyValue('--text-secondary').trim();

            chartRef.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels,
                    datasets: [{
                        label: 'EUR/USD',
                        data: dataPoints,
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.05)',
                        tension: 0.2,
                        fill: true,
                        pointBackgroundColor: '#3b82f6',
                        pointBorderColor: '#3b82f6'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: { color: textColor || '#f1f5f9' }
                        }
                    },
                    scales: {
                        x: {
                            ticks: { color: secondaryColor || '#94a3b8' },
                            grid: { color: 'rgba(148, 163, 184, 0.1)' }
                        },
                        y: {
                            ticks: { color: secondaryColor || '#94a3b8' },
                            grid: { color: 'rgba(148, 163, 184, 0.1)' }
                        }
                    }
                }
            });
        };

        loadChart();
    }, [theme]);

    return (
        <div className="chart-container">
            <canvas ref={canvasRef}></canvas>
        </div>
    );
};

export default ChartSection;