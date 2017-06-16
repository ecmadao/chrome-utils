const getAcceptLanguages = (callback) => {
  chrome.i18n.getAcceptLanguages((languageList) => {
    callback && callback(languageList);
  });
};

const getMessage = (...args) => {
  const result = chrome.i18n.getMessage(...args);
  if (!result || !result.length) return null;
  return result;
};

export default {
  acceptLanguages: getAcceptLanguages,
  get: getMessage
};
