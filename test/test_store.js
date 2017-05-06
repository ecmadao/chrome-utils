import chrome from 'sinon-chrome';
import chai from 'chai';
import store, { combineObj } from '../src/package/store';
import { timestamp } from '../src/utils/helper';
import { MOCK_USER, MOCK_CONFIG } from './mock';

const expect = chai.expect;
const TEST_DATAS = [
  {
    key: 'a',
    value: 1,
    expire: null
  },
  {
    key: 'b',
    value: { c: 1 },
    expire: null
  },
  {
    key: 'd',
    value: { e: { f: 2 } },
    expire: null
  }
];

describe('Store Test', () => {
  before(() => {
    global.chrome = chrome;
  });

  describe('test store.get', () => {
    before(() => {
      chrome.storage.local.get.withArgs(TEST_DATAS[0].key).yields(
        combineObj(TEST_DATAS[0].key, TEST_DATAS[0].value, TEST_DATAS[0].expire)
      );

      chrome.storage.local.get.withArgs(TEST_DATAS[1].key).yields(
        combineObj(TEST_DATAS[1].key, TEST_DATAS[1].value, TEST_DATAS[1].expire)
      );

      chrome.storage.local.get.withArgs(TEST_DATAS[2].key).yields(
        combineObj(TEST_DATAS[2].key, TEST_DATAS[2].value, TEST_DATAS[2].expire)
      );
    });

    it('should get target value by special key', () => {
      store.get(TEST_DATAS[0].key, (result) => {
        expect(result).to.equal(TEST_DATAS[0].value);
      });
    });

    it('should get target value by special key', () => {
      store.get(TEST_DATAS[1].key, (result) => {
        expect(result).to.equal(TEST_DATAS[1].value);
      });
      store.get('b.c', (result) => {
        expect(result).to.equal(1);
      });
    });

    it('should get target value by special key', () => {
      store.get(TEST_DATAS[2].key, (result) => {
        expect(result).to.equal(TEST_DATAS[2].value);
      });
      store.get('d.e', (result) => {
        expect(result).to.deep.equal({ f: 2 });
      });
      store.get('d.e.f', (result) => {
        expect(result).to.equal(2);
      });
    });
  });

  describe('test store.get -> get user', () => {
    before(() => {
      chrome.storage.local.get.withArgs('user').yields(
        combineObj('user', MOCK_USER, null)
      );
    });

    it('should get user', () => {
      store.get('user', (result) => {
        expect(result).to.deep.equal(MOCK_USER);
      });
    });

    it('should get user.token', () => {
      store.get('user.token', (result) => {
        expect(result).to.equal(MOCK_USER.token);
      });
    });

    it('should get user.info', () => {
      store.get('user.info', (result) => {
        expect(result).to.deep.equal(MOCK_USER.info);
      });
    });

    it('should get user.info.login', () => {
      store.get('user.info.login', (result) => {
        expect(result).to.deep.equal(MOCK_USER.info.login);
      });
    });
  });

  describe('test store.get -> get config', () => {
    before(() => {
      chrome.storage.local.get.withArgs('config').yields(
        combineObj('config', MOCK_CONFIG, null)
      );
    });

    it('should get config', () => {
      store.get('config', (result) => {
        expect(result).to.deep.equal(MOCK_CONFIG);
      });
    });

    it('should get config.blackTheme', () => {
      store.get('config.blackTheme', (result) => {
        expect(result).to.equal(MOCK_CONFIG.blackTheme);
      });
    });

    it('should get config.forceMark', () => {
      store.get('config.forceMark', (result) => {
        expect(result).to.equal(MOCK_CONFIG.forceMark);
      });
    });
  });

  describe('test combineObj', () => {
    it('should combine object when set', () => {
      const obj = combineObj('a', 1);

      expect(obj).to.deep.equal({
        a: 1
      });
    });

    it('should combine object when set', () => {
      const obj = combineObj('a.b', 1);

      expect(obj).to.deep.equal({
        a: {
          b: 1
        }
      });
    });

    it('should combine object when set', () => {
      const obj = combineObj('a.b', { c: 1 });

      expect(obj).to.deep.equal({
        a: {
          b: { c: 1 }
        }
      });
    });

    it('should combine object when set', () => {
      const obj = combineObj('a.b', { c: 1, d: 2 });

      expect(obj).to.deep.equal({
        a: {
          b: { c: 1, d: 2 }
        }
      });
    });
  });

  after(() => {
    chrome.flush();
    delete global.chrome;
  });
});
