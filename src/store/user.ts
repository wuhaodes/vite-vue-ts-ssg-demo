import { defineStore } from 'pinia'
import { clearCookie, getToken, setToken } from '@/utils/auth'
import { getInfo, login, logout } from '@/api/login'

export default defineStore<string, UserStoreState, {}, UserStoreActions>(
  'user',
  {
    state: () => ({
      token: getToken() || '',
      roles: [],
      accountInfo: {},
      user: {},
    }),
    actions: {
      setToken(token: string) {
        this.token = token
        setToken(token)
      },
      setRoles(roles: string[]) {
        this.roles = roles
      },
      async login(userInfo: Record<string, any>): Promise<string> {
        const userAccount = userInfo.userAccount.trim()
        const password = userInfo.password
        const code = userInfo.code
        const uuid = userInfo.uuid

        const loginRes = await login({
          userAccount,
          password,
          code,
          uuid,
        }).catch(console.error)
        if (!loginRes) {
          return ''
        }
        const token: string = loginRes.token || ''
        this.token = token
        setToken(token)
        return token
      },
      async getInfo() {
        const infoRes = await getInfo().catch(() => {
          this.fedLogOut()
        })
        if (!infoRes) {
          return
        }
        const { roles = [], user = {} } = infoRes || {}
        this.roles = roles || []
        this.user = user
        return infoRes as Record<string, any>
      },
      logout() {
        logout().catch((e: any) => {
          throw e
        })
        this.clearState()
      },
      fedLogOut() {
        this.clearState()
      },
      clearState() {
        this.token = ''
        this.roles = []
        this.accountInfo = {}
        this.user = {}
        clearCookie()
      },
    },
  }
)
