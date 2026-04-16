import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Input from '../UI/Input';
import Button from '../UI/Button';
import { generateCardNumber } from '../../utils/helpers';

const TransferPanel = () => {
    const { currentUser, updateUserCards } = useAuth();
    const [amount, setAmount] = useState('');
    const [selectedCard, setSelectedCard] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        if (currentUser?.cards?.length > 0 && !selectedCard) {
            setSelectedCard(currentUser.cards[0].full);
        }
    }, [currentUser, selectedCard]);

    const handleTransfer = () => {
        const numAmount = parseFloat(amount);

        if (!amount || numAmount <= 0 || isNaN(numAmount)) {
            setMessage({ text: 'Введите корректную сумму', type: 'error' });
            return;
        }

        setMessage({
            text: `✅ Перевод $${numAmount.toFixed(2)} на карту ${selectedCard} выполнен успешно! (Демо)`,
            type: 'success'
        });
        setAmount('');
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
                >
                    {currentUser?.cards?.map(card => (
                        <option key={card.id} value={card.full}>
                            {card.bank} {card.full} {card.id === currentUser.cards[0]?.id ? '(Основная)' : ''}
                        </option>
                    ))}
                </select>
            </div>

            <Input
                label="Сумма (USD)"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="100.00"
                step="0.01"
                min="0.01"
            />

            <Button onClick={handleTransfer} icon="paper-plane">
                Перевести (демо)
            </Button>

            {message.text && (
                <div className={`transfer-result ${message.type}`}>
                    {message.text}
                </div>
            )}

            <p style={{ marginTop: 16, fontSize: 13, color: 'var(--text-secondary)' }}>
                <i className="fas fa-shield-alt"></i> Симуляция. Реальные средства не переводятся.
            </p>

            <hr />

            <Button variant="outline" onClick={addDemoCard} icon="plus">
                Добавить карту (демо)
            </Button>
        </div>
    );
};

export default TransferPanel;