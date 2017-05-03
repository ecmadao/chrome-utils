import { expect } from 'chai';
import { _combineObj } from '../src/package/store';
import { timestamp } from '../src/utils/helper';

describe('Store Test', () => {
  it('should combine object when set', () => {
    const obj = _combineObj('a', 1);

    expect(obj).to.deep.equal({
      a: {
        _value: 1,
        _expire: null
      }
    });
  });

  it('should combine object when set', () => {
    const obj = _combineObj('a.b', 1);

    expect(obj).to.deep.equal({
      a: {
        b: {
          _value: 1,
          _expire: null
        }
      }
    });
  });

  it('should combine object when set', () => {
    const obj = _combineObj('a.b', { c: 1 });

    expect(obj).to.deep.equal({
      a: {
        b: {
          _value: { c: 1 },
          _expire: null
        }
      }
    });
  });

  it('should combine object when set', () => {
    const obj = _combineObj('a.b', { c: 1, d: 2 });

    expect(obj).to.deep.equal({
      a: {
        b: {
          _value: { c: 1, d: 2 },
          _expire: null
        }
      }
    });
  });

  it('should combine object with expire when set', () => {
    const obj = _combineObj('a', 1, 2 * 60 * 60); // 2 hours

    expect(obj).to.deep.equal({
      a: {
        _value: 1,
        _expire: timestamp() + 2 * 60 * 60
      }
    });
  });
});
