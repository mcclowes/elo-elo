export interface Player {
  elo: number;
  score: number;
}

export interface EloStats {
  elo: number;
  w: number;
  l: number;
  d: number;
  games: number;
  secondHalfGames: number;
  attemptedGames: number;
  totalElo: number;
  totalSecondHalfElo: number;
}

export interface Coefficients {
  kFactor: number;
  gravity: number;
  energy: number;
  baseline: number;
  fights: number;
  runs: number;
}

export type IndexData = Record<string, Record<string, number>>;
export type EloData = Record<string, EloStats>;

export interface SimulationProgress {
  progress: number;
  random: number;
}
