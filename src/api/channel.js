// channel请求模块
import request from '@/utils/request'

export const reqAllChannels = () => request({
  url: 'v1_0/channels',
  method: 'GET'
})
