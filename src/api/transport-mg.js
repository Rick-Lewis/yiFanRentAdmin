import request from '@/utils/request'

// 租车订单
export function fetchStore(data) {
  return request({
    url: '/rentalcars/store/page',
    method: 'get',
    params: data
  })
}
export function fetchVehicleModel(data) {
  return request({
    url: '/rentalcars/wechat/vehicle/model/list',
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
