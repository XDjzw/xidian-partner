import axios from 'axios'
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios'

const service = axios.create({
  baseURL: '/api',
  timeout: 5000,
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log('请求拦截:', config.url)

    const token = localStorage.getItem('token')
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`)
    }

    return config
  },
  (error) => {
    console.error('请求出错:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('响应拦截:', response.config.url, response.data)

    const res = response.data

  
      return res
  
  },
  (error) => {
    console.error('响应异常:', error.message)

    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error('未授权，请登录')
          break
        case 403:
          console.error('拒绝访问')
          break
        case 404:
          console.error('请求地址不存在')
          break
        default:
          console.error('服务异常')
      }
    } else {
      console.error('请求失败:', error.message)
    }

    return Promise.reject(error)
  }
)

export default service