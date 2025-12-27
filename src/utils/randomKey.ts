const objKeysMap = new Map<object, string[]>();

const randomKey = <T extends object>(obj: T): keyof T => {
  let keys: string[];

  if (objKeysMap.has(obj)) {
    keys = objKeysMap.get(obj)!;
  } else {
    keys = Object.keys(obj);
    objKeysMap.set(obj, keys);
  }

  return keys[Math.floor(keys.length * Math.random())] as keyof T;
};

export default randomKey;
