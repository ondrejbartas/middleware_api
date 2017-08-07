const delayPromise = (interval, resolveWith = true) => new Promise((resolve) => setTimeout(()=> resolve(resolveWith), interval))

module.exports = {
  delayPromise
}
