const getPlatform = (callback) => {
  chrome.runtime.getPlatformInfo((info) => {
    const platform = `${info.os}-${info.arch}`;
    callback && callback(platform);
  });
};

export default {
  getId: () => chrome.runtime.id,
  getPlatform
};
