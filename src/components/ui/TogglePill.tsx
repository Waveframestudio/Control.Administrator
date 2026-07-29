import React from 'react';

interface TogglePillOption {
  value: string;
  label: string;
}

interface TogglePillProps {
  label?: string;
  options: TogglePillOption[];
  value: string;
  onChange: (val: string) => void;
  className?: string;
}

export const TogglePill: React.FC<TogglePillProps> = ({
  label,
  options,
  value,
  onChange,
  className = '',
}) => {
  return (
    <div className={`input-group ${className}`}>
      {label && <label className="input-group__label">{label}</label>}
      <div className="toggle-pill-group">
        {options.map((opt) => {
          const isActive = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              className={`toggle-pill-btn ${isActive ? 'toggle-pill-btn--active' : ''}`}
              onClick={() => onChange(opt.value)}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
