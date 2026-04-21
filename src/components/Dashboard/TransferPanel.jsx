import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Input from '../UI/Input';
import Button from '../UI/Button';
import { generateCardNumber } from '../../utils/helpers';

const TransferPanel = () => {
    const { currentUser, updateUserCards, withdraw } = useAuth();
    const [amount, setAmount] = useState('');
    const [selectedCard, setSelectedCard] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isTransferring, setIsTransferring] = useState(false);

    useEffect(() => {
        if (currentUser?.cards?.length > 0 && !selectedCard) {
            setSelectedCard(currentUser.cards[0].full);
        }
    }, [currentUser, selectedCard]);

    const handleTransfer = () => {
        const numAmount = parseFloat(amount);

        // Сброс предыдущего сообщения
        setMessage({ text: '', type: '' });

        // Валидация суммы
        if (!amount || numAmount <= 0 || isNaN(numAmount)) {
            setMessage({ text: '❌ Введите корректную сумму', type: 'error' });
            return;
        }

        // Проверка баланса через withdraw
        const result = withdraw(numAmount);

        if (!result.success) {
            // Отображаем ошибку недостатка средств
            setMessage({
                text: `❌ ${result.error}`,
                type: 'error'
            });
            return;
        }

        // Успешный перевод
        setIsTransferring(true);

        setMessage({
            text: `✅ Перевод $${numAmount.toFixed(2)} на карту ${selectedCard} выполнен успешно!`,
            type: 'success'
        });
        setAmount('');

        // Сбрасываем анимацию через 3 секунды
        setTimeout(() => {
            setIsTransferring(false);
        }, 3000);
    };

    const addDemoCard = () => {
        const newCardNum = generateCardNumber();
        const newCard = {
            id: Date.now(),
            number: newCardNum,
            bank: Math.random() > 0.5 ? 'Visa' : 'MasterCard',
            full: `•••• ${newCardNum}`
        };

        const updatedCards = [...(currentUser.cards || []), newCard];
        updateUserCards(updatedCards);
        setSelectedCard(newCard.full);
    };

    const currentBalance = currentUser?.balance || 0;
    const isBalanceLow = currentBalance < 100;
    const isBalanceZero = currentBalance === 0;

    return (
        <div className="transfer-panel">
            <div className="section-title">
                <i className="fas fa-credit-card"></i> Перевод на карту
            </div>

            <div className="card-selector">
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>Карта получателя</label>
                <select
                    value={selectedCard}
                    onChange={(e) => setSelectedCard(e.target.value)}
                    disabled={isBalanceZero}
                    style={{ opacity: isBalanceZero ? 0.6 : 1 }}
                >
                    {currentUser?.cards?.map(card => (
                        <option key={card.id} value={card.full}>
                            {card.bank} {card.full} {card.id === currentUser.cards[0]?.id ? '(Основная)' : ''}
                        </option>
                    ))}
                </select>
            </div>

            {/* Блок с балансом */}
            <div
                style={{
                    marginBottom: 16,
                    padding: 16,
                    background: isBalanceZero ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-primary)',
                    borderRadius: 10,
                    border: isBalanceZero ? '1px solid var(--danger)' : 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
        <span style={{ color: 'var(--text-secondary)' }}>
          <i className="fas fa-wallet" style={{ marginRight: 8 }}></i>
          Доступно:
        </span>
                <span style={{
                    fontWeight: 600,
                    color: isBalanceZero ? 'var(--danger)' : 'var(--text-primary)',
                    fontSize: 18
                }}>
          ${currentBalance.toFixed(2)}
        </span>
            </div>

            {/* Предупреждение о низком балансе */}
            {isBalanceLow && !isBalanceZero && (
                <div style={{
                    marginBottom: 16,
                    padding: 12,
                    background: 'rgba(245, 158, 11, 0.1)',
                    borderRadius: 10,
                    border: '1px solid #f59e0b',
                    color: '#f59e0b',
                    fontSize: 13,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                }}>
                    <i className="fas fa-exclamation-triangle"></i>
                    <span>Низкий баланс. Рекомендуем пополнить счёт.</span>
                </div>
            )}

            {/* Предупреждение о нулевом балансе */}
            {isBalanceZero && (
                <div style={{
                    marginBottom: 16,
                    padding: 12,
                    background: 'rgba(239, 68, 68, 0.1)',
                    borderRadius: 10,
                    border: '1px solid var(--danger)',
                    color: 'var(--danger)',
                    fontSize: 13,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                }}>
                    <i className="fas fa-times-circle"></i>
                    <span>У вас недостаточно средств. Пополните баланс для переводов.</span>
                </div>
            )}

            <Input
                label="Сумма перевода (USD)"
                type="number"
                value={amount}
                onChange={(e) => {
                    setAmount(e.target.value);
                    setMessage({ text: '', type: '' });
                }}
                placeholder="100.00"
                step="0.01"
                min="0.01"
                disabled={isBalanceZero}
            />

            <Button
                onClick={handleTransfer}
                icon={isTransferring ? 'spinner fa-spin' : 'paper-plane'}
                disabled={isBalanceZero || isTransferring}
            >
                {isTransferring ? 'Перевод...' : 'Перевести'}
            </Button>

            {message.text && (
                <div
                    className={`transfer-result ${message.type}`}
                    style={{
                        animation: message.type === 'success' ? 'fadeIn 0.3s ease' : 'shake 0.3s ease'
                    }}
                >
                    <i className={`fas fa-${message.type === 'success' ? 'check-circle' : 'exclamation-circle'}`} style={{ marginRight: 8 }}></i>
                    {message.text}
                </div>
            )}

            <p style={{ marginTop: 16, fontSize: 13, color: 'var(--text-secondary)' }}>
                <i className="fas fa-shield-alt"></i> Демо-режим. Средства виртуальные.
            </p>

            <hr />

            <Button variant="outline" onClick={addDemoCard} icon="plus">
                Добавить карту (демо)
            </Button>
        </div>
    );
};

export default TransferPanel;