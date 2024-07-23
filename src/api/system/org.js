import request from '@/utils/request'

// 查询机构列表
export function listOrg(query) {
  return request({
    url: '/system/org/list',
    method: 'get',
    params: query
  })
}

// 查询机构列表（排除节点）
export function listOrgExcludeChild(orgCode) {
  return request({
    url: '/system/org/list/exclude/' + orgCode,
    method: 'get'
  })
}

// 查询机构详细
export function getOrg(orgCode) {
  return request({
    url: '/system/org/' + orgCode,
    method: 'get'
  })
}

// 新增机构
export function addOrg(data) {
  return request({
    url: '/system/org',
    method: 'post',
    data: data
  })
}

// 修改机构
export function updateOrg(data) {
  return request({
    url: '/system/org',
    method: 'put',
    data: data
  })
}

// 删除机构
export function delOrg(orgCode) {
  return request({
    url: '/system/org/' + orgCode,
    method: 'delete'
  })
}