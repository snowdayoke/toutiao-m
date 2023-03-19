// 请求模块
import axios from 'axios'
import store from '@/store/index'

const request = axios.create({
  baseURL: 'http://toutiao.itheima.net/' // 基础路径
})

// 请求拦截器
request.interceptors.request.use((config) => {
  // 请求发起会经过这里
  const { user } = store.state
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }

  // 注意：这里务必要范湖config 配置对象，否则请求就停在这里出不去
  return config
}, (error) => {
  // 如果请求出错了（还没有发出去）会进入这里
  return Promise.reject(error)
})

// 响应拦截器

export default request
