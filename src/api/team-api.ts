import request from '../request/request'
import qs from 'qs'

/**
 * 创建队伍
 */
export function addTeam(data) {
  return request.post('/team/add', data)
}

/**
 * 更新队伍
 */
export function updateTeam(data) {
  return request.post('/team/update', data)
}

/**
 * 获取队伍详情
 */
export function getTeamById(id: number) {
  return request.get('/team/get', { params: { id } })
}

/**
 * 获取队伍列表
 */
export function listTeams(query) {
  return request.get('/team/list', { params: query })
}

/**
 * 队伍分页
 */
export function listTeamsByPage(query) {
  return request.get('/team/list/page', { params: query })
}

/**
 * 加入队伍
 */
export function joinTeam(data) {
  return request.post('/team/join', data)
}

/**
 * 退出队伍
 */
export function quitTeam(data) {
  return request.post('/team/quit', data)
}

/**
 * 删除队伍
 */
export function deleteTeam(data) {
  return request.post('/team/delete', data)
}

/**
 * 获取我创建的队伍
 */
export function listMyCreateTeams(query) {
  return request.get('/team/list/my/create', { params: query })
}

/**
 * 获取我加入的队伍
 */
export function listMyJoinTeams(query) {
  return request.get('/team/list/my/join', { params: query })
}