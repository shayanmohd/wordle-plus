const gameStateKey = 'gameState'
const archiveGameStateKey = 'archiveGameState'
const practiceGameStateKey = 'practiceGameState'
const highContrastKey = 'highContrast'

export type StoredGameState = {
  guesses: string[]
  solution: string
}

export const saveGameStateToLocalStorage = (
  isLatestGame: boolean,
  gameState: StoredGameState
) => {
  const key = isLatestGame ? gameStateKey : archiveGameStateKey
  localStorage.setItem(key, JSON.stringify(gameState))
}

export const loadGameStateFromLocalStorage = (isLatestGame: boolean) => {
  const key = isLatestGame ? gameStateKey : archiveGameStateKey
  const state = localStorage.getItem(key)
  return state ? (JSON.parse(state) as StoredGameState) : null
}

export const savePracticeGameStateToSessionStorage = (
  gameState: StoredGameState
) => {
  sessionStorage.setItem(practiceGameStateKey, JSON.stringify(gameState))
}

export const loadPracticeGameStateFromSessionStorage = () => {
  const state = sessionStorage.getItem(practiceGameStateKey)
  return state ? (JSON.parse(state) as StoredGameState) : null
}

const gameStatKey = 'gameStats'
const practiceGameStatKey = 'practiceGameStats'

export type GameStats = {
  winDistribution: number[]
  gamesFailed: number
  currentStreak: number
  bestStreak: number
  totalGames: number
  successRate: number
}

export const saveStatsToLocalStorage = (gameStats: GameStats) => {
  localStorage.setItem(gameStatKey, JSON.stringify(gameStats))
}

export const loadStatsFromLocalStorage = () => {
  const stats = localStorage.getItem(gameStatKey)
  return stats ? (JSON.parse(stats) as GameStats) : null
}

export const savePracticeStatsToLocalStorage = (gameStats: GameStats) => {
  localStorage.setItem(practiceGameStatKey, JSON.stringify(gameStats))
}

export const loadPracticeStatsFromLocalStorage = () => {
  const stats = localStorage.getItem(practiceGameStatKey)
  return stats ? (JSON.parse(stats) as GameStats) : null
}

export const removePracticeStatsFromLocalStorage = () => {
  localStorage.removeItem(practiceGameStatKey)
}

export const setStoredIsHighContrastMode = (isHighContrast: boolean) => {
  if (isHighContrast) {
    localStorage.setItem(highContrastKey, '1')
  } else {
    localStorage.removeItem(highContrastKey)
  }
}

export const getStoredIsHighContrastMode = () => {
  const highContrast = localStorage.getItem(highContrastKey)
  return highContrast === '1'
}
