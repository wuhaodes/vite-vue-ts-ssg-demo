import request from '@/utils/request'
export default {
  async list(location: string | number) {
    return await request({
      url: `/web/businessAd/page/${location}`,
      method: 'get',
    })
  },
}
