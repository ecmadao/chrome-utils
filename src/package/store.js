import {
  checkType,
  createObj,
  setValue,
  getValue
} from '../utils/helper';

/* ========================= raw api of chrome.storage.sync ========================= */

const _rawSet = (obj, resolve) => {
  chrome.storage.sync.set(obj, () => {
    resolve && resolve();
  });
};

const _rowGet = (key, resolve) => {
  chrome.storage.sync.get(key, (result) => {
    resolve && resolve(result);
  });
};

const _rawRemove = (key, callback) => {
  chrome.storage.sync.remove(key, () => {
    callback && callback(null);
  });
};

const _rawClear = (callback) => {
  chrome.storage.sync.clear(() => {
    callback && callback();
  });
};

/* ========================= export better api ========================= */

export const combineObj = (key, value, expire = null) => {
  return key ? createObj(key, value) : value;
};

const getStorage = (key, resolve, reject = null) => {
  const mainKey = key.split('.')[0];

  const callback = (result) => {
    const value = getValue(result, key);

    (value !== null && typeof value !== 'undefined')
      ? resolve && resolve(value)
      : (reject
          ? reject && reject()
          : resolve && resolve(null)
        );
  };
  _rowGet(mainKey, callback);
};

const setStorage = (key, value, options = {}) => {
  const resolve = checkType.isFunc(options.callback) ? options.callback : null;
  const keys = key.split('.');
  const mainKey = keys[0];

  getStorage(mainKey, (result) => {
    const obj = combineObj(null, value);
    const rawObj = {[mainKey]: result};
    const newObj = setValue(rawObj, key, obj);

    _rawSet(newObj, resolve);
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
  _rawClear(callback);
};

const removeStorage = (key, callback) => {
  const keys = key.split('.');
  if (keys.length === 1) {
    _rawRemove(key, callback);
  } else {
    setStorage(key, null, { callback });
  }
};

export default {
  get: getStorage,
  set: setStorage,
  listen: listenChange,
  clear: clearStorage,
  remove: removeStorage
};
