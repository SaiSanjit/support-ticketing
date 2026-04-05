import { create } from 'zustand'

export type Theme = 'dark' | 'light' | 'warm'

const THEME_KEY = 'theme'
const VALID_THEMES: Theme[] = ['dark', 'light', 'warm']
const BG: Record<Theme, string> = {
  dark:  '#0D0E14',
  light: '#F4F5FA',
  warm:  '#13100D',
}

function getInitialTheme(): Theme {
  const saved = localStorage.getItem(THEME_KEY)
  return VALID_THEMES.includes(saved as Theme) ? (saved as Theme) : 'dark'
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.documentElement.style.background = BG[theme]
  localStorage.setItem(THEME_KEY, theme)
}

type UiState = {
  sidebarCollapsed: boolean
  commandPaletteOpen: boolean
  activePanel: 'none' | 'task-detail'
  theme: Theme
  setSidebarCollapsed: (v: boolean) => void
  setCommandPaletteOpen: (v: boolean) => void
  setActivePanel: (panel: 'none' | 'task-detail') => void
  setTheme: (theme: Theme) => void
}

export const useUiStore = create<UiState>((set) => ({
  sidebarCollapsed:   false,
  commandPaletteOpen: false,
  activePanel:        'none',
  theme:              getInitialTheme(),

  setSidebarCollapsed:   (v) => set({ sidebarCollapsed: v }),
  setCommandPaletteOpen: (v) => set({ commandPaletteOpen: v }),
  setActivePanel:        (v) => set({ activePanel: v }),

  setTheme: (theme) => {
    applyTheme(theme)
    set({ theme })
  },
}))
