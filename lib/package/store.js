import objectAssign from 'object-assign';
import { getValue } from '../utils/helper';

const getStorage = (key, resolve, reject = null) => {
  const mainKey = key.split('.')[0];
  chrome.storage.sync.get(mainKey, (result) => {
    const value = getValue(result, key);
    value ? resolve && resolve(value) : (
      reject ? reject && reject() : resolve && resolve(value)
    );
  });
};

const setStorage = (obj, resolve) => {
  chrome.storage.sync.set(obj, () => {
    resolve && resolve();
  });
};

const mergeConfig = (key, obj, resolve) => {
  getStorage(key, (value) => {
    const newObj = value ? objectAssign({}, value, obj) : obj;
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
          const newValue = storageChange.newValue;
          newValue && listener.callback && listener.callback(newValue);
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
  merge: mergeConfig,
  listen: listenChange,
  clear: clearStorage,
  remove: removeStorage
};
