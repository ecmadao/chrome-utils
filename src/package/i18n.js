const getAcceptLanguages = (callback) => {
  chrome.i18n.getAcceptLanguages((languageList) => {
    callback && callback(languageList);
  });
};

const getMessage = (...args) => chrome.i18n.getMessage(...args);

export default {
  acceptLanguages: getAcceptLanguages,
  get: getMessage
};
