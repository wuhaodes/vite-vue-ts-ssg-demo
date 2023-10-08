import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token: string) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  Cookies.remove(TokenKey)
}

export function clearCookie() {
  const keys = document.cookie.match(/[^ =;]+(?=\=)/g)
  keys?.forEach(key => {
    Cookies.remove(key)
  })
}
