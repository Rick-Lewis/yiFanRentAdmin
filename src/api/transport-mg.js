import request from '@/utils/request'

// 租车订单
export function viewOrder(data) {
  return request({
    url: `/officialcars/order/${data.id}`,
    method: 'get'
  })
}
export function create(data) {
  return request({
    url: '/officialcars/order/create',
    method: 'post',
    data
  })
}
export function preview(data) {
  return request({
    url: '/officialcars/order/preview',
    method: 'post',
    data
  })
}
export function fetchStore(data) {
  return request({
    url: '/officialcars/rental/store/list',
    method: 'get',
    params: data
  })
}
export function fetchCategory(data) {
  return request({
    url: '/officialcars/rental/vehicle/category/list',
    method: 'get',
    params: data
  })
}
export function fetchBrand(data) {
  return request({
    url: '/officialcars/rental/vehicle/brand/list',
    method: 'get',
    params: data
  })
}
export function fetchModal(data) {
  return request({
    url: '/officialcars/rental/vehicle/model/list',
    method: 'get',
    params: data
  })
}
// 用车申请
export function fetchStatusCheck(data) {
  return request({
    url: '/officialcars/status/application/check',
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
