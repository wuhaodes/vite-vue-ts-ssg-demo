/* eslint-disable */
type TabType =
  | 'Home'
  | 'BatchPurchaseOrder'
  | 'BiddingProcurement'
  | 'NetworkService'
  | 'PlasticTrade'
  | 'RetailMall'
  | 'BusinessCollege'
  | 'MachineDevice'
  | 'DigitalCity'

interface UserStoreState {
  token: string
  roles: string[]
  accountInfo: Record<string, any>
  user: Record<string, any>
}

interface UserStoreActions {
  setToken: (token: string) => void
  setRoles: (roles: string[]) => void
  login: (userInfo: Record<string, any>) => Promise<string>
  getInfo: () => Promise<void | Record<string, any>>
  logout: () => void
  fedLogOut: () => void
  clearState: () => void
}

interface StoreState {
  tab: TabType
  systemConfig: Record<string, any>
}

interface StoreGetters {
  token: () => string
  isLogin: () => boolean
  avatar: () => string
  name: () => string
  userId: () => string | number
  introduction: () => string
  roles: () => string[]
  accountId: () => string | number
  user: () => Record<string, any>
  isBidAccountDisabled: () => boolean
  isBidLogin: () => boolean
  [index: string]: any
}

interface StoreActions {
  getSystemConfig: () => Promise<void>
}
