import type { Player } from "./types";

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
