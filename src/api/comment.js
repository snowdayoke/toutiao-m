// 评论请求模块
import request from '@/utils/request'

// 获取文章评论列表
export const reqComments = params => request({
  url: 'v1_0/comments',
  method: 'GET',
  params
})

// 评论点赞
export const reqAddCommentLike = target => request({
  url: 'v1_0/comment/likings',
  method: 'POST',
  data: {
    target
  }
})

// 取消评论点赞
export const reqDeleteCommentLike = target => request({
  url: `v1_0/comment/likings/${target}`,
  method: 'DELETE'
})

// 发布文章评论或评论回复
export const reqAddComment = data => request({
  url: 'v1_0/comments',
  method: 'POST',
  data
})
