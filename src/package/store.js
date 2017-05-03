import objectAssign from '../utils/object-assign';
import { getValue, getExpire, checkType, createObj, timestamp } from '../utils/helper';

const _rawSet = (obj, resolve) => {
  chrome.storage.sync.set(obj, () => {
    resolve && resolve();
  });
};

const _rawRemove = (key, callback) => {
  chrome.storage.sync.remove(key, () => {
    callback && callback(null);
  });
};

export const _combineObj = (key, value, expire = null) => {
  if (!checkType.isString(key)) {
    throw new Error('first arg should be a string');
  }
  const _expire = checkType.isNumber(expire)
    ? timestamp() + expire
    : null;

  return createObj(key, {
    _value: value,
    _expire
  });
};

const getStorage = (key, resolve, reject = null) => {
  const mainKey = key.split('.')[0];
  chrome.storage.sync.get(mainKey, (result) => {
    const value = getValue(result, key);
    const expire = getExpire(result, key);

    const isExpire = expire !== null && timestamp() > expire;
    value && !isExpire ? resolve && resolve(value) : (
      reject ? reject && reject() : resolve && resolve(null)
    );
  });
};

const setStorage = (key, value, options = {}) => {
  const obj = _combineObj(key, value, options.expire);
  const resolve = checkType.isFunc(options.callback) ? options.callback : null;
  _rawSet(obj, resolve);
};

const mergeStorage = (key, value, resolve) => {
  getStorage(key, (result) => {
    const newObj = result && checkType.isObj(result)
      ? objectAssign({}, result, value)
      : value;

    setStorage(key, newObj, { callback: resolve });
  });
};

const listenChange = (...args) => {
  chrome.storage.onChanged.addListener((changes, namespace) => {
    Object.keys(changes).forEach((key) => {
      const listener = args.filter(arg => arg.key.split('.')[0] === key)[0];
      if (listener) {
        const storageChange = changes[key];
        if (storageChange) {
          const newValue = getValue({ [key]: storageChange.newValue }, listener.key);
          const oldValue = getValue({ [key]: storageChange.oldValue }, listener.key);
          const changed = newValue !== oldValue;
          changed && listener.callback && listener.callback(newValue);
        }
      }
    });
  });
};

const clearStorage = (callback) => {
  chrome.storage.sync.clear(() => {
    callback && callback();
  });
};

const removeStorage = (key, callback) => {
  const keys = key.split('.');
  if (keys.length === 1) {
    _rawRemove(key, callback);
  } else {
    setStorage(key, null, callback);
  }
};

export default {
  get: getStorage,
  set: setStorage,
  merge: mergeStorage,
  listen: listenChange,
  clear: clearStorage,
  remove: removeStorage
};
