// Promisfication wrapper for store
import store from './store';

const storeAsync = {
  get: function(key) {
    return new Promise(resolve => {
      store.get(key, resolve);
    });
  },
  set: function(key, value, options = {}) {
    return new Promise(resolve => {
      store.set(key, value, { callback: e => resolve(e) });
    });
  },
  clear: function() {
    return new Promise(resolve => {
      store.clear(e => resolve(e));
    });
  },
  remove: function(key) {
    return new Promise(resolve => {
      store.remove(key, e => resolve(e));
    });
  },
};

export default storeAsync;
