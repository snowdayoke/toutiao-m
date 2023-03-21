// 文章请求模块
import request from '@/utils/request'

// 获取频道内容的接口
export const reqArticles = (params) => request({
  url: 'v1_0/articles',
  method: 'GET',
  params
})

// 获取文章新闻详情
export const reqArticleById = (articleId) => request({
  url: `v1_0/articles/${articleId}`,
  method: 'GET'
})

// 收藏文章
export const reqAddCollect = (target) => request({
  url: 'v1_0/article/collections',
  method: 'POST',
  data: {
    target
  }
})

// 取消收藏文章
export const reqDeleteCollect = (target) => request({
  url: `v1_0/article/collections/${target}`,
  method: 'DELETE'
})

// 点赞文章
export const reqAddLike = (target) => request({
  url: 'v1_0/article/likings',
  method: 'POST',
  data: {
    target
  }
})

// 取消点赞文章
export const reqDeleteLike = (target) => request({
  url: `v1_0/article/likings/${target}`,
  method: 'DELETE'
})
