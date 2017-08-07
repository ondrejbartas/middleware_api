const { transmit } = require('../../index')
const { broker } = require('../broker')

const resourceCallWithDifferentReponses = () => {
  let counter = 0
  return (args) => new Promise(
    (resolve, reject) => {
      counter += 1
      setTimeout(() => {
        resolve(counter);
      }, 500)
    }
  )
}

describe('test of mocked resource', () => {
  it('returns different counters', async () => {
    const resource = resourceCallWithDifferentReponses();
    expect(await resource()).toEqual(1)
    expect(await resource()).toEqual(2)
    expect(await resource()).toEqual(3)
  })
})

it('fetch 1 request, and before it is resolved, lets fetch 2 one. Both should be merged and resolved with same response', async () => {
  const resource = resourceCallWithDifferentReponses();
  const trans = transmit(resource).use(broker())
  const req1 = trans()
  const req2 = trans()

  expect(await req1).toEqual(1)
  expect(await req2).toEqual(1)

  expect(await trans()).toEqual(2)
})
