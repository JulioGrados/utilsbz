const cookie = require('js-cookie')

const setCookie = async (key, value) => {
  cookie.set(key, value, {
    expires: 365,
    path: '/'
  })
}

const removeCookie = key => {
  if (process.browser) {
    cookie.remove(key, {
      expires: 365
    })
  }
}

const getCookie = (key, req) => {
  return !req ? getCookieFromBrowser(key) : getCookieFromServer(key, req)
}

const getCookieFromBrowser = key => {
  return cookie.get(key)
}

const getCookieFromServer = (key, req) => {
  if (!req.headers.cookie) {
    return undefined
  }
  const rawCookie = req.headers.cookie
    .split(';')
    .find(c => c.trim().startsWith(`${key}=`))

  if (!rawCookie) {
    return undefined
  }
  return rawCookie.split('=')[1]
}

module.exports = {
  getCookie,
  setCookie,
  removeCookie
}
