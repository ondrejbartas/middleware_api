const { isPromise } = require('../utils/isPromise');

const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve({status: 'OK', body: '{"foo": }'});
  }, 100)})

const asyncAwait = async () => {
  await promise;
}

const objectWithThen = {
  then: () => {}
}

it('returns true for Promise', () => {
  expect(isPromise(promise)).toBeTruthy();
})

it('returns true for Async/Await function', () => {
  expect(isPromise(asyncAwait())).toBeTruthy();
})

it('returns true for object with then', () => {
  expect(isPromise(objectWithThen)).toBeTruthy();
})

it('returns false for undefined', () => {
  expect(isPromise(undefined)).toBeFalsy();
})

it('returns false for {}', () => {
  expect(isPromise({})).toBeFalsy();
})

it('returns false for true', () => {
  expect(isPromise(true)).toBeFalsy();
})
