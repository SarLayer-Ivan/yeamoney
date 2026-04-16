import React from 'react';

const Input = ({
                   label,
                   type = 'text',
                   value,
                   onChange,
                   placeholder = '',
                   required = false,
                   step = null,
                   min = null
               }) => {
    return (
        <div className="input-group">
            {label && <label>{label}</label>}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                step={step}
                min={min}
            />
        </div>
    );
};

export default Input;