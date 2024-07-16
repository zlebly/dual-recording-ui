import request from '@/utils/request'

// 查询机构列表
export function listDept(query) {
  return request({
    url: '/system/org/list',
    method: 'get',
    params: query
  })
}

// 查询机构列表（排除节点）
export function listDeptExcludeChild(orgCode) {
  return request({
    url: '/system/org/list/exclude/' + orgCode,
    method: 'get'
  })
}

// 查询机构详细
export function getDept(orgCode) {
  return request({
    url: '/system/org/' + orgCode,
    method: 'get'
  })
}

// 新增机构
export function addDept(data) {
  return request({
    url: '/system/org',
    method: 'post',
    data: data
  })
}

// 修改机构
export function updateDept(data) {
  return request({
    url: '/system/org',
    method: 'put',
    data: data
  })
}

// 删除机构
export function delDept(orgCode) {
  return request({
    url: '/system/org/' + orgCode,
    method: 'delete'
  })
}