# Flag & Capital Quiz

A mobile-first quiz app to practice and master world flags and country capitals.

Test live on [Vercel](https://capital-quiz.vercel.app/).

## Features

### Gameplay

- **Combined challenge**: For each country, guess both the flag and the capital
- **Self-validation**: Players judge their own answers (correct/incorrect)
- **Lives system**: Start with 5 lives, lose one on each wrong capital answer
- **Win/Lose conditions**: Win by answering all countries correctly, lose when lives reach 0

### Scoring

- Base points equal to capital difficulty level (1-5)
- **Flag multipliers**: Harder flags give bonus multipliers (up to x3 for difficulty 5)
- **Combo system**: Consecutive correct answers add combo bonus to each score
- Wrong answers on easy flags (level 1) apply a x0.75 penalty

### Progress Tracking

- Failed countries are added back to the pool for another attempt
- Game continues until all countries are mastered or lives run out

## Tech Stack

| Technology       | Purpose                           |
| ---------------- | --------------------------------- |
| **React 18**     | UI framework                      |
| **TypeScript**   | Type-safe development             |
| **Vite**         | Fast build tool & dev server      |
| **Sass**         | Custom styling (no UI libraries)  |
| **localStorage** | Data persistence (scores & stats) |
| **Vercel**       | Deployment & hosting              |

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/     # React components
├── contexts/       # Game state management (GameContext)
├── utils/          # Helper functions & scoring logic
├── styles/         # Sass stylesheets
└── countries.ts    # Countries data with difficulty levels
```

## License

MIT
