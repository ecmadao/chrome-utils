const getOwnPropertySymbols = Object.getOwnPropertySymbols;
const hasOwnProperty = Object.prototype.hasOwnProperty;
const propIsEnumerable = Object.prototype.propertyIsEnumerable;

const toObject = (val) => {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
};

const objectAssign = (...args) => {
  let from;
  let symbols;
	const to = toObject(args[0]);

	// 忽略第一个参数进行遍历；可以代入多个对象合并
	for (let s = 1; s < args.length; s++) {
		from = Object(args[s]);

		/**
		 * for..in.. 会输出自身以及原型链上可枚举的属性，不包含 Symbol
		 * 如果对象的属性是它独有而不是继承的，则将 key:value 键值对赋值给 target
		 */

		for (let key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		/**
		 * 获取所有的 Symbols 进行遍历
		 * 如果 symbol 既是 ownProperty，又 enumerable，则可以合并
		 */

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (let i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

export default objectAssign;
