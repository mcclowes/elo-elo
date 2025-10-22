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

var createAccumulator = function createAccumulator(referenceRun) {
  return Object.keys(referenceRun).reduce(function (accumulator, cityName) {
    return _objectSpread(_objectSpread({}, accumulator), {}, _defineProperty({}, cityName, Object.keys(referenceRun[cityName]).reduce(function (cityAccumulator, statKey) {
      return _objectSpread(_objectSpread({}, cityAccumulator), {}, _defineProperty({}, statKey, 0));
    }, {})));
  }, {});
};

var addRunToAccumulator = function addRunToAccumulator(accumulator, run) {
  Object.keys(run).forEach(function (cityName) {
    if (!accumulator[cityName]) {
      accumulator[cityName] = Object.keys(run[cityName]).reduce(function (cityAccumulator, statKey) {
        return _objectSpread(_objectSpread({}, cityAccumulator), {}, _defineProperty({}, statKey, 0));
      }, {});
    }

    Object.keys(run[cityName]).forEach(function (statKey) {
      accumulator[cityName][statKey] += run[cityName][statKey];
    });
  });
  return accumulator;
};

var averageAccumulator = function averageAccumulator(accumulator, runs) {
  return Object.keys(accumulator).reduce(function (average, cityName) {
    return _objectSpread(_objectSpread({}, average), {}, _defineProperty({}, cityName, Object.keys(accumulator[cityName]).reduce(function (cityAverage, statKey) {
      return _objectSpread(_objectSpread({}, cityAverage), {}, _defineProperty({}, statKey, accumulator[cityName][statKey] / runs));
    }, {})));
  }, {});
};

function simulation(indexData, coeficients) {
  var runs, accumulator, i, runResult;
  return regeneratorRuntime.wrap(function simulation$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          runs = coeficients.runs;

          if (!(!Number.isInteger(runs) || runs <= 0)) {
            _context.next = 3;
            break;
          }

          throw new Error("runs must be a positive integer");

        case 3:
          i = 0;

        case 4:
          if (!(i < runs)) {
            _context.next = 12;
            break;
          }

          runResult = (0, _fight["default"])(indexData, coeficients);
          accumulator = accumulator ? addRunToAccumulator(accumulator, runResult) : addRunToAccumulator(createAccumulator(runResult), runResult);
          _context.next = 9;
          return {
            progress: (i + 1) / runs,
            random: Math.random()
          };

        case 9:
          i++;
          _context.next = 4;
          break;

        case 12:
          return _context.abrupt("return", averageAccumulator(accumulator, runs));

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, _marked);
}