const { delayPromise } = require('../utils/delayPromise');

const delays = {
  constant: (time = 1000) => (i) => delayPromise(time),
  linear: (time = 1000) => (i) => delayPromise(i * time),
  exponential: (time = 1000) => (i) => delayPromise(i * i * time)
}

const retry = (counter = 5, delay = delays.linear()) => async function retryMiddleware(req, next) {
  let instanceCounter = counter + 0

  while(instanceCounter >= 0) {
    try {
      const result = await next();

      if (instanceCounter !== counter) {
        this.logger('Retry attemp ', counter-instanceCounter, '/', counter, 'was successfull')
      }

      return result;
    } catch (error) {
      instanceCounter -= 1
      this.logger('Retrying error "', error, '" for',counter-instanceCounter, '/', counter)
      if (instanceCounter < 0) {
        throw error
      }

      if (typeof delay === 'function') {
        await delay(instanceCounter)
      } else if (typeof delay === 'number' && delay > 0) {
        await delayPromise(delay)
      }
    }
  }
}

module.exports = {
  retry,
  delays
}
