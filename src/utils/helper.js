const isWhat = (target, targetType) => {
  return Object.prototype.toString.call(target) === targetType;
};

export const checkType = {
  isFunc: (func) => isWhat(func, '[object Function]'),
  isString: (string) => isWhat(string, '[object String]'),
  isObj: (obj) => isWhat(obj, '[object Object]')
};

/*
 * get value by key from a object
 *
 * e.g.
 * object = {
 *   a: {
 *     b: 1
 *   }
 * };
 * key = 'a.b'
 *
 * ===> result = 1
 */
export const getValue = (object, key) => {
  if (!checkType.isObj(object)) return null;
  const sections = key.split('.');
  let result = object;
  sections.forEach((section) => {
    if (result) result = result[section];
  });
  return result;
};

/*
 * create a object
 *
 * e.g.
 * key = 'a.b.c';
 * value = 1;
 *
 * ===> result = {a: {b: {c: 1}}}
 */
export const createObj = (key, value) => {
  const sections = key.split('.');
  const baseObj = Object.apply(null);
  let next = baseObj;
  sections.forEach((section, index) => {
    const result = index === sections.length - 1 ? value : Object.apply(null);
    next[section] = result;
    next = result;
  });
  return baseObj;
};
