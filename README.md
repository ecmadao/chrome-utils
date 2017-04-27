# chrome-utils

Some utils that help to build chrome extension

## Usage

```bash
$ npm i chrome-utils --save
```

```javascript
import { store, message, i18n } from 'chrome-utils';
```

## Api

## store

- get & set

```javascript
store.get(key[, resolve, reject]);
store.set(obj[, resolve]);
```

- merge

```javascript
store.merge(key, obj[, resolve]);
```

- listen

```javascript
store.listen(...listeners);

// listener
const listener = {
  key, // the key you wanna to listen change
  callback
};
const listeners = [listener1, listener2, listener3];
```

- clear & remove

```javascript
store.clear();
store.remove(key[, callback]);
```

## message

- send message

```javascript
message.sendMsg(msg[, callback]);

// msg
const msg = {
  type, // required
  data
};
```

- send to tabs

```javascript
message.sendToTabs(msg[, query]);
```

- register listener

```javascript
message.register(...listeners);

// listener
const listener = {
  callback, // required,
  type // not required, but if you use it, this listener will only listen same type msg
}
```

## i18n

- get message

```javascript
i18n.message(...args);
```
