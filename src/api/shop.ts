import request from '@/utils/request'
export default {
  async my() {
    return await request({
      url: '/shop/queryShopDetail',
      method: 'post',
    })
  },
  async register(data: Record<string, any>) {
    return await request({
      url: '/web/shop/register',
      method: 'post',
      data,
    })
  },
}
