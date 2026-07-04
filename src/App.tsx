import './App.css'

import { ClockIcon } from '@heroicons/react/outline'
import { format } from 'date-fns'
import { default as GraphemeSplitter } from 'grapheme-splitter'
import { useEffect, useState } from 'react'
import Div100vh from 'react-div-100vh'

import { AlertContainer } from './components/alerts/AlertContainer'
import { Grid } from './components/grid/Grid'
import { Keyboard } from './components/keyboard/Keyboard'
import { DatePickerModal } from './components/modals/DatePickerModal'
import { GameModeModal } from './components/modals/GameModeModal'
import { InfoModal } from './components/modals/InfoModal'
import { MigrateStatsModal } from './components/modals/MigrateStatsModal'
import { PracticeStatsModal } from './components/modals/PracticeStatsModal'
import { SettingsModal } from './components/modals/SettingsModal'
import { StatsModal } from './components/modals/StatsModal'
import { Navbar } from './components/navbar/Navbar'
import {
  DATE_LOCALE,
  DEFAULT_TIMER_SECONDS,
  DISCOURAGE_INAPP_BROWSERS,
  LONG_ALERT_TIME_MS,
  MAX_CHALLENGES,
  REVEAL_TIME_MS,
  WELCOME_INFO_MODAL_MS,
} from './constants/settings'
import {
  CORRECT_WORD_MESSAGE,
  DISCOURAGE_INAPP_BROWSER_TEXT,
  GAME_COPIED_MESSAGE,
  HARD_MODE_ALERT_MESSAGE,
  NOT_ENOUGH_LETTERS_MESSAGE,
  PRACTICE_STATS_RESET_MESSAGE,
  SHARE_FAILURE_TEXT,
  TIMED_MODE_ALERT_MESSAGE,
  TIME_UP_MESSAGE,
  WIN_MESSAGES,
  WORD_NOT_FOUND_MESSAGE,
} from './constants/strings'
import { useAlert } from './context/AlertContext'
import { isInAppBrowser } from './lib/browser'
import {
  getStoredIsHighContrastMode,
  loadGameStateFromLocalStorage,
  loadPracticeGameStateFromSessionStorage,
  saveGameStateToLocalStorage,
  savePracticeGameStateToSessionStorage,
  setStoredIsHighContrastMode,
} from './lib/localStorage'
import {
  addStatsForCompletedGame,
  addStatsForCompletedPracticeGame,
  loadPracticeStats,
  loadStats,
  resetPracticeStats,
} from './lib/stats'
import {
  solution as dailySolution,
  findFirstUnusedReveal,
  getGameDate,
  getIsLatestGame,
  getIsPracticeMode,
  getRandomWord,
  isWordInWordList,
  setGameDate,
  setPracticeModeUrl,
  solutionGameDate,
  unicodeLength,
} from './lib/words'

