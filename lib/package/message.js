class MessageCenter {
  constructor() {
    this.listeners = [];
  }

  listen() {
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      this._response(msg);
    });
    return this;
  }

  send(msg, callback) {
    this._check(msg);
    chrome.runtime.sendMessage(msg, response => callback && callback(response));
    return this;
  }

  register(...args) {
    args.forEach((arg) => {
      const { type, callback } = arg;
      this.listeners.push({
        type,
        callback
      });
    });
    return this;
  }

  addListener(listener) {
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      this._checkListener(listener, msg);
    });
    return this;
  }

  sendToTabs(msg = {}, query = {}) {
    chrome.tabs.query(query, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, msg);
      });
    });
  }

  _check(msg) {
    if (!Object.keys(msg).indexOf('type') === -1) {
      throw new Error('Missing "type" key!');
    }
  }

  _response(msg) {
    for (let i = 0; i < this.listeners.length; i++) {
      const listener = this.listeners[i];
      this._checkListener(listener, msg);
    }
  }

  _checkListener(listener, msg) {
    listener.type === msg.type && listener.callback && listener.callback(msg.data);
  }
}

export default MessageCenter;
