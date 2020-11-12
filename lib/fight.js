"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var utils = _interopRequireWildcard(require("./utils"));

var _getNewElo7 = _interopRequireDefault(require("./getNewElo"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var fight = function fight(indexData, coeficients) {
  var kFactor = coeficients.kFactor,
      gravity = coeficients.gravity,
      energy = coeficients.energy,
      baseline = coeficients.baseline,
      fights = coeficients.fights;
  var eloData = utils.makeEloDataFromIndexData(indexData, baseline);
  var secondHalf = false;

  for (var i = 0; i < fights; i++) {
    secondHalf = secondHalf || i > fights / 2;
    var player1 = utils.randomKey(eloData);
    var player2 = utils.randomKey(eloData);
    var indexName = utils.randomKey(indexData[player1]);
    var player1score = indexData[player1][indexName];
    var player2score = indexData[player2][indexName];
    eloData[player1].attemptedGames++;
    eloData[player2].attemptedGames++;

    if (player1score && player2score) {
      eloData[player1].games++;
      eloData[player2].games++;

      if (secondHalf) {
        eloData[player1].secondHalfGames++;
        eloData[player2].secondHalfGames++;
      }

      if (player1score < player2score) {
        // player1 wins
        eloData[player1].w++;
        eloData[player2].l++;

        var _getNewElo = (0, _getNewElo7["default"])({
          elo: eloData[player1].elo,
          score: 1
        }, {
          elo: eloData[player2].elo,
          score: 0
        }, kFactor, gravity, energy, baseline),
            _getNewElo2 = _slicedToArray(_getNewElo, 2),
            newPlayer1Elo = _getNewElo2[0],
            newPlayer2Elo = _getNewElo2[1];

        eloData[player1].elo = newPlayer1Elo;
        eloData[player2].elo = newPlayer2Elo;
        eloData[player1].totalElo += newPlayer1Elo;
        eloData[player2].totalElo += newPlayer2Elo;

        if (secondHalf) {
          eloData[player1].totalSecondHalfElo += newPlayer1Elo;
          eloData[player2].totalSecondHalfElo += newPlayer2Elo;
        }
      } else if (player1score > player2score) {
        // player2 wins
        eloData[player2].w++;
        eloData[player1].l++;

        var _getNewElo3 = (0, _getNewElo7["default"])({
          elo: eloData[player1].elo,
          score: 0
        }, {
          elo: eloData[player2].elo,
          score: 1
        }, kFactor, gravity, energy, baseline),
            _getNewElo4 = _slicedToArray(_getNewElo3, 2),
            _newPlayer1Elo = _getNewElo4[0],
            _newPlayer2Elo = _getNewElo4[1];

        eloData[player1].elo = _newPlayer1Elo;
        eloData[player2].elo = _newPlayer2Elo;
        eloData[player1].totalElo += _newPlayer1Elo;
        eloData[player2].totalElo += _newPlayer2Elo;

        if (secondHalf) {
          eloData[player1].totalSecondHalfElo += _newPlayer1Elo;
          eloData[player2].totalSecondHalfElo += _newPlayer2Elo;
        }
      } else {
        // draw
        eloData[player1].d++;
        eloData[player2].d++;

        var _getNewElo5 = (0, _getNewElo7["default"])({
          elo: eloData[player1].elo,
          score: 0.5
        }, {
          elo: eloData[player2].elo,
          score: 0.5
        }, kFactor, gravity, energy, baseline),
            _getNewElo6 = _slicedToArray(_getNewElo5, 2),
            _newPlayer1Elo2 = _getNewElo6[0],
            _newPlayer2Elo2 = _getNewElo6[1];

        eloData[player1].elo = _newPlayer1Elo2;
        eloData[player2].elo = _newPlayer2Elo2;
        eloData[player1].totalElo += _newPlayer1Elo2;
        eloData[player2].totalElo += _newPlayer2Elo2;

        if (secondHalf) {
          eloData[player1].totalSecondHalfElo += _newPlayer1Elo2;
          eloData[player2].totalSecondHalfElo += _newPlayer2Elo2;
        }
      }
    }
  }

  return eloData;
};

var _default = fight;
exports["default"] = _default;