// Button — Focusable, TV D-pad-friendly
import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  children?: React.ReactNode
}

const variantStyles: Record<string, React.CSSProperties> = {
  primary: {
    background: 'var(--teal)',
    color: 'var(--white)',
    boxShadow: '0 4px 16px oklch(0.52 0.075 215 / 0.25)',
  },
  secondary: {
    background: 'oklch(0.25 0.035 215 / 0.08)',
    color: 'var(--text-primary)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-secondary)',
  },
  danger: {
    background: 'oklch(0.6 0.2 20 / 0.1)',
    color: 'var(--status-critical)',
  },
}

const sizeStyles: Record<string, React.CSSProperties> = {
  sm: { padding: '6px 14px', fontSize: 'var(--text-sm)', borderRadius: 'var(--radius-sm)' },
  md: { padding: '10px 20px', fontSize: 'var(--text-base)', borderRadius: 'var(--radius-md)' },
  lg: { padding: '14px 28px', fontSize: 'var(--text-lg)', borderRadius: 'var(--radius-md)' },
}

export default function Button({
  variant = 'secondary',
  size = 'md',
  icon,
  children,
  style,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      tabIndex={0}
      className={`tv-focusable ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        fontWeight: 600,
        cursor: 'pointer',
        border: 'none',
        transition: 'all var(--duration-base) var(--ease-out-expo)',
        fontFamily: 'var(--font-body)',
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
      {...props}
    >
      {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
      {children}
    </button>
  )
}
