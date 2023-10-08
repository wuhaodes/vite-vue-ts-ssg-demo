import request from '@/utils/request'

export default {
  getDicts(dictType: string) {
    return request({
      url: `/web/pass/type/${dictType} `,
      method: 'get',
    })
  },
}
