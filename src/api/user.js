/* 用户请求相关模块 */
import request from '@/utils/request'
// import store from '@/store/index'

// 登录注册
export const reqLogin = (data) => request({
  url: 'v1_0/authorizations',
  method: 'POST',
  data
})

// 发送验证码
export const reqSendSms = (mobile) => request({
  url: `v1_0/sms/codes/${mobile}`,
  method: 'GET'
})

// 获取用户自己信息
export const reqUserInfo = () => request({
  url: 'v1_0/user',
  method: 'GET'
  // 发送请求头数据
  // headers: {
  //   // 注意:该接口需要授权才能访问
  //   Authorization: `Bearer ${store.state.user.token}`
  // }
})

// 获取用户自己的频道列表
export const reqUserChannels = () => request({
  url: 'v1_0/user/channels',
  method: 'GET'
})
