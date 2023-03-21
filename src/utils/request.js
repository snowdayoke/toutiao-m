// 请求模块
import axios from 'axios'
import store from '@/store/index'
import JSONBig from 'json-bigint'

const request = axios.create({
  baseURL: 'http://toutiao.itheima.net/', // 基础路径

  // 自定义后端返回的原始数据
  // data：后端返回的原始数据，说白了就是 JSON格式的字符串
  transformResponse: [function (data) {
    try {
      return JSONBig.parse(data)
    } catch (error) {
      return data
    }
    // axios 默认会在内部这样来处理后端返回的数据
    // return JSON.parse(data)
  }]
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
