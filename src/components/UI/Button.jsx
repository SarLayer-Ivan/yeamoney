import React from 'react';

const Button = ({
                    children,
                    variant = 'primary',
                    onClick,
                    type = 'button',
                    className = '',
                    disabled = false,
                    icon = null
                }) => {
    const baseClass = variant === 'outline' ? 'btn-outline' : 'btn';

    return (
        <button
            type={type}
            className={`${baseClass} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {icon && <i className={`fas fa-${icon}`} style={{ marginRight: children ? 8 : 0 }}></i>}
            {children}
        </button>
    );
};

export default Button;