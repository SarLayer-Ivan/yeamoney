import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../UI/Button';
import Input from '../UI/Input';

const BalanceCard = () => {
    const { currentUser, deposit } = useAuth();
    const [depositAmount, setDepositAmount] = useState('');
    const [showDeposit, setShowDeposit] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleDeposit = () => {
        const amount = parseFloat(depositAmount);

        if (!depositAmount || amount <= 0 || isNaN(amount)) {
            setMessage({ text: '❌ Введите корректную сумму', type: 'error' });
            return;
        }

        const result = deposit(amount);
        if (result.success) {
            setMessage({
                text: `✅ Баланс пополнен на $${amount.toFixed(2)}`,
                type: 'success'
            });
            setDepositAmount('');

            // Закрываем форму через 1.5 секунды
            setTimeout(() => {
                setShowDeposit(false);
                setMessage({ text: '', type: '' });
            }, 1500);
        } else {
            setMessage({ text: `❌ ${result.error}`, type: 'error' });
        }
    };

    const formatBalance = (balance) => {
        return balance?.toFixed(2) || '0.00';
    };

    const currentBalance = currentUser?.balance || 0;
    const isBalanceLow = currentBalance < 100;
    const isBalanceZero = currentBalance === 0;

    return (
        <div className="rate-card" style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <div className="pair" style={{ display: 'flex', alignItems: 'center' }}>
                        <i className="fas fa-wallet" style={{ marginRight: 8, color: 'var(--accent)' }}></i>
                        Ваш баланс
                    </div>
                    <div
                        className="price"
                        style={{
                            fontSize: 36,
                            color: isBalanceZero ? 'var(--danger)' : 'var(--text-primary)'
                        }}
                    >
                        ${formatBalance(currentBalance)}
                    </div>
                    <div className="change" style={{
                        color: isBalanceZero ? 'var(--danger)' : 'var(--success)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                    }}>
                        {isBalanceZero ? (
                            <>
                                <i className="fas fa-exclamation-circle"></i>
                                <span>Баланс пуст. Пополните счёт.</span>
                            </>
                        ) : isBalanceLow ? (
                            <>
                                <i className="fas fa-exclamation-triangle" style={{ color: '#f59e0b' }}></i>
                                <span style={{ color: '#f59e0b' }}>Низкий баланс</span>
                            </>
                        ) : (
                            <>
                                <i className="fas fa-check-circle"></i>
                                <span>Доступно для переводов</span>
                            </>
                        )}
                    </div>
                </div>

                <div style={{ minWidth: 280 }}>
                    {!showDeposit ? (
                        <Button
                            onClick={() => setShowDeposit(true)}
                            icon="plus"
                        >
                            Пополнить баланс
                        </Button>
                    ) : (
                        <div>
                            <Input
                                label="Сумма пополнения (USD)"
                                type="number"
                                value={depositAmount}
                                onChange={(e) => {
                                    setDepositAmount(e.target.value);
                                    setMessage({ text: '', type: '' });
                                }}
                                placeholder="Например: 100.00"
                                step="0.01"
                                min="0.01"
                            />

                            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                <Button onClick={handleDeposit} icon="check">
                                    Пополнить
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setShowDeposit(false);
                                        setDepositAmount('');
                                        setMessage({ text: '', type: '' });
                                    }}
                                >
                                    Отмена
                                </Button>
                            </div>

                            <p style={{ marginTop: 12, fontSize: 12, color: 'var(--text-secondary)' }}>
                                <i className="fas fa-info-circle"></i> Демо-пополнение. Средства виртуальные.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {message.text && (
                <div
                    style={{
                        marginTop: 16,
                        padding: 12,
                        borderRadius: 10,
                        background: message.type === 'success' ? 'var(--success)' : 'var(--danger)',
                        color: 'white',
                        fontSize: 14,
                        display: 'flex',
                        alignItems: 'center',
                        animation: message.type === 'success' ? 'fadeIn 0.3s ease' : 'shake 0.3s ease'
                    }}
                >
                    <i className={`fas fa-${message.type === 'success' ? 'check-circle' : 'exclamation-circle'}`} style={{ marginRight: 8 }}></i>
                    {message.text}
                </div>
            )}
        </div>
    );
};

export default BalanceCard;