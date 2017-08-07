const { transmit } = require('../index');

const mockMiddleware = (req, next) => next();
const secondMiddleware = (req, next) => next();
const thirdMiddleware = (req, next) => next();

const resourceCall = (args) => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve({status: 'OK', args, body: '{"foo": "bar"}'});
  }, 100)})

it('returns function', () => {
  expect(typeof transmit(resourceCall)).toEqual('function')
})

it('returns result of resourceCall with args {}', async () => {
  const args = { bar: 'foo' };
  const result = await transmit(resourceCall)(args)
  expect(result.status).toEqual('OK')
  expect(result.args).toEqual(args)
})

it('returns result of resourceCall with multiple args', async () => {
  const result = await transmit(resourceCall)('foo', 'bar')
  expect(result.status).toEqual('OK')
  expect(result.args).toEqual(['foo', 'bar'])
})

it('returns additional api functions', () => {
  const methods = Object.keys(transmit(resourceCall))
  expect(methods).toContain('use')
  expect(methods).toContain('getMiddlewares')
  expect(methods).toContain('executeFunc')
  expect(methods).toContain('options')
  expect(methods).toContain('dup')
  expect(methods).toContain('remove')
})

it('#getMiddlewares is returning new array', () => {
  const callWithMiddlewares = transmit(resourceCall).use(mockMiddleware)
  const middlewares = callWithMiddlewares.getMiddlewares();
  callWithMiddlewares.use(mockMiddleware);
  expect(middlewares).toEqual([mockMiddleware])
  expect(callWithMiddlewares.getMiddlewares()).toEqual([mockMiddleware, mockMiddleware])
})

describe('#use', () => {
  it('with no middleware has no middlewares', () => {
    const callWithMiddlewares = transmit(resourceCall)
    expect(callWithMiddlewares.getMiddlewares().length).toEqual(0)
  })

  it('will add new middleware', () => {
    const callWithMiddlewares = transmit(resourceCall).use(mockMiddleware)
    expect(callWithMiddlewares.getMiddlewares().length).toEqual(1)
  })

  it('can be chainable', () => {
    const callWithMiddlewares = transmit(resourceCall).use(mockMiddleware).use(mockMiddleware)
    expect(callWithMiddlewares.getMiddlewares().length).toEqual(2)
  })

  it('add middlewares to list of functions in right order', () => {
    const callWithMiddlewares = transmit(resourceCall).use(mockMiddleware).use(secondMiddleware)
    expect(callWithMiddlewares.getMiddlewares()).toEqual([mockMiddleware, secondMiddleware])
  })

  it('add middlewares to list of functions before given middleware as second argument', () => {
    const callWithMiddlewares = transmit(resourceCall)
      .use(mockMiddleware)
      .use(secondMiddleware)
      .use(thirdMiddleware, secondMiddleware)
    expect(callWithMiddlewares.getMiddlewares()).toEqual([mockMiddleware, thirdMiddleware, secondMiddleware])
  })

  it('add middlewares to list of functions before given index as second argument 0', () => {
    const callWithMiddlewares = transmit(resourceCall)
      .use(mockMiddleware)
      .use(mockMiddleware)
      .use(mockMiddleware)
      .use(mockMiddleware)
      .use(thirdMiddleware, 0)
    expect(callWithMiddlewares.getMiddlewares()).toEqual([thirdMiddleware, mockMiddleware, mockMiddleware, mockMiddleware, mockMiddleware])
  })

  it('add middlewares to list of functions before given index as second argument 1', () => {
    const callWithMiddlewares = transmit(resourceCall)
      .use(mockMiddleware)
      .use(mockMiddleware)
      .use(mockMiddleware)
      .use(mockMiddleware)
      .use(thirdMiddleware, 1)
    expect(callWithMiddlewares.getMiddlewares()).toEqual([mockMiddleware, thirdMiddleware, mockMiddleware, mockMiddleware, mockMiddleware])
  })

  it('add middlewares to list of functions before given index as second argument -1', () => {
    const callWithMiddlewares = transmit(resourceCall)
      .use(mockMiddleware)
      .use(mockMiddleware)
      .use(mockMiddleware)
      .use(mockMiddleware)
      .use(thirdMiddleware, -1)
    expect(callWithMiddlewares.getMiddlewares()).toEqual([mockMiddleware, mockMiddleware, mockMiddleware, thirdMiddleware, mockMiddleware])
  })

  it('add middlewares to list of functions before given index as second argument -2', () => {
    const callWithMiddlewares = transmit(resourceCall)
      .use(mockMiddleware)
      .use(mockMiddleware)
      .use(mockMiddleware)
      .use(mockMiddleware)
      .use(thirdMiddleware, -2)
    expect(callWithMiddlewares.getMiddlewares()).toEqual([mockMiddleware, mockMiddleware, thirdMiddleware, mockMiddleware, mockMiddleware])
  })

  it('add middlewares to list of functions before given index as second argument -10', () => {
    const callWithMiddlewares = transmit(resourceCall)
      .use(mockMiddleware)
      .use(mockMiddleware)
      .use(mockMiddleware)
      .use(mockMiddleware)
      .use(thirdMiddleware, -10)
    expect(callWithMiddlewares.getMiddlewares()).toEqual([thirdMiddleware, mockMiddleware, mockMiddleware, mockMiddleware, mockMiddleware])
  })

  it('add middlewares to list of functions before given index as second argument +10', () => {
    const callWithMiddlewares = transmit(resourceCall)
      .use(mockMiddleware)
      .use(mockMiddleware)
      .use(mockMiddleware)
      .use(mockMiddleware)
      .use(thirdMiddleware, 10)
    expect(callWithMiddlewares.getMiddlewares()).toEqual([mockMiddleware, mockMiddleware, mockMiddleware, mockMiddleware, thirdMiddleware])
  })
})

describe('#remove middleware and return true if removed', () => {
  it('can be chainable', () => {
    const callWithMiddlewares = transmit(resourceCall).use(mockMiddleware).use(secondMiddleware)
    expect(callWithMiddlewares.getMiddlewares().length).toEqual(2)
    expect(callWithMiddlewares.remove(mockMiddleware)).toBeTruthy()
    expect(callWithMiddlewares.getMiddlewares().length).toEqual(1)
  })
})
