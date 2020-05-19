import request from '@/utils/request'

// 人员管理
export function fetchStaffList(query) {
  return request({
    url: '/officialcars/user/page',
    method: 'get',
    body: query
  })
}
// 企业管理
export function fetchEnterpriseList(query) {
  return request({
    url: '/officialcars/enterprise/page',
    method: 'get',
    params: query
  })
}
// 部门管理
export function fetchDepartmentList(query) {
  return request({
    url: '/officialcars/department/page',
    method: 'get',
    params: query
  })
}
