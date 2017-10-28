import 'babel-polyfill';
import chrome from 'sinon-chrome';
import chai from 'chai';
import { combineObj } from '../src/package/store';
import store from '../src/package/storeAsync';
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

describe('StoreAsync Test', () => {
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

    it('should get target value by special key', async () => {
      expect(await store.get(TEST_DATAS[0].key)).to.equal(TEST_DATAS[0].value)
    });

    it('should get target value by special key', async () => {
      expect(await store.get(TEST_DATAS[1].key)).to.equal(TEST_DATAS[1].value);
    });

    it('should get target value by special key', async () => {
      expect(await store.get(TEST_DATAS[2].key)).to.equal(TEST_DATAS[2].value);
      expect(await store.get('d.e')).to.deep.equal({ f: 2 });
      expect(await store.get('d.e.f')).to.equal(2);
    });
  });

  describe('test store.get -> get user', async () => {
    before(() => {
      chrome.storage.local.get.withArgs('user').yields(
        combineObj('user', MOCK_USER, null)
      );
    });

    it('should get user', async () => {
      expect(await store.get('user')).to.equal(MOCK_USER);
    });

    it('should get user.token', async () => {
      expect(await store.get('user.token')).to.equal(MOCK_USER.token);
    });

    it('should get user.info', async () => {
      expect(await store.get('user.info')).to.equal(MOCK_USER.info);
    });

    it('should get user.info.login', async () => {
      expect(await store.get('user.info.login')).to.equal(MOCK_USER.info.login);
    });
  });

  describe('test store.get -> get config', () => {
    before(() => {
      chrome.storage.local.get.withArgs('config').yields(
        combineObj('config', MOCK_CONFIG, null)
      );
    });

    it('should get config', async () => {
      expect(await store.get('config')).to.equal(MOCK_CONFIG);
    });

    it('should get config.blackTheme', async () => {
      expect(await store.get('config.blackTheme')).to.equal(MOCK_CONFIG.blackTheme);
    });

    it('should get config.forceMark', async () => {
      expect(await store.get('config.forceMark')).to.equal(MOCK_CONFIG.forceMark);
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
