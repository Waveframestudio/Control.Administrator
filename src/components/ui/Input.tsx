import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  /** Unit badge shown inside the right edge of the input (e.g. "cm", "kg", "mts") */
  suffix?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, id, className = '', suffix, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    const isRequired = props.required;

    return (
      <div className={`input-group ${className}`}>
        {label && (
          <label htmlFor={inputId} className="input-group__label">
            {label}
            {isRequired && (
              <abbr title="Obligatorio" className="input-required-mark" aria-hidden="true"> *</abbr>
            )}
          </label>
        )}
        <div className={`input-group__control${suffix ? ' input-group__control--has-suffix' : ''}`}>
          <input
            ref={ref}
            id={inputId}
            className={`input-group__field ${error ? 'input-group__field--error' : ''}`}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            aria-invalid={Boolean(error)}
            {...props}
          />
          {suffix && (
            <span className="input-group__suffix" aria-hidden="true">{suffix}</span>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="input-group__error" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="input-group__helper">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

