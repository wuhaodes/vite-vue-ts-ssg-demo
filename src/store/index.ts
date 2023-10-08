import { defineStore } from 'pinia'
import useUserStore from './user'
import systemApi from '@/api/system'

export { default as useUserStore } from './user'

function useUserStoreFactory(fn: (useStore: any) => any) {
  return function () {
    const userStore = useUserStore()
    return fn(userStore)
  }
}

export default defineStore<string, StoreState, StoreGetters, StoreActions>(
  'default',
  {
    state: () => ({
      tab: 'Home',
      systemConfig: {},
    }),
    getters: {
      token: useUserStoreFactory(store => store.token),
      isLogin: useUserStoreFactory(store => !!store.token),
      avatar: useUserStoreFactory(store => store.user.avatar),
      name: useUserStoreFactory(store => store.user.name),
      userId: useUserStoreFactory(store => store.user.userId),
      introduction: useUserStoreFactory(store => store.user.introduction),
      roles: useUserStoreFactory(store => store.roles),
      accountId: useUserStoreFactory(store => store.accountInfo.id),
      user: useUserStoreFactory(store => store.user),
      isBidAccountDisabled: useUserStoreFactory(
        store => store.accountInfo.status != 0
      ),
      isBidLogin: useUserStoreFactory(store => !!store.user.accountId),
    },
    actions: {
      async getSystemConfig() {
        const systemRes = await systemApi.getConfig().catch(console.error)
        if (!systemRes) {
          return
        }
        this.systemConfig = systemRes.data || {}
      },
    },
  }
)
