"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var utils = _interopRequireWildcard(require("./utils"));

var _getNewElo3 = _interopRequireDefault(require("./getNewElo"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var ensureDifferentPlayers = function ensureDifferentPlayers(players, currentPlayer) {
  if (Object.keys(players).length <= 1) {
    return currentPlayer;
  }

  var opponent = utils.randomKey(players);

  while (opponent === currentPlayer) {
    opponent = utils.randomKey(players);
  }

  return opponent;
};

var calculateOutcomeScores = function calculateOutcomeScores(player1Score, player2Score) {
  if (player1Score < player2Score) {
    return {
      outcome: 1,
      scores: [1, 0]
    };
  }

  if (player1Score > player2Score) {
    return {
      outcome: -1,
      scores: [0, 1]
    };
  }

  return {
    outcome: 0,
    scores: [0.5, 0.5]
  };
};

var updateOutcomeTallies = function updateOutcomeTallies(player1, player2, outcome) {
  if (outcome === 1) {
    player1.w += 1;
    player2.l += 1;
    return;
  }

  if (outcome === -1) {
    player2.w += 1;
    player1.l += 1;
    return;
  }

  player1.d += 1;
  player2.d += 1;
};

var updateEloForMatch = function updateEloForMatch(player1, player2, scores, kFactor, gravity, energy, baseline, secondHalf) {
  var _getNewElo = (0, _getNewElo3["default"])({
    elo: player1.elo,
    score: scores[0]
  }, {
    elo: player2.elo,
    score: scores[1]
  }, kFactor, gravity, energy, baseline),
      _getNewElo2 = _slicedToArray(_getNewElo, 2),
      newPlayer1Elo = _getNewElo2[0],
      newPlayer2Elo = _getNewElo2[1];

  player1.elo = newPlayer1Elo;
  player2.elo = newPlayer2Elo;
  player1.totalElo += newPlayer1Elo;
  player2.totalElo += newPlayer2Elo;

  if (secondHalf) {
    player1.totalSecondHalfElo += newPlayer1Elo;
    player2.totalSecondHalfElo += newPlayer2Elo;
  }
};

var fight = function fight(indexData, coeficients) {
  var kFactor = coeficients.kFactor,
      gravity = coeficients.gravity,
      energy = coeficients.energy,
      baseline = coeficients.baseline,
      fights = coeficients.fights;
  var eloData = utils.makeEloDataFromIndexData(indexData, baseline);
  var secondHalf = false;

  for (var i = 0; i < fights; i++) {
    secondHalf = secondHalf || i >= fights / 2;
    var player1Name = utils.randomKey(eloData);
    var player2Name = ensureDifferentPlayers(eloData, player1Name);
    var player1Indexes = indexData[player1Name];

    if (!player1Indexes) {
      continue;
    }

    var indexName = void 0;

    try {
      indexName = utils.randomKey(player1Indexes);
    } catch (error) {
      continue;
    }

    if (player1Name === player2Name) {
      continue;
    }

    var player2Indexes = indexData[player2Name];

    if (!player2Indexes || !(indexName in player2Indexes)) {
      continue;
    }

    var player1Score = player1Indexes[indexName];
    var player2Score = player2Indexes[indexName];
    var player1 = eloData[player1Name];
    var player2 = eloData[player2Name];
    player1.attemptedGames += 1;
    player2.attemptedGames += 1;

    if (player1Score == null || player2Score == null) {
      continue;
    }

    player1.games += 1;
    player2.games += 1;

    if (secondHalf) {
      player1.secondHalfGames += 1;
      player2.secondHalfGames += 1;
    }

    var _calculateOutcomeScor = calculateOutcomeScores(player1Score, player2Score),
        outcome = _calculateOutcomeScor.outcome,
        scores = _calculateOutcomeScor.scores;

    updateOutcomeTallies(player1, player2, outcome);
    updateEloForMatch(player1, player2, scores, kFactor, gravity, energy, baseline, secondHalf);
  }

  return eloData;
};

var _default = fight;
exports["default"] = _default;