import objectAssign from './object-assign';

export const timestamp = () => Math.floor(Date.now() / 1000);

const isWhat = (target, targetType) => Object.prototype.toString.call(target) === targetType;

export const checkType = {
  isFunc: (func) => isWhat(func, '[object Function]'),
  isString: (string) => isWhat(string, '[object String]'),
  isObj: (obj) => isWhat(obj, '[object Object]'),
  isNumber: (obj) => isWhat(obj, '[object Number]'),
  isArray: (obj) => isWhat(obj, '[object Array]')
};

/*
 * get value by key from a object
 *
 * e.g.
 * object = {
 *   a: {
 *     b: 1
 *   }
 * };
 * key = 'a.b'
 *
 * ===> result = 1
 */
export const getStoreValue = (object, key) => {
  if (!checkType.isObj(object)) return null;
  const sections = key.split('.');
  let result = object;
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (result && checkType.isObj(result)) {
      const { _value } = result;
      if (!_value) {
        const sectionObj = result[section];
        result = sectionObj && sectionObj['_value']
          ? sectionObj['_value']
          : sectionObj;
        continue;
      }
      if (checkType.isObj(_value)) {
        result = _value[section];
      } else {
        result = _value;
      }
    } else if (i === sections.length - 1) {
      result = undefined;
      break;
    }
  }
  return result;
};

export const getValue = (object, key) => {
  if (!checkType.isObj(object)) return null;
  const sections = key.split('.');

  let result = object;
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    result = checkType.isObj(result) ? result[section] : null;
  }

  return typeof result === 'undefined' ? null : result;
};

export const setValue = (object, key, value) => {
  if (!checkType.isObj(object)) return createObj(key, value);
  const sections = key.split('.');
  let newObj = value;

  for (let i = sections.length - 1; i >= 0; i--) {
    const section = sections[i];
    const currentKey = sections.slice(0, i + 1).join('.');
    const currentValue = getValue(object, currentKey);

    const newValue = checkType.isObj(newObj)
      ? objectAssign({}, currentValue, newObj)
      : newObj;
    newObj = {[section]: newValue};
  }

  return objectAssign(object, newObj);
};

export const getStoreExpire = (object, key) => {
  if (!checkType.isObj(object)) return null;
  const sections = key.split('.');
  let expire = null;
  let current = object;
  sections.forEach((section) => {
    current = current[section]
      ? current[section]
      : current;

    if (checkType.isObj(current) && current['_expire']) {
      expire = current['_expire'];
    }
  });
  return expire;
};

/*
 * create a object
 *
 * e.g.
 * key = 'a.b.c';
 * value = 1;
 * ===> result = {a: {b: {c: 1}}}
 *
 * key = 'a';
 * value = 1;
 * ===> result = { a: 1 }
 */
export const createObj = (key, value) => {
  const sections = key.split('.');
  const baseObj = Object.apply(null);
  let next = baseObj;
  sections.forEach((section, index) => {
    const result = index === sections.length - 1 ? value : Object.apply(null);
    next[section] = result;
    next = result;
  });
  return baseObj;
};

export const uuid = () => {
  const s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
};
