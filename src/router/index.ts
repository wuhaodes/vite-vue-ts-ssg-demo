import type { Router, RouteLocation, NavigationGuardNext } from 'vue-router'
import event from '@/utils/event'
import request from '@/utils/request'
import storage from '@/utils/storage'
import useStore, { useUserStore } from '@/store'
import { getToken } from '@/utils/auth'

let defaultRouter: any = null

/**
 * @description 附加请求系统信息
 * @param to 跳转到的route
 */
async function checkSystemInfo() {
  const store = useStore()
  const systemConfig = store.systemConfig
  const hasSystemConfig = Object.values(systemConfig).length > 0

  if (hasSystemConfig) {
    return
  }

  await store.getSystemConfig()
}

/**
 * @description 登录前保存重定向路径
 * @param to 跳转到的route
 */
async function saveLoginRedirectPath(to: RouteLocation, from: RouteLocation) {
  if (to.path != '/login') {
    storage.remove('r')
    return
  }
  storage.set('r', from.path)
}

/**
 * @description 通过passport登录保存token
 * @param to 跳转到的route
 */
async function savePassport(to: RouteLocation) {
  const store = useStore()
  const token = getToken() || store.token

  if (token) {
    return
  }

  const pass = (to.query?.pass || '') as string
  if (!pass) {
    return
  }

  const userStore = useUserStore()
  userStore.setToken(pass)
  userStore.setRoles([])
}

/**
 * @description 附加请求个人信息
 */
async function checkUserInfo() {
  const store = useStore()
  const token = getToken() || store.token
  if (!token) {
    return
  }

  const roles = store.roles || []
  if (roles.length > 0) {
    return
  }

  const userStore = useUserStore()
  await userStore.getInfo().catch(() => {
    userStore.fedLogOut()
  })
}

/**
 * @description 有token更正路径
 * @param to 跳转到的route
 * @param next
 */
async function correctRedirect(to: RouteLocation, next: NavigationGuardNext) {
  const store = useStore()
  const token = getToken() || store.token
  if (!token) {
    next()
    return
  }

  // 有token判断
  if (to.path != '/login') {
    next()
    return
  }

  next('/')
}

async function getEnv() {
  return await request({ method: 'get', url: '/web/getEnv' })
}

async function routerGuard(
  to: RouteLocation,
  from: RouteLocation,
  next: NavigationGuardNext
) {
  getEnv()
  const i = (to.query.i || '') as string
  i && storage.set('i', /^[0-9a-zA-Z]{4}$/.test(i) ? to.query?.i : '')

  await saveLoginRedirectPath(to, from)
  await savePassport(to)
  await checkSystemInfo()
  await checkUserInfo()
  await correctRedirect(to, next)
}

/**
 * @description 路由守卫
 * @param router
 */
export function interceptor(router: Router) {
  defaultRouter = router

  router.beforeEach(routerGuard)

  router.afterEach(to => {
    const store = useStore()
    event.emit('router:afterEach')
    const app = document.querySelector('#app')
    app && (app.scrollTop = 0)
    const tab = to.path.split('/')[1] || 'Home'
    const tabName = tab.slice(0, 1).toUpperCase() + tab.slice(1)
    store.tab = tabName as TabType
  })
}

export default defaultRouter
