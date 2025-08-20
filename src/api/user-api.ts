import request from '../request/request'
import qs from 'qs'

/**
 * 获取当前登录用户信息
 */
export function getCurrentUser() {
  return request.get('/user/current')
}

/**
 * 用户登录
 * @param data { userAccount: string, userPassword: string }
 */
export function login(data: { userAccount: string; userPassword: string }) {
  return request.post('/user/login', data)
}

/**
 * 用户注册
 * @param data { userAccount: string, userPassword: string, checkPassword: string }
 */
export function register(data: { userAccount: string; userPassword: string; checkPassword: string }) {
  return request.post('/user/register', data)
}

/**
 * 用户登出
 */
export function logout() {
  return request.post('/user/logout')
}

/**
 * 搜索用户
 * @param username 用户名关键字
 */
export function searchUsers(username?: string) {
  return request.get('/user/search', {
    params: { username }
  })
}
//根据用户id得到用户信息
export function getUserById(userId: number | string) {
  return request.get(`/user/profile/${userId}`);
}

/**
 * 根据标签搜索用户
 * @param tagNameList 标签列表
 */
export function searchUsersByTags(tagNameList?: string[]) {
  return request.get('/user/search/tags', {
    params: { tagNameList },
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
  })
}

/**
 * 获取推荐用户
 * @param pageNum 当前页码
 * @param pageSize 每页数量
 */
export function recommendUsers(pageNum: number, pageSize: number) {
  return request.get('/user/recommend', {
    params: {
      pageNum,
      pageSize
    }
  })
}

export function updateUser(data: Partial<User>) {
  return request.post('/user/update', data)
}

/**
 * 匹配相似用户
 * @param num 匹配数量
 */
export function matchUsers(num: number) {
  return request.get('/user/match', {
    params: {
      num
    }
  })
}

/**
 * 获取好友列表
 */
export function getFriendList() {
  return request.get('/friend/list')
}

/**
 * 发送好友请求
 * @param data { friendId: number }
 */
export function addFriendRequest(data: { friendId: number }) {
  return request.post('/friend/request', data)
}

/**
 * 处理好友请求
 * @param data { friendId: number, status: number }
 */
export function handleFriendRequest(data: { friendId: number; status: number }) {
  return request.post('/friend/handle', data)
}

/**
 * 删除好友
 * @param data { friendId: number }
 */
export function deleteFriend(data: { friendId: number }) {
  return request.post('/friend/delete', data)
}

/**
 * 获取好友请求数量
 */
export function getFriendRequestCount() {
  return request.get('/friend/request/count')
}