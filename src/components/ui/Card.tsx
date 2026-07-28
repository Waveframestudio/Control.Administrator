import type { HTMLAttributes } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type CardElevation = 'flat' | 'raised' | 'elevated';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevation?: CardElevation;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

// ─── Subcomponents ────────────────────────────────────────────────────────────

function CardHeader({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`card__header ${className}`} {...props}>
      {children}
    </div>
  );
}

function CardBody({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`card__body ${className}`} {...props}>
      {children}
    </div>
  );
}

function CardFooter({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`card__footer ${className}`} {...props}>
      {children}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Card({
  elevation = 'raised',
  padding = 'md',
  children,
  className = '',
  ...props
}: CardProps) {
  return (
    <div
      className={`card card--${elevation} card--pad-${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
