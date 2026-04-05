import { useUiStore, type Theme } from '../store/ui-store'

export function useTheme() {
  const theme = useUiStore((s) => s.theme)
  const setTheme = useUiStore((s) => s.setTheme)
  return { theme, setTheme }
}

export type { Theme }