function App() {
  const isLatestGame = getIsLatestGame()
  const gameDate = getGameDate()
  const prefersDarkMode = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches

  const { showError: showErrorAlert, showSuccess: showSuccessAlert } =
    useAlert()
  const [initialPracticeMode] = useState(() => getIsPracticeMode())
  const [isPracticeMode, setIsPracticeMode] = useState(initialPracticeMode)
  const [currentSolution, setCurrentSolution] = useState(() => {
    if (initialPracticeMode) {
      const loaded = loadPracticeGameStateFromSessionStorage()
      return loaded?.solution ?? getRandomWord()
    }
    return dailySolution
  })
  const [currentGuess, setCurrentGuess] = useState('')
  const [isGameWon, setIsGameWon] = useState(false)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
  const [isDatePickerModalOpen, setIsDatePickerModalOpen] = useState(false)
  const [isMigrateStatsModalOpen, setIsMigrateStatsModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isGameModeModalOpen, setIsGameModeModalOpen] = useState(false)
  const [currentRowClass, setCurrentRowClass] = useState('')
  const [isGameLost, setIsGameLost] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme')
      ? localStorage.getItem('theme') === 'dark'
      : prefersDarkMode
      ? true
      : false
  )
  const [isHighContrastMode, setIsHighContrastMode] = useState(
    getStoredIsHighContrastMode()
  )
  const [isRevealing, setIsRevealing] = useState(false)
  const [guesses, setGuesses] = useState<string[]>(() => {
    const loaded = initialPracticeMode
      ? loadPracticeGameStateFromSessionStorage()
      : loadGameStateFromLocalStorage(isLatestGame)
    if (loaded?.solution !== currentSolution) {
      return []
    }
    const gameWasWon = loaded.guesses.includes(currentSolution)
    if (gameWasWon) {
      setIsGameWon(true)
    }
    if (loaded.guesses.length === MAX_CHALLENGES && !gameWasWon) {
      setIsGameLost(true)
      showErrorAlert(CORRECT_WORD_MESSAGE(currentSolution), {
        persist: true,
      })
    }
    return loaded.guesses
  })

  const [stats, setStats] = useState(() => loadStats())
  const [practiceStats, setPracticeStats] = useState(() => loadPracticeStats())

  const [isHardMode, setIsHardMode] = useState(
    localStorage.getItem('gameMode')
      ? localStorage.getItem('gameMode') === 'hard'
      : false
  )

  const [isTimedMode, setIsTimedMode] = useState(
    localStorage.getItem('timedMode') === 'true'
  )
  const [timeLimitSeconds, setTimeLimitSeconds] = useState(() => {
    const stored = localStorage.getItem('timeLimitSeconds')
    return stored ? parseInt(stored, 10) : DEFAULT_TIMER_SECONDS
  })
  const [timerStarted, setTimerStarted] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(timeLimitSeconds)

  useEffect(() => {
    // if no game state on load,
    // show the user the how-to info modal
    if (!loadGameStateFromLocalStorage(true)) {
      setTimeout(() => {
        setIsInfoModalOpen(true)
      }, WELCOME_INFO_MODAL_MS)
    }
  })

  useEffect(() => {
    DISCOURAGE_INAPP_BROWSERS &&
      isInAppBrowser() &&
      showErrorAlert(DISCOURAGE_INAPP_BROWSER_TEXT, {
        persist: false,
        durationMs: 7000,
      })
  }, [showErrorAlert])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    if (isHighContrastMode) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
  }, [isDarkMode, isHighContrastMode])

  const handleDarkMode = (isDark: boolean) => {
    setIsDarkMode(isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }

  const handleHardMode = (isHard: boolean) => {
    if (guesses.length === 0) {
      setIsHardMode(isHard)
      localStorage.setItem('gameMode', isHard ? 'hard' : 'normal')
    } else {
      showErrorAlert(HARD_MODE_ALERT_MESSAGE)
    }
  }

  const handleHighContrastMode = (isHighContrast: boolean) => {
    setIsHighContrastMode(isHighContrast)
    setStoredIsHighContrastMode(isHighContrast)
  }

  const resetGameState = () => {
    setCurrentGuess('')
    setIsGameWon(false)
    setIsGameLost(false)
    setIsRevealing(false)
    setCurrentRowClass('')
  }

  const handleStartPractice = () => {
    const word = getRandomWord()
    setIsPracticeMode(true)
    setPracticeModeUrl(true)
    setCurrentSolution(word)
    setGuesses([])
    resetGameState()
    setTimerStarted(false)
    setIsGameModeModalOpen(false)
  }

  const handleNewPracticeWord = () => {
    const word = getRandomWord()
    setCurrentSolution(word)
    setGuesses([])
    resetGameState()
    sessionStorage.removeItem('practiceGameState')
  }

  const handleStartDaily = (isTimed: boolean, seconds: number) => {
    if (!isPracticeMode && guesses.length > 0 && !isGameWon && !isGameLost) {
      showErrorAlert(TIMED_MODE_ALERT_MESSAGE)
      setIsGameModeModalOpen(false)
      return
    }
    localStorage.setItem('timedMode', isTimed ? 'true' : 'false')
    localStorage.setItem('timeLimitSeconds', String(seconds))
    setIsTimedMode(isTimed)
    setTimeLimitSeconds(seconds)
    setTimeRemaining(seconds)
    setTimerStarted(false)
    if (isPracticeMode) {
      // Switching back from practice to daily
      setIsPracticeMode(false)
      setPracticeModeUrl(false)
      setCurrentSolution(dailySolution)
      resetGameState()
      // Restore daily game state
      const loaded = loadGameStateFromLocalStorage(isLatestGame)
      if (loaded?.solution === dailySolution) {
        setGuesses(loaded.guesses)
        const gameWasWon = loaded.guesses.includes(dailySolution)
        if (gameWasWon) {
          setIsGameWon(true)
        } else if (loaded.guesses.length === MAX_CHALLENGES) {
          setIsGameLost(true)
        }
      } else {
        setGuesses([])
      }
    }
    setIsGameModeModalOpen(false)
  }

  const handleResetPracticeStats = () => {
    setPracticeStats(resetPracticeStats())
    showSuccessAlert(PRACTICE_STATS_RESET_MESSAGE)
  }

  const clearCurrentRowClass = () => {
    setCurrentRowClass('')
  }

  useEffect(() => {
    if (isPracticeMode) {
      savePracticeGameStateToSessionStorage({
        guesses,
        solution: currentSolution,
      })
    } else {
      saveGameStateToLocalStorage(getIsLatestGame(), {
        guesses,
        solution: currentSolution,
      })
    }
  }, [guesses, isPracticeMode, currentSolution])

  // Timed mode countdown (daily game only)
  useEffect(() => {
    if (
      isPracticeMode ||
      !isTimedMode ||
      !timerStarted ||
      isGameWon ||
      isGameLost
    ) {
      return
    }
    if (timeRemaining <= 0) {
      if (isLatestGame) {
        setStats((s) => addStatsForCompletedGame(s, MAX_CHALLENGES))
      }
      setIsGameLost(true)
      showErrorAlert(TIME_UP_MESSAGE(currentSolution), { persist: true })
      return
    }
    const id = setTimeout(() => setTimeRemaining((t) => t - 1), 1000)
    return () => clearTimeout(id)
  }, [
    isPracticeMode,
    isTimedMode,
    timerStarted,
    timeRemaining,
    isGameWon,
    isGameLost,
    isLatestGame,
    showErrorAlert,
    currentSolution,
  ])

  useEffect(() => {
    if (isGameWon) {
      const winMessage =
        WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)]
      const delayMs = REVEAL_TIME_MS * currentSolution.length

      showSuccessAlert(winMessage, {
        delayMs,
        onClose: () => setIsStatsModalOpen(true),
      })
    }

    if (isGameLost) {
      setTimeout(() => {
        setIsStatsModalOpen(true)
      }, (currentSolution.length + 1) * REVEAL_TIME_MS)
    }
  }, [isGameWon, isGameLost, showSuccessAlert, currentSolution])

  const onChar = (value: string) => {
    if (
      unicodeLength(`${currentGuess}${value}`) <= currentSolution.length &&
      guesses.length < MAX_CHALLENGES &&
      !isGameWon &&
      !isGameLost
    ) {
      if (!isPracticeMode && isTimedMode && !timerStarted) {
        setTimerStarted(true)
      }
      setCurrentGuess(`${currentGuess}${value}`)
    }
  }

  const onDelete = () => {
    setCurrentGuess(
      new GraphemeSplitter().splitGraphemes(currentGuess).slice(0, -1).join('')
    )
  }

  const onEnter = () => {
    if (isGameWon || isGameLost) {
      return
    }

    if (!(unicodeLength(currentGuess) === currentSolution.length)) {
      setCurrentRowClass('jiggle')
      return showErrorAlert(NOT_ENOUGH_LETTERS_MESSAGE, {
        onClose: clearCurrentRowClass,
      })
    }

    if (!isWordInWordList(currentGuess)) {
      setCurrentRowClass('jiggle')
      return showErrorAlert(WORD_NOT_FOUND_MESSAGE, {
        onClose: clearCurrentRowClass,
      })
    }

    // enforce hard mode - all guesses must contain all previously revealed letters
    if (isHardMode) {
      const firstMissingReveal = findFirstUnusedReveal(
        currentGuess,
        guesses,
        currentSolution
      )
      if (firstMissingReveal) {
        setCurrentRowClass('jiggle')
        return showErrorAlert(firstMissingReveal, {
          onClose: clearCurrentRowClass,
        })
      }
    }

    setIsRevealing(true)
    // turn this back off after all
    // chars have been revealed
    setTimeout(() => {
      setIsRevealing(false)
    }, REVEAL_TIME_MS * currentSolution.length)

    const winningWord = currentGuess === currentSolution

    if (
      unicodeLength(currentGuess) === currentSolution.length &&
      guesses.length < MAX_CHALLENGES &&
      !isGameWon
    ) {
      setGuesses([...guesses, currentGuess])
      setCurrentGuess('')

      if (winningWord) {
        if (isPracticeMode) {
          setPracticeStats(
            addStatsForCompletedPracticeGame(practiceStats, guesses.length)
          )
        } else if (isLatestGame) {
          setStats(addStatsForCompletedGame(stats, guesses.length))
        }
        return setIsGameWon(true)
      }

      if (guesses.length === MAX_CHALLENGES - 1) {
        if (isPracticeMode) {
          setPracticeStats(
            addStatsForCompletedPracticeGame(practiceStats, guesses.length + 1)
          )
        } else if (isLatestGame) {
          setStats(addStatsForCompletedGame(stats, guesses.length + 1))
        }
        setIsGameLost(true)
        showErrorAlert(CORRECT_WORD_MESSAGE(currentSolution), {
          persist: true,
          delayMs: REVEAL_TIME_MS * currentSolution.length + 1,
        })
      }
    }
  }

  return (
    <Div100vh>
      <div className="flex h-full flex-col">
        <Navbar
          setIsInfoModalOpen={setIsInfoModalOpen}
          setIsStatsModalOpen={setIsStatsModalOpen}
          setIsDatePickerModalOpen={setIsDatePickerModalOpen}
          setIsSettingsModalOpen={setIsSettingsModalOpen}
          setIsGameModeModalOpen={setIsGameModeModalOpen}
        />

        {isPracticeMode && (
          <div className="flex items-center justify-center gap-3 py-1">
            <p className="text-base font-medium text-gray-600 dark:text-gray-300">
              Practice Mode
            </p>
            {(isGameWon || isGameLost) && (
              <button
                type="button"
                className="rounded-md border border-transparent bg-indigo-600 px-3 py-1 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none"
                onClick={handleNewPracticeWord}
              >
                New Word
              </button>
            )}
          </div>
        )}

        {!isPracticeMode && isTimedMode && (
          <div className="flex items-center justify-center py-1">
            <ClockIcon className="mr-1 h-5 w-5 stroke-gray-600 dark:stroke-gray-300" />
            <p
              className={`text-base font-medium ${
                timeRemaining <= 10 && timerStarted
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              {Math.floor(timeRemaining / 60)}:
              {(timeRemaining % 60).toString().padStart(2, '0')}
            </p>
          </div>
        )}

        {!isPracticeMode && !isLatestGame && (
          <div className="flex items-center justify-center">
            <ClockIcon className="h-6 w-6 stroke-gray-600 dark:stroke-gray-300" />
            <p className="text-base text-gray-600 dark:text-gray-300">
              {format(gameDate, 'd MMMM yyyy', { locale: DATE_LOCALE })}
            </p>
          </div>
        )}

        <div className="mx-auto flex w-full grow flex-col px-1 pt-2 pb-8 sm:px-6 md:max-w-7xl lg:px-8 short:pb-2 short:pt-2">
          <div className="flex grow flex-col justify-center pb-6 short:pb-2">
            <Grid
              solution={currentSolution}
              guesses={guesses}
              currentGuess={currentGuess}
              isRevealing={isRevealing}
              currentRowClassName={currentRowClass}
            />
          </div>
          <Keyboard
            onChar={onChar}
            onDelete={onDelete}
            onEnter={onEnter}
            solution={currentSolution}
            guesses={guesses}
            isRevealing={isRevealing}
          />
          <InfoModal
            isOpen={isInfoModalOpen}
            handleClose={() => setIsInfoModalOpen(false)}
          />
          <GameModeModal
            isOpen={isGameModeModalOpen}
            handleClose={() => setIsGameModeModalOpen(false)}
            isPracticeMode={isPracticeMode}
            isTimedMode={isTimedMode}
            timeLimitSeconds={timeLimitSeconds}
            handleStartDaily={handleStartDaily}
            handleStartPractice={handleStartPractice}
          />
          {isPracticeMode ? (
            <PracticeStatsModal
              isOpen={isStatsModalOpen}
              handleClose={() => setIsStatsModalOpen(false)}
              gameStats={practiceStats}
              isGameWon={isGameWon}
              isGameLost={isGameLost}
              numberOfGuessesMade={guesses.length}
              handleResetStats={handleResetPracticeStats}
              handleNewPracticeWord={handleNewPracticeWord}
            />
          ) : (
            <StatsModal
              isOpen={isStatsModalOpen}
              handleClose={() => setIsStatsModalOpen(false)}
              solution={currentSolution}
              guesses={guesses}
              gameStats={stats}
              isLatestGame={isLatestGame}
              isGameLost={isGameLost}
              isGameWon={isGameWon}
              handleShareToClipboard={() =>
                showSuccessAlert(GAME_COPIED_MESSAGE)
              }
              handleShareFailure={() =>
                showErrorAlert(SHARE_FAILURE_TEXT, {
                  durationMs: LONG_ALERT_TIME_MS,
                })
              }
              handleMigrateStatsButton={() => {
                setIsStatsModalOpen(false)
                setIsMigrateStatsModalOpen(true)
              }}
              isHardMode={isHardMode}
              isDarkMode={isDarkMode}
              isHighContrastMode={isHighContrastMode}
              numberOfGuessesMade={guesses.length}
            />
          )}
          <DatePickerModal
            isOpen={isDatePickerModalOpen}
            initialDate={solutionGameDate}
            handleSelectDate={(d) => {
              setIsDatePickerModalOpen(false)
              setGameDate(d)
            }}
            handleClose={() => setIsDatePickerModalOpen(false)}
          />
          <MigrateStatsModal
            isOpen={isMigrateStatsModalOpen}
            handleClose={() => setIsMigrateStatsModalOpen(false)}
          />
          <SettingsModal
            isOpen={isSettingsModalOpen}
            handleClose={() => setIsSettingsModalOpen(false)}
            isHardMode={isHardMode}
            handleHardMode={handleHardMode}
            isDarkMode={isDarkMode}
            handleDarkMode={handleDarkMode}
            isHighContrastMode={isHighContrastMode}
            handleHighContrastMode={handleHighContrastMode}
          />
          <AlertContainer />
        </div>
      </div>
    </Div100vh>
  )
}

export default App
