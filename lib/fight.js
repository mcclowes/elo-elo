"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var utils = _interopRequireWildcard(require("./utils"));
var _getNewElo7 = _interopRequireDefault(require("./getNewElo"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
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
var _default = exports["default"] = fight;