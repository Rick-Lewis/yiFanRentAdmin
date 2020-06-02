import request from '@/utils/request'

// 用车申请
export function fetchStatusCheck(data) {
  return request({
    url: '/officialcars/status/check',
    method: 'get',
    params: data
  })
}
export function fetchFlowList(data) {
  return request({
    url: '/officialcars/check/flow/list',
    method: 'get',
    params: data
  })
}
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
