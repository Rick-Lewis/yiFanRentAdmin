import request from '@/utils/request'

// 人员管理
export function fetchStaffList(data) {
  return request({
    url: '/officialcars/user/page',
    method: 'post',
    headers: {
      contentType: 'application/json'
    },
    data
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
    method: 'post',
    data
  })
}
export function addEnterprise(data) {
  return request({
    url: '/officialcars/Enterprise/save',
    method: 'post',
    data
  })
}
// 部门管理
export function fetchDepartmentList(data) {
  return request({
    url: '/officialcars/department/page',
    method: 'post',
    data
  })
}
export function addDepartment(data) {
  return request({
    url: '/officialcars/department/save',
    method: 'post',
    data
  })
}

