# elo-elo

An Elo rating implementation with Monte Carlo simulation support.

## Installation

```bash
npm install elo-elo
```

## Usage

### Basic Simulation

```typescript
import simulation from "elo-elo";

const indexData = {
  player1: { metric1: 10, metric2: 20 },
  player2: { metric1: 15, metric2: 18 },
  player3: { metric1: 12, metric2: 22 },
};

const coefficients = {
  kFactor: 32,      // Rating volatility (typical: 10-40)
  gravity: 0,       // Pull toward baseline (0-1, 0 = none)
  energy: 400,      // Rating scale factor (standard: 400)
  baseline: 1500,   // Starting/reference rating
  fights: 1000,     // Matches per simulation run
  runs: 100,        // Number of simulation runs
};

// Run simulation (returns a generator)
const sim = simulation(indexData, coefficients);

let result;
for (const progress of sim) {
  console.log(`Progress: ${(progress.progress * 100).toFixed(1)}%`);
  result = progress;
}

// Final result contains averaged Elo stats for each player
console.log(sim.next().value);
```

### Using getExpectedScore

```typescript
import { getExpectedScore } from "elo-elo";

// Calculate win probability based on rating difference
const expected = getExpectedScore(1600, 1400, 400);
console.log(expected); // ~0.76 (76% chance of winning)
```

## API Reference

### `simulation(indexData, coefficients)`

Runs a Monte Carlo Elo simulation. Returns a generator that yields progress updates and finally returns averaged results.

#### Parameters

**indexData** `Record<string, Record<string, number>>`

Player data where each player has metrics that determine match outcomes. Lower metric values win.

**coefficients** `Coefficients`

| Property | Type | Description |
|----------|------|-------------|
| `kFactor` | `number` | Controls rating volatility. Higher = bigger rating swings. Typical values: 10 (stable), 16 (low), 24 (medium), 32 (high). Must be positive. |
| `gravity` | `number` | Pulls ratings toward baseline after each match. Range: 0-1. Use 0 for standard Elo behavior. |
| `energy` | `number` | Scale factor in expected score formula. Standard Elo uses 400 (meaning 400-point difference = 10:1 odds). Must be positive. |
| `baseline` | `number` | Starting rating and gravity anchor point. Common values: 1200, 1500, 1600. |
| `fights` | `number` | Number of random matches per simulation run. |
| `runs` | `number` | Number of complete simulation runs to average. |

#### Returns

`Generator<SimulationProgress, EloData>`

Yields `{ progress: number, random: number }` and returns `EloData` on completion.

### `getExpectedScore(playerElo, opponentElo, energy)`

Calculates expected score (win probability) using the Elo formula.

```
E = 1 / (1 + 10^((opponentElo - playerElo) / energy))
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `playerElo` | `number` | Current rating of the player |
| `opponentElo` | `number` | Current rating of the opponent |
| `energy` | `number` | Scale factor (typically 400) |

#### Returns

`number` between 0 and 1 representing win probability.

### `EloValidationError`

Custom error thrown when invalid parameters are passed to Elo functions.

```typescript
import { EloValidationError } from "elo-elo";

try {
  // Invalid: score must be 0, 0.5, or 1
  getNewElo({ elo: 1500, score: 0.7 }, ...);
} catch (e) {
  if (e instanceof EloValidationError) {
    console.log(e.message); // "player1.score must be 0 (loss), 0.5 (draw), or 1 (win)"
  }
}
```

## Types

```typescript
interface Player {
  elo: number;
  score: number; // 0 (loss), 0.5 (draw), or 1 (win)
}

interface Coefficients {
  kFactor: number;
  gravity: number;
  energy: number;
  baseline: number;
  fights: number;
  runs: number;
}

interface EloStats {
  elo: number;
  w: number;              // Wins
  l: number;              // Losses
  d: number;              // Draws
  games: number;          // Total games played
  attemptedGames: number; // Games attempted (including skipped)
  totalElo: number;       // Cumulative Elo for averaging
  secondHalfGames: number;
  totalSecondHalfElo: number;
}

type IndexData = Record<string, Record<string, number>>;
type EloData = Record<string, EloStats>;
```

## License

ISC
