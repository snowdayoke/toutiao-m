// 文章请求模块
import request from '@/utils/request'

// 获取频道内容的接口
export const reqArticles = (params) => request({
  url: 'v1_0/articles',
  method: 'GET',
  params
})
