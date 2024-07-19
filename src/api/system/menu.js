import request from '@/utils/request'

// 查询菜单列表
export function listMenu(query) {
  return request({
    url: '/system/function/list',
    method: 'get',
    params: query
  })
}

// 查询菜单详细
export function getMenu(functionCode) {
  return request({
    url: '/system/function/' + functionCode,
    method: 'get'
  })
}

// 查询菜单下拉树结构
export function treeSelect() {
  return request({
    url: '/system/function/treeSelect',
    method: 'get'
  })
}

// 根据角色ID查询菜单下拉树结构
export function roleFunctionTreeSelect(roleCode) {
  return request({
    url: '/system/function/roleFunctionTreeSelect/' + roleCode,
    method: 'get'
  })
}

// 新增菜单
export function addMenu(data) {
  return request({
    url: '/system/function',
    method: 'post',
    data: data
  })
}

// 修改菜单
export function updateMenu(data) {
  return request({
    url: '/system/function',
    method: 'put',
    data: data
  })
}

// 删除菜单
export function delMenu(functionCode) {
  return request({
    url: '/system/function/' + functionCode,
    method: 'delete'
  })
}