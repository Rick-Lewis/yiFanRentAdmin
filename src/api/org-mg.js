import request from '@/utils/request'

export function fetchStaffList(query) {
  return request({
    url: '/user/page',
    method: 'get',
    params: query
  })
}
