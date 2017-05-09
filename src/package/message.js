import { checkType } from '../utils/helper';

const _sendCallback = (msg, listener) => {
  const checked = !listener.type || listener.type === msg.type;
  if (checked && checkType.isFunc(listener.callback)) {
    listener.callback(msg);
  }
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
    for (let i = 0; i < args.length; i++) {
      const listener = args[i];
      _sendCallback(msg, listener);
    }
  });
};

const sendMsg = (msg, callback) => {
  _checkMsg(msg);
  chrome.runtime.sendMessage(msg, (response) => {
    checkType.isFunc(callback) && callback(response);
  });
};

const sendToTab = (msg, tabId) => {
  chrome.tabs.sendMessage(tabId, msg);
};

const sendToTabs = (msg = {}, query = {}, filterTabs = null) => {
  _checkMsg(msg);
  chrome.tabs.query(query, (tabs) => {
    let targetTabs = tabs;
    if (checkType.isFunc(filterTabs)) {
      targetTabs = filterTabs(tabs);
    }
    targetTabs.forEach(tab => sendToTab(msg, tab.id));
  });
};

const sendBgMsg = (msg) => {
  sendToTabs(msg, {active: true, currentWindow: true});
};

export default {
  register,
  sendMsg,
  sendToTab,
  sendToTabs,
  sendBgMsg
};
