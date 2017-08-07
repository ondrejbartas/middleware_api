
const setBaseUrl = (baseUrl) => (req) => {
  req.baseUrl = baseUrl
}

const setPostMethod = (req) => {
  req.method = 'POST';
}

const encodeDecodeJSONBody = async (req, next) => {
  if (req.body) {
    req.body = JSON.stringify(req.body);
  }
  const result = await next();
  if (result.body) {
    result.body = JSON.parse(result.body);
  }
}

const setDefaultHeaders = (headers = {}) => (req) => {
  req.headers = Object.assign({}, headers, req.headers || {});
}

const pathAndAttrsArguments = async (req, next) => {
  await next(Object.assign({endpoint: req[0]}, req[1]));
}

const handleStatus = async (req, next) => {
  try {
    await next();
  } catch (error) {
    return { status: 'ERROR' }
  }
}

const middlewareLogger = async (req, next) => {
  console.log('Calling', req);
  console.log('Result', await next())
}

module.exports = {
  transmit
}

// const transport = transmit(fetch, { debug: true });
// transport.use(handleStatus);
// transport.use(setBaseUrl('https://swapi.co/api/'));
// transport.use(pathAndAttrsArguments);
// transport.use(encodeDecodeJSONBody);
// transport.use(setBaseUrl('https://swapi.co/api/'));
// transport.use(middlewareLogger);

// transport('/people/1/', {body: {foo: 'bar'}}).then(r => console.log('RESULT', r)).catch(error => console.error(error))
