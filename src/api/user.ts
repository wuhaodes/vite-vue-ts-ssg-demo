import request from '@/utils/request'
export default {
  checkIdentity() {
    return request({
      url: '/system/user/checkIdentityFlag',
      method: 'get',
    })
  },
}
