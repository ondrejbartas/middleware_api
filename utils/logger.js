const logger = (debug) => (depth, ...texts) => {
  if (!debug) {
    return false
  }

  console.log(
    texts.join(' ')
      .split('\n')
      .filter(t => t.length > 0)
      .map(t => ["  ".repeat(depth), t].join(''))
      .join('\n')
  )
}

module.exports = {
  logger
}
