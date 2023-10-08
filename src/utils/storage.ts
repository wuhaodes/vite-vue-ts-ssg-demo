export default {
  set(key: string, val: any, ms = 1000 * 60 * 60 * 0.5) {
    if (!localStorage) {
      return
    }
    try {
      const expireTime = Date.now() + ms
      localStorage.setItem(key, JSON.stringify({ data: val, expireTime }))
    } catch (e) {
      console.error(e)
    }
  },
  get(key: string, once = false) {
    if (!localStorage) {
      return
    }
    if (!key) {
      return
    }
    let val
    try {
      const resStr = localStorage.getItem(key) || '{"expireTime":0}'
      const { expireTime, data } = JSON.parse(resStr) || { expireTime: 0 }
      const now = Date.now()
      if (now > expireTime || once) {
        this.remove(key)
        return
      }
      val = data
    } catch (e) {
      console.error(e)
    }
    return val
  },
  remove(key: string) {
    if (!localStorage) {
      return
    }
    if (!key) {
      return
    }
    localStorage.removeItem(key)
  },
  clear() {
    if (!localStorage) {
      return
    }
    localStorage.clear()
  },
}
