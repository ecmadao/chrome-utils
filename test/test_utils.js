import { expect } from 'chai';
import {
  getStoreValue,
  getStoreExpire,
  checkType,
  createObj,
  getValue,
  setValue
} from '../src/utils/helper';
import objectAssign from '../src/utils/object-assign';

describe('Utils Test', () => {
  describe('test checkType', () => {
    it('should check String', () => {
      expect(checkType.isString(1)).to.equal(false);
      expect(checkType.isString('1')).to.equal(true);
    });

    it('should check Function', () => {
      expect(checkType.isFunc(null)).to.equal(false);
      expect(checkType.isFunc(function() {})).to.equal(true);
    });

    it('should check Number', () => {
      expect(checkType.isNumber(1)).to.equal(true);
      expect(checkType.isNumber('1')).to.equal(false);
    });

    it('should check Array', () => {
      expect(checkType.isArray([])).to.equal(true);
      expect(checkType.isArray({})).to.equal(false);
      expect(checkType.isArray(null)).to.equal(false);
    });

    it('should check Object', () => {
      expect(checkType.isObj([])).to.equal(false);
      expect(checkType.isObj({})).to.equal(true);
      expect(checkType.isObj(null)).to.equal(false);
    });
  });

  describe('test getValue', () => {
    it('should get value by key', () => {
      const obj = {
        a: { b: 1 },
        c: 2
      };
      expect(null).to.equal(getValue(null, 'a'));
      expect({ b: 1 }).to.deep.equal(getValue(obj, 'a'));
      expect(2).to.equal(getValue(obj, 'c'));
      expect(1).to.equal(getValue(obj, 'a.b'));
    });

    it('should return null when key not exist', () => {
      const obj = {
        a: { b: 1 },
        c: 2
      };
      expect(null).to.equal(getValue(obj, 'a.c'));
    });
  });

  describe('test setValue', () => {
    it('should create a new object when target obj not exist', () => {
      expect({
        a: {
          d: { e: 3 }
        }
      }).to.deep.equal(setValue(null, 'a.d.e', 3));
    });

    it('should create a new key-value when target key not exist', () => {
      const obj = {
        a: {
          d: { e: 3 }
        }
      };
      expect({
        a: {
          d: { e: 3 },
          c: { e: 3 }
        }
      }).to.deep.equal(setValue(obj, 'a.c.e', 3));
    });

    it('should set value by key', () => {
      const obj = {
        a: {
          b: 1,
          d: { e: 1 }
        },
        c: 2
      };

      expect({
        a: {
          b: 1,
          d: { e: 3 }
        },
        c: 2
      }).to.deep.equal(setValue(obj, 'a.d.e', 3));
    });

    it('should set value by key, by changing raw object', () => {
      const obj = {
        a: {
          b: 1,
          c: 2,
          d: { e: 1 }
        },
        c: 2
      };

      expect({
        a: {
          b: 1,
          c: 2,
          d: { e: 1 }
        },
        c: 3
      }).to.deep.equal(setValue(obj, 'c', 3));
      expect({
        a: {
          b: 1,
          c: 3,
          d: { e: 1 }
        },
        c: 3
      }).to.deep.equal(setValue(obj, 'a.c', 3));
      expect({
        a: {
          b: 1,
          c: 3,
          d: { e: 1, f: 1 }
        },
        c: 3
      }).to.deep.equal(setValue(obj, 'a.d', { f: 1 }));
      expect({
        a: {
          b: 1,
          c: 3,
          d: { e: 1, f: 1 }
        },
        c: 3
      }).to.deep.equal(obj);
    });
  });

  describe('test getStoreValue & getStoreExpire', () => {
    it('should create object correctly', () => {
      const results = {
        a: {
          _value: { b: 1, c: 2 },
          _expire: null
        }
      };
      expect(results).to.deep.equal(createObj('a', {
        _value: { b: 1, c: 2 },
        _expire: null
      }));
    });

    it('should create object correctly', () => {
      const results = {
        a: {
          _value: 1,
          _expire: null
        }
      };
      expect(results).to.deep.equal(createObj('a', {
        _value: 1,
        _expire: null
      }));
    });

    it('should create object correctly', () => {
      const results = {
        a: {
          b: {
            _value: { c: 2 },
            _expire: null
          }
        }
      };
      expect(results).to.deep.equal(createObj('a.b', {
        _value: { c: 2 },
        _expire: null
      }));
    });

    it('should get value correctly', () => {
      const obj = createObj('a.b', {
        _value: { c: 2 },
        _expire: null
      });

      expect(getStoreValue(obj, 'a.b.c')).to.equal(2);
    });

    it('should get value correctly', () => {
      const obj = createObj('a.b', {
        _value: { c: 2 },
        _expire: null
      });

      expect(getStoreValue(obj, 'a.b')).to.deep.equal({ c: 2 });
    });

    it('should get value correctly', () => {
      const obj = createObj('a', {
        _value: 1,
        _expire: null
      });

      expect(getStoreValue(obj, 'a')).to.equal(1);
    });

    it('should get value correctly', () => {
      const obj = {
        a: { b: 1 }
      };

      expect(getStoreValue(obj, 'a')).to.deep.equal({ b: 1 });
      expect(getStoreValue(obj, 'a.b')).to.equal(1);
    });

    it('should get value correctly', () => {
      const obj = createObj('a', {
        _value: { b: 1, c: 2 },
        _expire: null
      });

      expect(getStoreValue(obj, 'a')).to.deep.equal({ b: 1, c: 2 });
      expect(getStoreValue(obj, 'a.b')).to.equal(1);
      expect(getStoreValue(obj, 'a.c')).to.equal(2);
      expect(getStoreValue(obj, 'a.c.d')).to.equal(undefined);
    });

    it('should get expire correctly', () => {
      const obj = createObj('a', {
        _value: { b: 1, c: 2 },
        _expire: 123
      });

      expect(getStoreExpire(obj, 'a')).to.equal(123);
    });

    it('should get expire correctly', () => {
      const obj = createObj('a.b', {
        _value: { c: 2 },
        _expire: 123
      });
      expect(getStoreExpire(obj, 'a')).to.equal(null);
    });

    it('should get expire correctly', () => {
      const obj = createObj('a.b', {
        _value: { c: 2 },
        _expire: 123
      });
      expect(getStoreExpire(obj, 'a.b')).to.equal(123);
    });

    it('should get expire correctly', () => {
      const obj = createObj('a.b', {
        _value: { c: 2 },
        _expire: 123
      });
      expect(getStoreExpire(obj, 'a.b.c')).to.equal(123);
    });
  });

  describe('test object-assign', () => {
    it('should merge object without modify origin', () => {
      const origin = { a: 1, b: 2 };
      const newObj = { a: 2, c: 3 };
      expect(objectAssign({}, origin, newObj)).to.deep.equal({
        a: 2,
        b: 2,
        c: 3
      });
    });

    it('should merge object by modify origin', () => {
      const origin = { a: 1, b: 2 };
      const newObj = { a: 2, c: 3 };
      objectAssign(origin, newObj)
      expect(origin).to.deep.equal({
        a: 2,
        b: 2,
        c: 3
      });
    });

    it('should rewrite object if origin is not a object', () => {
      const origin = 1;
      const newObj = { a: 2, c: 3 };
      const result = objectAssign({}, origin, newObj)
      expect(result).to.deep.equal({
        a: 2,
        c: 3
      });
    });

    it('should deep merge object', () => {
      const origin = {
        a: 1,
        b: 2,
        c: {
          d: { e: 3 }
        }
      };
      const newObj = {
        a: 2,
        c: {
          d: { e: 4 },
          f: 5
        }
      };
      objectAssign(origin, newObj)
      expect(origin).to.deep.equal({
        a: 2,
        b: 2,
        c: {
          d: { e: 4 },
          f: 5
        }
      });
    });
  });
});
