import objectAssign from '../utils/object-assign';
import { getValue, checkType, createObj } from '../utils/helper';

const _rawSet = (obj, resolve) => {
  chrome.storage.sync.set(obj, () => {
    resolve && resolve();
  });
};

const getStorage = (key, resolve, reject = null) => {
  const mainKey = key.split('.')[0];
  chrome.storage.sync.get(mainKey, (result) => {
    const value = getValue(result, key);
    value ? resolve && resolve(value) : (
      reject ? reject && reject() : resolve && resolve(value)
    );
  });
};

const setStorage = (...args) => {
  const firstArg = args[0];
  const lastArg = args.slice(-1)[0];
  const resolve = checkType.isFunc(lastArg) ? lastArg : null;
  if (checkType.isString(firstArg)) {
    const obj = createObj(firstArg, args[1]);
    mergeStorage(firstArg, obj, resolve);
  } else {
    _rawSet(firstArg, resolve);
  }
};

const mergeStorage = (key, value, resolve) => {
  getStorage(key, (result) => {
    const newObj = result && checkType.isObj(result)
      ? objectAssign({}, result, value)
      : value;
    setStorage({
      [key]: newObj
    }, resolve);
  });
};

const listenChange = (...args) => {
  chrome.storage.onChanged.addListener((changes, namespace) => {
    Object.keys(changes).forEach((key) => {
      const listener = args.filter(arg => arg.key === key)[0];
      if (listener) {
        const storageChange = changes[key];
        if (storageChange) {
          const listenKey = listener.key.split('.').slice(1).join('.');
          let newValue = storageChange.newValue;
          let oldValue = storageChange.oldValue;
          if (listenKey) {
            newValue = getValue(newValue, listenKey);
            oldValue = getValue(oldValue, listenKey);
          }
          const changed = newValue !== oldValue;
          changed && newValue && listener.callback && listener.callback(newValue);
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
  chrome.storage.sync.remove(key, () => {
    callback && callback();
  });
};

export default {
  get: getStorage,
  set: setStorage,
  merge: mergeStorage,
  listen: listenChange,
  clear: clearStorage,
  remove: removeStorage
};
