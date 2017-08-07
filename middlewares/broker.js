const { delayPromise } = require('../utils/delayPromise');

const broker = (hashFunction = JSON.stringify) => {
  const currentRequests = {}
  return async function brokerMiddleware(req, next) {
    const hash = hashFunction(req);

    if (currentRequests[hash]) {
      this.logger('There is already request with same hash', hash, 'and request', req, 'so we use same result of it');
      return currentRequests[hash];
    }

    currentRequests[hash] = next();

    try {
      return await currentRequests[hash];
    } catch (error) {
      throw error;
    } finally {
      // cleanup current requests
      delete currentRequests[hash]
    }
  }
}

module.exports = {
  broker
}
