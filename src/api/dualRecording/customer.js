import request from '@/utils/request'

export function getIdTypeOptions() {
  return request({
    url: '/dualRecording/getIdTypeOptions',
    method: 'get'
  })
}

export function getUserIdOptions() {
  return request({
    url: '/dualRecording/getUserIdOptions',
    method: 'get'
  })
}

export function getOrgCodeOptions() {
  return request({
    url: '/dualRecording/getOrgCodeOptions',
    method: 'get'
  })
}

export function getCustomerInfoList(query) {
  return request({
    url: '/dualRecording/getCustomerInfo',
    method: 'get',
    params: query
  })
}

export function getProductList() {
  return request({
    url: '/product/getProductInfo',
    method: 'get'
  })
}

// 添加产品信息
export function addCustomer(data) {
  return request({
    url: '/dualRecording/add',
    method: 'post',
    data: data
  })
}

// 修改产品信息
export function updateCustomer(data) {
  return request({
    url: '/dualRecording/update',
    method: 'post',
    data: data
  })
}

// 删除产品信息
export function delCustomer(id) {
  return request({
    url: '/dualRecording/delete/' + id,
    method: 'delete'
  })
}

export function getCustomerDualRecordingReport(orgCode, userId) {
  return request({
    url: '/dualRecording/getCustomerReport',
    method: 'get',
    params: {orgCode, userId}
  })
}

export function getOrganDualRecordingReport(orgCode) {
  return request({
    url: '/dualRecording/getOrgReport',
    method: 'get',
    params: orgCode
  })
}