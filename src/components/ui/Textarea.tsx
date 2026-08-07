import { forwardRef, useEffect, useRef, memo } from 'react';
import type { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = memo(
  forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, helperText, id, className = '', value, onChange, onInput, ...props }, ref) => {
      const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
      const isRequired = props.required;
      const internalRef = useRef<HTMLTextAreaElement | null>(null);

      // Auto-adjust height dynamically with transition animation
      const adjustHeight = (el: HTMLTextAreaElement) => {
        el.style.height = 'auto';
        const newHeight = Math.max(el.scrollHeight, 42);
        el.style.height = `${newHeight}px`;
      };

      const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
        adjustHeight(e.currentTarget);
        if (onInput) (onInput as React.FormEventHandler<HTMLTextAreaElement>)(e);
      };

      useEffect(() => {
        if (internalRef.current) {
          adjustHeight(internalRef.current);
        }
      }, [value]);

      return (
        <div className={`input-group ${className}`}>
          {label && (
            <label htmlFor={textareaId} className="input-group__label">
              {label}
              {isRequired && (
                <abbr title="Obligatorio" className="input-required-mark" aria-hidden="true"> *</abbr>
              )}
            </label>
          )}
          <textarea
            ref={(node) => {
              internalRef.current = node;
              if (typeof ref === 'function') {
                ref(node);
              } else if (ref) {
                (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
              }
            }}
            id={textareaId}
            value={value}
            onChange={onChange}
            onInput={handleInput}
            className={`input-group__field input-group__field--textarea ${error ? 'input-group__field--error' : ''}`}
            aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
            aria-invalid={Boolean(error)}
            {...props}
          />
          {error && (
            <p id={`${textareaId}-error`} className="input-group__error" role="alert">
              {error}
            </p>
          )}
          {helperText && !error && (
            <p id={`${textareaId}-helper`} className="input-group__helper">
              {helperText}
            </p>
          )}
        </div>
      );
    }
  )
);

Textarea.displayName = 'Textarea';
