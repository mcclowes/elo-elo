const objKeysMap = new Map();

const randomKey = obj => {
	let keys = [];

	if (objKeysMap.has(obj)) {
		keys = objKeysMap.get(obj);
	} else {
		keys = Object.keys(obj);
		objKeysMap.set(obj, keys);
	}
	// const keys = Object.keys(obj);
	return keys[Math.floor(keys.length * Math.random())];
};

export default randomKey;
