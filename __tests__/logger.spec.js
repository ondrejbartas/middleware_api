const { logger } = require('../utils/logger');

it('prints no output with debug false', () => {
  console["log"] = jest.fn();
  expect(logger(false)(0, 'foo', 'bar')).toBeFalsy()
  expect(console["log"].mock.calls).toEqual([])
})

it('prints output with depth 0', () => {
  console["log"] = jest.fn();
  logger(true)(0, 'foo', 'bar')
  expect(console["log"].mock.calls).toEqual([['foo bar']])
})

it('prints output with depth 1', () => {
  console["log"] = jest.fn();
  logger(true)(1, 'foo', 'bar')
  expect(console["log"].mock.calls).toEqual([['  foo bar']])
})

it('prints output with depth 2', () => {
  console["log"] = jest.fn();
  logger(true)(2, 'foo', 'bar')
  expect(console["log"].mock.calls).toEqual([['    foo bar']])
})

it('prints output with depth 3 and new lines', () => {
  console["log"] = jest.fn();
  logger(true)(2, 'foo\nbar\nfoobar')
  expect(console["log"].mock.calls).toEqual([['    foo\n    bar\n    foobar']])
})
