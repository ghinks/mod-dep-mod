const cache = {}
export const getCache = (url) => cache[url]
export const setCache = (url, response) => {
  cache[url] = response
}
