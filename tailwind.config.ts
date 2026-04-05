import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: { page: 'var(--color-bg-page)', surface: 'var(--color-bg-surface)', elevated: 'var(--color-bg-elevated)', hover: 'var(--color-bg-hover)' },
        border: { DEFAULT: 'var(--color-border)', active: 'var(--color-border-active)' },
        accent: { mint: 'var(--color-mint)', yellow: 'var(--color-yellow)', lavender: 'var(--color-lavender)', peach: 'var(--color-peach)' },
        text: { primary: 'var(--color-text-primary)', secondary: 'var(--color-text-secondary)', tertiary: 'var(--color-text-tertiary)' }
      },
      fontFamily: {
        sans: ['Urbanist', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      borderRadius: { xs: '6px', sm: '8px', md: '12px', lg: '16px', xl: '20px' }
    }
  },
  plugins: [],
} satisfies Config
