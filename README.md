
# Middleware examples:

## Change req object with mutation:
```javascript
const setPostMethod = (req) => {
  req.method = 'POST';
}
```

## Change req object without mutation by passing req to next function:
```javascript
const setPostMethod = (req, next) => {
  return next(Object.assign({}, req, {method: 'POST'}));
}
```

# When you need to set some options for middleware use:
```javascript
const setDefaultHeaders = (options = {}) => (req) => {
  req.headers = Object.assign({}, options, req.headers || {});
}
```

# When you need to do something with response:
```javascript
const decodeJSON = async (_req, next) => {
  return JSON.parse(await next());
}
```

or if you want to do both, upate request and response by same middleware with mutation:
```javascript
const encodeDecodeJSONBody = async (req, next) => {
  if (req.body) {
    req.body = JSON.stringify(req.body);
  }
  const result = await next();
  if (result.body) {
    result.body = JSON.parse(result.body);
  }
}
```

or if you want to do both, upate request and response by same middleware without mutation:
```javascript
const encodeDecodeJSONBody = async (req, next) => {
  const result = await next({...req, body: req.body ? JSON.stringify(req.body) : null });
  return {...result, body:  result.body ? JSON.parse(result.body) : null };
}
```

# How to get some options and logger instance in your middleare:

use `this.logger`, `this.options`, `this.currentDepth`, `this.chainDepth` inside of your middleware:

```javascript
const yourMiddleware = (req) => {
  this.logger(
    'logging some data about middleware chain:'
    'current depth:', this.currentDepth,
    'chain depth:', this.chainDepth,
    'options', this.options
  )
}
```

`logger` will print to console log only when options `{ debug: true }`.
Also it will automatically concat arguments and prefix text with `2` spaces per depth so you will be able to see middleware chain.

# Middlewares

## Retry

Retry `resourceCall` for 5 times with delay 1000 between retries.

```javascript
import transmit from 'transmit';
import { retry } from 'transmit/lib/middlewares/retry';

const api = transmit(resourceCall).use(retry(5, 1000));
```

## Broker

Will merge inccomming calls with same arguments resolved by hashing function, which is by default JSON.stringify, but can be owerriden, to one call to api.

Basically second call will wait for resolving of first one and result of first will be used for all same requests.

```javascript
import transmit from 'transmit';
import { broker } from 'transmit/lib/middlewares/broker';

const api = transmit(resourceCall).use(broker(JSON.stringify));
```

## Timeout

Set timeout for execution, when middleware chain will not complete in given timeout, it will throw Timeout Error.

```javascript
import transmit from 'transmit';
import { timeout } from 'transmit/lib/middlewares/timeout';

const api = transmit(resourceCall).use(timeout(1000));
```

