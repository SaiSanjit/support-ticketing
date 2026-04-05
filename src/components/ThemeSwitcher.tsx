import { useTheme, type Theme } from '../lib/useTheme'

const THEMES: { value: Theme; label: string; bg: string; ring: string }[] = [
  {
    value: 'dark',
    label: 'Dark',
    bg:    '#0D0E14',
    ring:  '#7AFFA1',
  },
  {
    value: 'light',
    label: 'Light',
    bg:    '#F4F5FA',
    ring:  '#8B6BB8',
  },
  {
    value: 'warm',
    label: 'Warm',
    bg:    '#13100D',
    ring:  '#FFC947',
  },
]

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center gap-2 px-3 py-2" role="group" aria-label="Choose theme">
      {THEMES.map((t) => {
        const isActive = theme === t.value
        return (
          <button
            key={t.value}
            onClick={() => setTheme(t.value)}
            title={`${t.label} theme`}
            aria-pressed={isActive}
            style={{
              width:        20,
              height:       20,
              borderRadius: '50%',
              backgroundColor: t.bg,
              border: isActive
                ? `2px solid ${t.ring}`
                : '2px solid transparent',
              boxShadow: isActive
                ? `0 0 0 1px ${t.ring}40, inset 0 0 0 2px ${t.bg}`
                : '0 0 0 1px #2A2B3D',
              cursor:     'pointer',
              transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
              padding:    0,
              flexShrink: 0,
            }}
          />
        )
      })}
    </div>
  )
}
