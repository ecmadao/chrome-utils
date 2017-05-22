import { uuid } from '../utils/helper';
import store from './store';

const getPlatform = (callback) => {
  chrome.runtime.getPlatformInfo((info) => {
    const platform = `${info.os}-${info.arch}`;
    callback && callback(platform);
  });
};

const getIdentifyId = (callback) => {
  store.get('identifyId', (result) => {
    if (!result) {
      result = uuid();
      store.set('identifyId', result);
    }
    callback(result);
  });
};

export default {
  getUniqueId: () => chrome.runtime.id,
  getIdentifyId,
  getPlatform
};
