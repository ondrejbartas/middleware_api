const chalk = require('chalk');
const { logger: createLogger } = require('./logger');
const { isPromise } = require('./isPromise');

const cName = chalk.cyan;
const warning = chalk.redBright;
const cError = chalk.red;
const executing = chalk.greenBright;
const printData = (o) => chalk.yellow(typeof o) + ' ' + chalk.magentaBright(JSON.stringify(o));
const printResult = (o) => chalk.yellow(typeof o) + ' ' + chalk.greenBright(JSON.stringify(o));

const chain = function(args, chain, executeFunc, options = {} ) {

  const chainDepth = chain.length;
  let result;
  let printedStacktrace = false;
  const logger = createLogger(options.debug)

  async function next(newArgs = null) {
    const currentDepth = chainDepth - chain.length;
    const log = logger.bind(null, currentDepth);
    const context = { options, currentDepth, chainDepth, logger: log }
    let newResult;

    if (!!newArgs) {
      log(warning('overriding args from'), printData(args), 'to', printData(newArgs));
      args = newArgs;
    }

    const middleware = chain.shift();
    const name = middleware && (middleware.name || `chained ${currentDepth}/${chainDepth} function`);

    if (middleware && typeof middleware === 'function') {
      log('executing', cName(name), 'with', printData(args))

      /*
       * Going DOWN in middleware chain
       */
      // if middleware accepts 1 argument
      if (middleware.length == 1) {
        middleware.call(context, args);
        // we need to call next, because middleare is not able to call it
        newResult = next();
      } else {
        // middleware needs to handle next call
        newResult = middleware.call(context, args, next);
      }

      /*
       * Prossessing response and handling error from middleware on way UP
       */

      if (newResult && isPromise(newResult)) {
        try {
          // If result of middleware is Promise, lets wait for it
          newResult = await newResult
        } catch (error) {
          // Print error from promise
          if (!printedStacktrace) {
            log(cError('error in', cName(name)));
            log(cError(error.stack));
          } else {
            log(cError('error in', cName(name), error));
          }
          printedStacktrace = true;

          // and let know Upper middlewares about error
          throw error;
        }
      }

      /*
       * Handling result of middleware
       */

      if (newResult) {
        log(currentDepth, executing('result of', cName(name), 'is not null'), 'so we are overriding result', printData(result), 'with', printResult(newResult));
        result = newResult;
      } else {
        log(currentDepth, warning('result of', cName(name), 'is', printData(newResult)), 'so', 'we are using result from previous middleare', printResult(result));
      }

    } else {
      /*
       * Executing main function - no more middlewares left to process
       */
      log(currentDepth, executing('executing', cName(executeFunc.name), 'main function with', printData(args)));
      result = await executeFunc(args);
      log(currentDepth, executing('result of', cName(executeFunc.name), 'main function is', printResult(result)));
    }

    /*
     * Going UP
     */

    return result;
  };
  return next();
};

module.exports = {
  chain
}
