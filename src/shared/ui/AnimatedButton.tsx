import React from 'react';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
}

export default function AnimatedButton({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
}: AnimatedButtonProps) {
  return (
    <button
      className={`animated-button ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
      style={{
        fontSize: '11px',
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
        display: 'block',
        textAlign: 'center',
        fontWeight: 'bold',
        padding: '0.4em 0.2em',
        border: '1px solid rgba(96, 165, 250, 0.3)',
        borderRadius: '8px',
        position: 'relative',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.1)',
        color: '#60a5fa',
        textDecoration: 'none',
        transition: '0.3s ease all',
        zIndex: 1,
        width: '37%',
        margin: '0 auto',
        background: 'transparent',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          position: 'relative',
          zIndex: 2,
          transition: 'all 0.3s ease',
          display: 'block',
          textAlign: 'center',
          width: '100%',
        }}
      >
        {children}
      </span>
    </button>
  );
}
