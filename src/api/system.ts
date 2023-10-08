import request from '@/utils/request'
export default {
  async getConfig() {
    return await request({
      url: '/web/pass/sys/config/get',
      method: 'get',
    })
  },
  async partnerList() {
    return await request({
      url: '/web/pass/partner/list',
      method: 'get',
    })
  },
}
