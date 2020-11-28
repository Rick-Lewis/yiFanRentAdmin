import request from '@/utils/request'

// 角色管理
export function addRole(data) {
  return request({
    url: '/officialcars/role/save',
    method: 'post',
    data
  })
}
export function roleToggleStatus(data) {
  const temp = data.status ? 'disable' : 'enable'
  return request({
    url: `/officialcars/role/${temp}/${data.id}`,
    method: 'post'
  })
}
export function fetchRoleList(data) {
  return request({
    url: `/officialcars/role/page`,
    method: 'get',
    params: data
  })
}
// 菜单管理
export function addMenu(data) {
  return request({
    url: '/officialcars/menu/save',
    method: 'post',
    data
  })
}
export function fetchMenuList(data) {
  return request({
    url: `/officialcars/menu/page`,
    method: 'get',
    params: data
  })
}
export function getMenuDetail(data) {
  return request({
    url: `/officialcars/menu/${data.id}`,
    method: 'get'
  })
}
export function menuToggleStatus(data) {
  const temp = data.status ? 'disable' : 'enable'
  return request({
    url: `/officialcars/menu/${temp}/${data.id}`,
    method: 'post'
  })
}

// 功能管理
export function addFunction(data) {
  return request({
    url: '/officialcars/function/save',
    method: 'post',
    data
  })
}
export function fetchFunctionList(data) {
  return request({
    url: `/officialcars/function/page`,
    method: 'get',
    params: data
  })
}
export function getFunctionDetail(data) {
  return request({
    url: `/officialcars/function/${data.id}`,
    method: 'get'
  })
}
export function functionToggleStatus(data) {
  return request({
    url: `/officialcars/function/delete/${data.id}`,
    method: 'delete'
  })
}

