# chrome-utils

[![npm version](https://badge.fury.io/js/chrome-utils.svg)](https://badge.fury.io/js/chrome-utils) [![Build Status](https://travis-ci.org/ecmadao/chrome-utils.svg?branch=master)](https://travis-ci.org/ecmadao/chrome-utils) [![Coverage Status](https://coveralls.io/repos/github/ecmadao/chrome-utils/badge.svg?branch=master)](https://coveralls.io/github/ecmadao/chrome-utils?branch=master) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com) [![chrome-utils](http://img.shields.io/npm/dm/chrome-utils.svg)](https://www.npmjs.com/package/chrome-utils) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/ecmadao/chrome-utils/master/LICENSE)

Some utils that help to build chrome extension. **HAVE NO DEPENDENCIES**.

## Usage

```bash
$ npm i chrome-utils --save
```

```javascript
// es6
import { store, message, i18n } from 'chrome-utils';

// es5
const store = require('chrome-utils').store;
```

## Api

### store

`chrome.storage` API is anti-human, for example, if you saved a non-plain object to store, `{a: {b: 1, c: {d: 2}}}`, then how to directly get the value of `d` from it?

One more question, if you have already save `{a1: {b: 1}, a2: {c: 2}}` to store, then wanna update `b` to `2`, then how to do it? If we use raw API like `chrome.storage.sync.set({a1: {b: 2}})`, then we'll find `a2` was totally disappeard!

Actually, by raw `chrome.storage` API:

- you can only get the top key-value
- you can only get `a` but not `a.b.d`.
- if you wanna update a value in a object, you must get it from store first, then update the whole object, finally, save it to store.

WTF?

---

#### get & set

If target value exist, then auto to merge it

```javascript
store.get(key[, resolve, reject]);
store.set(key, value[, options]);

// usage example
store.set('a.c', 1);
store.get('a'); // {c: 1}

store.set('a.b': 2);
store.get('a'); // inject b, get {a: {b: 2, c: 1}}
store.get('a.b'); // directly get b, return 2

store.set('a.b': 3);
store.get('a.b'); // update, get 3
```

#### listen

```javascript
store.listen(...listeners);

// listener
const listener = {
  key, // the key you wanna to listen change
  callback
};
const listeners = [listener1, listener2, listener3];
```

#### clear & remove

```javascript
store.clear();
store.remove(key[, callback]);

// example
store.set({a: {b: 1, c: 2}});
store.get('a'); // {b: 1, c: 2}

store.remove('a.b');
// after remove
store.get('a'); // => {b: null, c: 2}

store.remove('a');
// after remove
store.get('a'); // => null
```

### message

Compare with raw API `chrome.runtime.onMessage` & `chrome.runtime.sendMessage`, it:

- force user add `type` for each msg
- if msg listener as a `type` key, it will only response to target type msg

#### send message

```javascript
message.sendMsg(msg[, callback]);

// msg
const msg = {
  type, // required
  data
};
```

#### send msg to tabs

```javascript
message.sendToTabs(msg[, query]);
```

#### register listener

```javascript
message.register(...listeners);

// listener
const listener = {
  callback, // required,
  type // not required, but if you use it, this listener will only listen same type msg
};
```

### i18n

#### get message

```javascript
i18n.get(...args);
```

## Todo

- [x] remove `merge` api
- [ ] expire time for store
- [x] test
- [x] more use case
