"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var applyGravity = function applyGravity(elo, gravity, baseline) {
  return elo - (elo - baseline) * gravity;
};

var getExpectedScore = function getExpectedScore(playerElo, opponentElo, energy) {
  return Math.pow(1 + Math.pow(10, (opponentElo - playerElo) / energy), -1);
};

var getNewElo = function getNewElo(player1, player2, kFactor, gravity, energy, baseline) {
  return [applyGravity(player1.elo + kFactor * (player1.score - getExpectedScore(player1.elo, player2.elo, energy)), gravity, baseline), applyGravity(player2.elo + kFactor * (player2.score - getExpectedScore(player2.elo, player1.elo, energy)), gravity, baseline)];
};

var _default = getNewElo;
exports["default"] = _default;