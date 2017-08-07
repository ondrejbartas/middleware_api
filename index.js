const { isPromise } = require('./utils/isPromise');
const { chain } = require('./utils/chain');

const defaultOptions = {
  debug: false
}

const transmit = (executeFunc, options = {}) => {

  const transmitInstance = (...attrs) => {
    return chain(attrs.length === 1 ? attrs[0] : attrs, transmitInstance.getMiddlewares(), transmitInstance.executeFunc, transmitInstance.options);
  }

  transmitInstance.executeFunc = executeFunc;
  transmitInstance.options = Object.assign({}, defaultOptions, options);
  transmitInstance.middlewares = [];

  // second argument is middleware function with locates place in middleware chain, where to insert given middleware
  transmitInstance.use = (middleware, middlewareOrIndex = null) => {
    if (typeof middlewareOrIndex === 'number') {
      transmitInstance.middlewares.splice(middlewareOrIndex, 0, middleware);
    } else if (typeof middlewareOrIndex === 'function') {
      const index = transmitInstance.middlewares.indexOf(middlewareOrIndex);
      transmitInstance.middlewares.splice(index, 0, middleware);
    } else {
      transmitInstance.middlewares.push(middleware);
    }

    return transmitInstance;
  }

  transmitInstance.remove = (middleware) => {
    if ((index = transmitInstance.middlewares.indexOf(middleware)) !== -1) {
      transmitInstance.middlewares.splice(index, 1);
      return true
    }
    return false
  }

  transmitInstance.getMiddlewares = () => transmitInstance.middlewares.concat()

  transmitInstance.dup = (newExecuteFunc, newOptions) => {
    const newTransmit = transmit(newExecuteFunc || executeFunc, newOptions || options);
    newTransmit.middlewares = transmitInstance.getMiddlewares();
    return newTransmit;
  }

  return transmitInstance;
}

module.exports = {
  transmit
}
