"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var objKeysMap = new WeakMap();

var getKeys = function getKeys(obj) {
  if (!objKeysMap.has(obj)) {
    objKeysMap.set(obj, Object.keys(obj));
  }

  return objKeysMap.get(obj);
};

var randomKey = function randomKey(obj) {
  var keys = getKeys(obj);

  if (!keys.length) {
    throw new Error("Cannot select a random key from an empty object");
  }

  return keys[Math.floor(keys.length * Math.random())];
};

var _default = randomKey;
exports["default"] = _default;