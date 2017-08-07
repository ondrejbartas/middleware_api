const { transmit } = require('../../index')
const { retry } = require('../retry')

const resourceCallWithError = (counter = 2) => (args) => new Promise(
  (resolve, reject) => {
    counter -= 1
    setTimeout(() => {
      if (counter >= 0) {
        reject(`some error ${args}`)
      } else {
        resolve({status: 'OK', body: '{"foo": "bar"}'});
      }
    }, 100)
  }
)

describe('test of mocked resource', () => {
  it('fails 2 times and then returns valid response', async () => {
    const resource = resourceCallWithError(2);
    try {
      await resource(1)
    } catch (error) {
      expect(error).toEqual('some error 1')
    }

    try {
      await resource(1)
    } catch (error) {
      expect(error).toEqual('some error 1')
    }

    expect((await resource()).status).toEqual('OK')
  })
})

it('retries middleware stack when received error for 2 times', async () => {
  const resource = resourceCallWithError(2);
  const trans = transmit(resource).use(retry(2, 1000))
  expect((await trans(2)).status).toEqual('OK')
})

it('retries middleware stack when received error for 5 times', async () => {
  const resource = resourceCallWithError(3);
  const trans = transmit(resource).use(retry(5, 1000))
  expect((await trans(3)).status).toEqual('OK')
})

it('retries middleware stack when received error and when reached limit with no success throws error', async () => {
  const resource = resourceCallWithError(2);
  const trans = transmit(resource).use(retry(1, 1000))

  try {
    await trans(4)
  } catch (error) {
    expect(error).toEqual('some error 4')
  }
})

it('retries middleware stack when received error for 5 times and adds delay to every retry', async () => {
  const startTime = Date.now();
  const resource = resourceCallWithError(3);
  const trans = transmit(resource).use(retry(5, 1500))
  expect((await trans(5)).status).toEqual('OK')
  expect(Date.now()).toBeGreaterThan(startTime + 3000);
})
