const { delayPromise } = require('../utils/delayPromise');

const retry = (counter = 5, delay = 0) => async function retryMiddleware(req, next) {
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
      if (delay > 0) {
        await delayPromise(delay)
      }
    }
  }
}

module.exports = {
  retry
}
