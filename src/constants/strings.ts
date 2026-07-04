export const GAME_TITLE = process.env.REACT_APP_GAME_NAME!

export const WIN_MESSAGES = ['Great Job!', 'Awesome', 'Well done!']
export const GAME_COPIED_MESSAGE = 'Game copied to clipboard'
export const NOT_ENOUGH_LETTERS_MESSAGE = 'Not enough letters'
export const WORD_NOT_FOUND_MESSAGE = 'Word not found'
export const HARD_MODE_ALERT_MESSAGE =
  'Hard Mode can only be changed at the start of a new game!'
export const HARD_MODE_DESCRIPTION =
  'Any revealed hints must be used in subsequent guesses'
export const HIGH_CONTRAST_MODE_DESCRIPTION = 'For improved color vision'
export const CORRECT_WORD_MESSAGE = (solution: string) =>
  `The word was ${solution}`
export const WRONG_SPOT_MESSAGE = (guess: string, position: number) =>
  `Must use ${guess} in position ${position}`
export const NOT_CONTAINED_MESSAGE = (letter: string) =>
  `Guess must contain ${letter}`
export const ENTER_TEXT = 'Enter'
export const DELETE_TEXT = 'Delete'
export const STATISTICS_TITLE = 'Statistics'
export const GUESS_DISTRIBUTION_TEXT = 'Guess Distribution'
export const NEW_WORD_TEXT = 'New word in'
export const SHARE_TEXT = 'Share'
export const SHARE_FAILURE_TEXT =
  'Unable to share the results. This feature is available only in secure contexts (HTTPS), in some or all supporting browsers.'
export const MIGRATE_BUTTON_TEXT = 'Transfer'
export const MIGRATE_DESCRIPTION_TEXT =
  'Click here to transfer your statistics to a new device.'
export const TOTAL_TRIES_TEXT = 'Total tries'
export const SUCCESS_RATE_TEXT = 'Success rate'
export const CURRENT_STREAK_TEXT = 'Current streak'
export const BEST_STREAK_TEXT = 'Best streak'
export const DISCOURAGE_INAPP_BROWSER_TEXT =
  "You are using an embedded browser and may experience problems sharing or saving your results. We encourage you rather to use your device's default browser."

export const GAME_MODE_TITLE = 'Game Mode'
export const DAILY_MODE_DESCRIPTION =
  'Play the daily word. Everyone gets the same word each day.'
export const PRACTICE_MODE_DESCRIPTION =
  'Practice on unlimited random words. Stats are tracked separately and can be reset.'
export const UNTIMED_MODE_DESCRIPTION = 'Take as long as you like.'
export const TIMED_MODE_DESCRIPTION =
  'Solve the word before the timer runs out or the game is lost.'
export const START_GAME_TEXT = 'Start'
export const PRACTICE_STATISTICS_TITLE = 'Practice Statistics'
export const NEW_PRACTICE_WORD_TEXT = 'New Word'
export const RESET_PRACTICE_STATS_TEXT = 'Reset Practice Stats'
export const PRACTICE_STATS_RESET_MESSAGE = 'Practice statistics reset'
export const TIME_UP_MESSAGE = (solution: string) =>
  `Time's up! The word was ${solution}`
export const TIMED_MODE_ALERT_MESSAGE =
  'Timed Mode can only be changed before your first guess!'

export const DATEPICKER_TITLE = 'Choose a past date'
export const DATEPICKER_CHOOSE_TEXT = 'Choose'
export const DATEPICKER_TODAY_TEXT = 'today'
export const ARCHIVE_GAMEDATE_TEXT = 'Game date'
