const { transmit } = require('../../index')
const { timeout, TimeoutError } = require('../timeout')

const resourceCallWithLongResponse = () => {
  return (args) => new Promise(
    (resolve, reject) => {
      setTimeout(() => {
        resolve(counter);
      }, 2000)
    }
  )
}

it('throws timeout error when resource takes to long to process', async () => {
  const trans = transmit(resourceCallWithLongResponse()).use(timeout(1000))

  try {
    console.log('BBB', await trans())
  } catch(error) {
    expect(error).toEqual(TimeoutError)
  }
})
