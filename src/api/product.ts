import request from '@/utils/request'
export default {
  async list(data: Record<string, any>) {
    return await request({
      url: '/web/pass/product/search',
      method: 'post',
      data,
    })
  },
}
