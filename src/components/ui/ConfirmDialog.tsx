import { useEffect, useRef } from 'react';
import { Button } from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ConfirmDialog({
  isOpen,
  title = '¿Estás seguro?',
  message,
  confirmLabel = 'Eliminar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Focus the dialog on open and handle ESC key
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="confirm-dialog__backdrop"
      role="presentation"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div
        ref={dialogRef}
        className="confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        tabIndex={-1}
      >
        {/* Danger icon */}
        <div className="confirm-dialog__icon-wrap">
          <svg
            className="confirm-dialog__icon"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </div>

        {/* Content */}
        <h2 id="confirm-dialog-title" className="confirm-dialog__title">
          {title}
        </h2>
        <p id="confirm-dialog-message" className="confirm-dialog__message">
          {message}
        </p>

        {/* Actions */}
        <div className="confirm-dialog__actions">
          <Button
            id="confirm-dialog-cancel"
            variant="secondary"
            size="md"
            onClick={onCancel}
          >
            {cancelLabel}
          </Button>
          <Button
            id="confirm-dialog-confirm"
            variant="danger"
            size="md"
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
