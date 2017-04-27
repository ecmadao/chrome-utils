const _response = (msg, listeners) => {
  for (let i = 0; i < listeners.length; i++) {
    const listener = listeners[i];
    _sendCallback(msg, listener);
  }
};

const _sendCallback = (msg, listener) => {
  const checked = !listener.type || listener.type === msg.type;
  checked && listener.callback && listener.callback(msg.data);
};

const _checkListener = (listeners) => {
  listeners.forEach((listener) => {
    if (!listener.callback) {
      throw new Error('Listener should have a callback!');
    }
  });
};

const _checkMsg = (msg) => {
  if (!Object.keys(msg).indexOf('type') === -1) {
    throw new Error('Missing "type" key!');
  }
};

const register = (...args) => {
  _checkListener(args);
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    _response(msg, args);
  });
};

const sendMsg = (msg, callback) => {
  _checkMsg(msg);
  chrome.runtime.sendMessage(msg, response => callback && callback(response));
};

const sendToTabs = (msg = {}, query = {}) => {
  chrome.tabs.query(query, (tabs) => {
    tabs.forEach((tab) => {
      chrome.tabs.sendMessage(tab.id, msg);
    });
  });
};

export default {
  register,
  sendMsg,
  sendToTabs
};
