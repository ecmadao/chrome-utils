export const getValue = (object, key) => {
  const sections = key.split('.');
  let result = object;
  sections.forEach((section) => {
    result = result[section]
  });
  return result;
};
