# Wordle Plus

A word-guessing game built with React, TypeScript, and Tailwind CSS. It's the classic daily Wordle, plus two extra ways to play.

## Features

- **Daily mode**: one shared word per day, just like the original.
- **Practice mode**: an endless stream of random words so you can keep playing after the daily is done. Practice runs are entered via a `?mode=practice` URL (so the mode survives a reload and can be shared), tracked with their own separate, resettable statistics, and never touch your daily streak.
- **Timed mode**: an optional 60 / 120 / 180-second countdown on the daily game. The clock starts on your first letter and turns red in the final seconds; run out and the answer is revealed.
- Everything from the base game: hard mode, high-contrast mode, dark mode, guess statistics, and shareable results.

All three modes are chosen from the **Game Mode** menu (the puzzle icon in the navbar). The default experience is unchanged: the classic daily, untimed game.

## Run locally

```bash
npm install
npm start
```

The app runs at `http://localhost:3000`.

## Other scripts

```bash
npm run build    # production build
npm test         # run the test suite
npm run lint     # prettier formatting check
```

## Tech stack

React · TypeScript · Tailwind CSS · Create React App

## Credits

Built on top of [react-wordle](https://github.com/cwackerfuss/react-wordle) by Hannah Park, an open-source clone of the word game popularized by the New York Times. The Practice and Timed modes and the Game Mode menu were added on top of that base.

## License

[MIT](LICENSE). The original react-wordle copyright notice is retained in the `LICENSE` file.
