import React from 'react';

const Card = ({ children, className = '', padding = true }) => {
    return (
        <div className={`rate-card ${className}`} style={{ padding: padding ? undefined : 0 }}>
            {children}
        </div>
    );
};

export default Card;