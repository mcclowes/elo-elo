const objKeysMap = new WeakMap();

const getKeys = obj => {
  if (!objKeysMap.has(obj)) {
    objKeysMap.set(obj, Object.keys(obj));
  }

  return objKeysMap.get(obj);
};

const randomKey = obj => {
  const keys = getKeys(obj);

  if (!keys.length) {
    throw new Error("Cannot select a random key from an empty object");
  }

  return keys[Math.floor(keys.length * Math.random())];
};

export default randomKey;
