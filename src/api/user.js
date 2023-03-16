/* 用户请求相关模块 */
import request from '@/utils/request'

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
