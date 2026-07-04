import { RefreshIcon, TrashIcon } from '@heroicons/react/outline'

import {
  GUESS_DISTRIBUTION_TEXT,
  NEW_PRACTICE_WORD_TEXT,
  PRACTICE_STATISTICS_TITLE,
  RESET_PRACTICE_STATS_TEXT,
} from '../../constants/strings'
import { GameStats } from '../../lib/localStorage'
import { Histogram } from '../stats/Histogram'
import { StatBar } from '../stats/StatBar'
import { BaseModal } from './BaseModal'

type Props = {
  isOpen: boolean
  handleClose: () => void
  gameStats: GameStats
  isGameWon: boolean
  isGameLost: boolean
  numberOfGuessesMade: number
  handleResetStats: () => void
  handleNewPracticeWord: () => void
}

export const PracticeStatsModal = ({
  isOpen,
  handleClose,
  gameStats,
  isGameWon,
  isGameLost,
  numberOfGuessesMade,
  handleResetStats,
  handleNewPracticeWord,
}: Props) => {
  return (
    <BaseModal
      title={PRACTICE_STATISTICS_TITLE}
      isOpen={isOpen}
      handleClose={handleClose}
    >
      <StatBar gameStats={gameStats} />
      {gameStats.totalGames > 0 && (
        <>
          <h4 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
            {GUESS_DISTRIBUTION_TEXT}
          </h4>
          <Histogram
            isLatestGame={true}
            gameStats={gameStats}
            isGameWon={isGameWon}
            numberOfGuessesMade={numberOfGuessesMade}
          />
        </>
      )}
      {(isGameWon || isGameLost) && (
        <button
          type="button"
          className="mt-4 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-base"
          onClick={handleNewPracticeWord}
        >
          <RefreshIcon className="mr-2 h-5 w-5" />
          {NEW_PRACTICE_WORD_TEXT}
        </button>
      )}
      <button
        type="button"
        className={`mt-3 inline-flex w-full items-center justify-center rounded-md border px-4 py-2 text-center text-sm font-medium shadow-sm focus:outline-none sm:text-base ${
          gameStats.totalGames === 0
            ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-500'
            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-100'
        }`}
        onClick={handleResetStats}
        disabled={gameStats.totalGames === 0}
      >
        <TrashIcon className="mr-2 h-5 w-5" />
        {RESET_PRACTICE_STATS_TEXT}
      </button>
    </BaseModal>
  )
}
