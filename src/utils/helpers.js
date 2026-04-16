export const formatPrice = (price, digits = 4) => {
    if (price === null || price === undefined) return '—';
    return parseFloat(price).toFixed(digits);
};

export const getUserInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    return parts.map(p => p[0]).join('').toUpperCase().substring(0, 2);
};

export const formatDate = (dateString) => {
    try {
        return new Date(dateString).toLocaleDateString('ru-RU');
    } catch {
        return dateString;
    }
};

export const generateCardNumber = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};