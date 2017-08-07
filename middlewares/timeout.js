const { delayPromise } = require('../utils/delayPromise');

const TimeoutError = new Error('Middleware timout')

const timeout = (timeoutInterval = 0) => function timeoutMiddleware(req, next) {
  return new Promise((resolve, reject) => {
    const timeoutInstance = setTimeout(function(){
        return reject(TimeoutError);
    }, 4000);

    next().then(result => {
      clearTimeout(timeoutInstance)
      resolve(result)
    })
  });
}

module.exports = {
  TimeoutError,
  timeout
}
