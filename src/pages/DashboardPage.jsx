import React from 'react';
import Navbar from '../components/Layout/Navbar';
import RatesGrid from '../components/Dashboard/RatesGrid';
import BalanceCard from '../components/Dashboard/BalanceCard'; // ⬅️ НОВОЕ
import ChartSection from '../components/Dashboard/ChartSection';
import NewsPanel from '../components/Dashboard/NewPanel';
import TransferPanel from '../components/Dashboard/TransferPanel';

const DashboardPage = () => {
    return (
        <div className="dashboard">
            <Navbar />

            {/* ⬅️ НОВОЕ: Карточка баланса в начале */}
            <BalanceCard />

            <RatesGrid />
            <ChartSection />

            <div className="two-columns">
                <NewsPanel />
                <TransferPanel />
            </div>
        </div>
    );
};

export default DashboardPage;