"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = simulation;

var _fight = _interopRequireDefault(require("./fight"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _marked = /*#__PURE__*/regeneratorRuntime.mark(simulation);

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function simulation(indexData, coeficients) {
  var runs, outputs, i, averageOutput;
  return regeneratorRuntime.wrap(function simulation$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          runs = coeficients.runs;
          outputs = [];
          i = 0;

        case 3:
          if (!(i < runs)) {
            _context.next = 10;
            break;
          }

          outputs.push((0, _fight["default"])(indexData, coeficients));
          _context.next = 7;
          return {
            progress: i / runs,
            random: Math.random()
          };

        case 7:
          i++;
          _context.next = 3;
          break;

        case 10:
          averageOutput = outputs.reduce(function (acc, output) {
            return Object.keys(output).reduce(function (outputAcc, cityName) {
              return _objectSpread(_objectSpread({}, outputAcc), {}, _defineProperty({}, cityName, Object.keys(output[cityName]).reduce(function (cityEloStatsAcc, eloStat) {
                return _objectSpread(_objectSpread({}, cityEloStatsAcc), {}, _defineProperty({}, eloStat, output[cityName][eloStat] / outputs.length + (acc[cityName] ? acc[cityName][eloStat] : 0)));
              }, {})));
            }, {});
          }, {});
          return _context.abrupt("return", averageOutput);

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, _marked);
}