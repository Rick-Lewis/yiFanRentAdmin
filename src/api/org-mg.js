import request from '@/utils/request'

// 人员管理
export function judge(data) {
  return request({
    url: `/officialcars/user/judge`,
    method: 'get',
    params: data
  })
}
// 人员管理
export function getStaffById(data) {
  return request({
    url: `/officialcars/user/${data.id}`,
    method: 'get'
  })
}
export function fetchStaffList(data) {
  return request({
    url: '/officialcars/user/page',
    method: 'get',
    params: data
  })
}
export function addStaff(data) {
  return request({
    url: '/officialcars/user/save',
    method: 'post',
    data
  })
}
// 单位管理
export function fetchEnterpriseList(data) {
  return request({
    url: '/officialcars/enterprise/page',
    method: 'get',
    params: data
  })
}
export function addEnterprise(data) {
  return request({
    url: '/officialcars/enterprise/save',
    method: 'post',
    data
  })
}
export function reset(data) {
  return request({
    url: '/officialcars/user/password/reset',
    method: 'post',
    data
  })
}
// 部门管理
export function fetchDepartmentList(data) {
  return request({
    url: '/officialcars/department/page',
    method: 'get',
    params: data
  })
}
export function addDepartment(data) {
  return request({
    url: '/officialcars/department/save',
    method: 'post',
    data
  })
}

