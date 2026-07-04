import classnames from 'classnames'
import { useState } from 'react'

import { TIMER_OPTIONS_SECONDS } from '../../constants/settings'
import {
  DAILY_MODE_DESCRIPTION,
  GAME_MODE_TITLE,
  PRACTICE_MODE_DESCRIPTION,
  START_GAME_TEXT,
  TIMED_MODE_DESCRIPTION,
  UNTIMED_MODE_DESCRIPTION,
} from '../../constants/strings'
import { BaseModal } from './BaseModal'

type Props = {
  isOpen: boolean
  handleClose: () => void
  isPracticeMode: boolean
  isTimedMode: boolean
  timeLimitSeconds: number
  handleStartDaily: (isTimed: boolean, timeLimitSeconds: number) => void
  handleStartPractice: () => void
}

const optionButtonClasses = (active: boolean) =>
  classnames(
    'w-full rounded-md border px-3 py-2 text-sm font-medium focus:outline-none',
    {
      'border-indigo-600 bg-indigo-600 text-white': active,
      'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-100':
        !active,
    }
  )

export const GameModeModal = ({
  isOpen,
  handleClose,
  isPracticeMode,
  isTimedMode,
  timeLimitSeconds,
  handleStartDaily,
  handleStartPractice,
}: Props) => {
  const [selectedMode, setSelectedMode] = useState<'daily' | 'practice'>(
    isPracticeMode ? 'practice' : 'daily'
  )
  const [selectedTiming, setSelectedTiming] = useState<'untimed' | 'timed'>(
    isTimedMode ? 'timed' : 'untimed'
  )
  const [selectedTime, setSelectedTime] = useState(
    TIMER_OPTIONS_SECONDS.includes(timeLimitSeconds)
      ? timeLimitSeconds
      : TIMER_OPTIONS_SECONDS[1]
  )

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return m > 0 ? `${m}:${s.toString().padStart(2, '0')}` : `${s}s`
  }

  const handleStart = () => {
    if (selectedMode === 'practice') {
      handleStartPractice()
    } else {
      handleStartDaily(selectedTiming === 'timed', selectedTime)
    }
  }

  return (
    <BaseModal
      title={GAME_MODE_TITLE}
      isOpen={isOpen}
      handleClose={handleClose}
    >
      <div className="mt-2 flex flex-col gap-4">
        <div>
          <div className="mb-2 grid grid-cols-2 gap-2">
            <button
              className={optionButtonClasses(selectedMode === 'daily')}
              onClick={() => setSelectedMode('daily')}
            >
              Daily
            </button>
            <button
              className={optionButtonClasses(selectedMode === 'practice')}
              onClick={() => setSelectedMode('practice')}
            >
              Practice
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-300">
            {selectedMode === 'daily'
              ? DAILY_MODE_DESCRIPTION
              : PRACTICE_MODE_DESCRIPTION}
          </p>
        </div>

        {selectedMode === 'daily' && (
          <div>
            <div className="mb-2 grid grid-cols-2 gap-2">
              <button
                className={optionButtonClasses(selectedTiming === 'untimed')}
                onClick={() => setSelectedTiming('untimed')}
              >
                Untimed
              </button>
              <button
                className={optionButtonClasses(selectedTiming === 'timed')}
                onClick={() => setSelectedTiming('timed')}
              >
                Timed
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-300">
              {selectedTiming === 'timed'
                ? TIMED_MODE_DESCRIPTION
                : UNTIMED_MODE_DESCRIPTION}
            </p>
          </div>
        )}

        {selectedMode === 'daily' && selectedTiming === 'timed' && (
          <div>
            <p className="mb-2 text-left text-sm text-gray-700 dark:text-gray-200">
              Time limit
            </p>
            <div className="grid grid-cols-3 gap-2">
              {TIMER_OPTIONS_SECONDS.map((t) => (
                <button
                  key={t}
                  className={optionButtonClasses(selectedTime === t)}
                  onClick={() => setSelectedTime(t)}
                >
                  {formatTime(t)}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          type="button"
          className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={handleStart}
        >
          {selectedMode === 'practice' ? 'New Practice Word' : START_GAME_TEXT}
        </button>
      </div>
    </BaseModal>
  )
}
