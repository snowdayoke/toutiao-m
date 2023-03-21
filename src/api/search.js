// 文章搜索请求模块
import request from '@/utils/request'

// 获取联想建议接口
export const reqSearchSuggestion = (q) => request({
  url: 'v1_0/suggestion',
  method: 'GET',
  params: {
    q
  }
})

// 获取搜索结果
export const reqSearchResult = (params) => request({
  url: 'v1_0/search',
  method: 'GET',
  params: params
})
