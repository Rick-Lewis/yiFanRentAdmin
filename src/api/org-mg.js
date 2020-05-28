import request from '@/utils/request'

// 用车申请
export function fetchApplicationList(data) {
  return request({
    url: '/officialcars/application/page',
    method: 'get',
    params: data
  })
}
export function applicationCancel(data) {
  return request({
    url: `/officialcars/application/cancel/${data.id}`,
    method: 'post'
  })
}
export function addApplication(data) {
  return request({
    url: '/officialcars/application/save',
    method: 'post',
    data
  })
}
export function fetchApplicationDetail(data) {
  return request({
    url: `/officialcars/application/${data.id}`,
    method: 'get'
  })
}
// 人员管理
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
// 企业管理
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

