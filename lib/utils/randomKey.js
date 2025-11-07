"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var objKeysMap = new Map();
var randomKey = function randomKey(obj) {
  var keys = [];
  if (objKeysMap.has(obj)) {
    keys = objKeysMap.get(obj);
  } else {
    keys = Object.keys(obj);
    objKeysMap.set(obj, keys);
  }
  // const keys = Object.keys(obj);
  return keys[Math.floor(keys.length * Math.random())];
};
var _default = exports["default"] = randomKey;