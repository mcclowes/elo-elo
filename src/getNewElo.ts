import type { Player } from "./types";

export class EloValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EloValidationError";
  }
}

const validatePlayer = (player: Player, label: string): void => {
  if (typeof player.elo !== "number" || !Number.isFinite(player.elo)) {
    throw new EloValidationError(`${label}.elo must be a finite number`);
  }
  if (![0, 0.5, 1].includes(player.score)) {
    throw new EloValidationError(`${label}.score must be 0 (loss), 0.5 (draw), or 1 (win)`);
  }
};

const validatePositive = (value: number, name: string): void => {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    throw new EloValidationError(`${name} must be a positive number`);
  }
};

const validateGravity = (gravity: number): void => {
  if (typeof gravity !== "number" || !Number.isFinite(gravity) || gravity < 0 || gravity > 1) {
    throw new EloValidationError("gravity must be between 0 and 1");
  }
};

const applyGravity = (elo: number, gravity: number, baseline: number): number =>
  elo - (elo - baseline) * gravity;

export const getExpectedScore = (
  playerElo: number,
  opponentElo: number,
  energy: number
): number => Math.pow(1 + Math.pow(10, (opponentElo - playerElo) / energy), -1);

const getNewElo = (
  player1: Player,
  player2: Player,
  kFactor: number,
  gravity: number,
  energy: number,
  baseline: number
): [number, number] => {
  validatePlayer(player1, "player1");
  validatePlayer(player2, "player2");
  validatePositive(kFactor, "kFactor");
  validateGravity(gravity);
  validatePositive(energy, "energy");
  if (typeof baseline !== "number" || !Number.isFinite(baseline)) {
    throw new EloValidationError("baseline must be a finite number");
  }

  return [
    applyGravity(
      player1.elo +
        kFactor * (player1.score - getExpectedScore(player1.elo, player2.elo, energy)),
      gravity,
      baseline
    ),
    applyGravity(
      player2.elo +
        kFactor * (player2.score - getExpectedScore(player2.elo, player1.elo, energy)),
      gravity,
      baseline
    ),
  ];
};

export default getNewElo;
