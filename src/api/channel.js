// channel请求模块
import request from '@/utils/request'

// 获取所有频道列表
export const reqAllChannels = () => request({
  url: 'v1_0/channels',
  method: 'GET'
})

// 设置用户的频道（部分覆盖）
export const reqAddUserChannels = (channel) => request({
  url: 'v1_0/user/channels',
  method: 'PATCH',
  data: {
    channels: [channel]
  }
})

// 删除指定用户的频道
export const reqDeleteUserChannels = (channelId) => request({
  url: `v1_0/user/channels/${channelId}`,
  method: 'DELETE'
})
